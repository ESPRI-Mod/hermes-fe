(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var
        // Sets simulation's current execution status.
        setExecutionState = function (simulation) {
            simulation.executionState = MOD.getSimulationComputeState(simulation);
            MOD.cv.setFieldDisplayName(simulation, 'simulation_state', 'executionState');
        },

        // Sets simulation's execution end date.
        setExecutionEndDate = function (simulation) {
            var executionEndDate;

            executionEndDate = MOD.getSimulationComputeEndDate(simulation);
            if (executionEndDate) {
                simulation.ext.executionEndDate = executionEndDate.slice(0, 19);
            }
        },

        // Sorts a job set.
        sortComputeJobset = function (simulation) {
            if (simulation.jobs.compute.all.length > 1) {
                simulation.jobs.compute.all = _.sortBy(simulation.jobs.compute.all, function (job) {
                    return job.executionStartDate;
                });
            }
        },

        // Maps a job to the relevant simulation job set.
        mapJob = function (job) {
            var jobs;

            if (_.has(MOD.state.simulationSet, job.simulationUID) === false) {
                return;
            }

            jobs = MOD.state.simulationSet[job.simulationUID].jobs;
            jobs.all.push(job);
            switch (job.typeof) {
            case 'computing':
                jobs.compute.all.push(job);
                jobs.compute[job.executionState].push(job);
                break;
            case 'post-processing':
                jobs.postProcessing[job.executionState].push(job);
                break;
            case 'post-processing-from-checker':
                jobs.postProcessingFromChecker[job.executionState].push(job);
                break;
            default:
                break;
            }
        };

    // Module data parser.
    MOD.parser = {
        // Parses loaded timeslice.
        parseTimeslice: function (simulationList, jobList) {
            // Extend simulations.
            _.each(simulationList, MOD.extendSimulation);
            MOD.log("timeslice simulations extended");

            // Map jobs to simulations.
            _.each(jobList, mapJob);
            MOD.log("timeslice jobs mapped");

            // Sort compute jobs (required in order to determine simulation execution status).
            _.each(simulationList, sortComputeJobset);
            MOD.log("timeslice compute jobs sorted");

            // Set execution states.
            _.each(simulationList, setExecutionState);
            MOD.log("timeslice simulation compute state assigned");

            // Set execution end dates.
            _.each(simulationList, setExecutionEndDate);
            MOD.log("timeslice simulation compute end date assigned");
        },

        // Parses web-socket event data.
        parseEvent: function (simulation, jobList) {
            // Extend simulation.
            MOD.extendSimulation(simulation);

            // Map jobs to simulation.
            _.each(jobList, mapJob);

            // Sort compute jobs (required in order to determine simulation execution status).
            sortComputeJobset(simulation);

            // Set execution state.
            setExecutionState(simulation);

            // Set execution end date.
            setExecutionEndDate(simulation);
        }
    };

}(
    this.APP.modules.monitoring,
    this._
));
