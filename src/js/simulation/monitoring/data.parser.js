(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var mapJob,
        setExecutionState,
        sortComputeJobset;

    // Sets simulation's current execution status.
    setExecutionState = function (simulation) {
        simulation.executionState = MOD.getSimulationComputeState(simulation);
        MOD.cv.setFieldDisplayName(simulation, 'simulation_state', 'executionState');
    };

    // Sorts a job set.
    sortComputeJobset = function (simulation) {
        if (simulation.jobs.compute.all.length > 1) {
            simulation.jobs.compute.all = _.sortBy(simulation.jobs.compute.all, function (job) {
                return job.executionStartDate;
            });
        }
    };

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

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobList) {
        MOD.parseSimulations([simulation], jobList, _.indexBy([simulation], "uid"));
    };

    // Module data parser.
    MOD.parser = {
        // Parses loaded timeslice.
        parseTimeslice: function (simulationList, jobList) {
            // Extend simulations.
            _.each(simulationList, MOD.extendSimulation);
            MOD.log("timeslice simulations extended");

            // Extend jobs.
            _.each(jobList, MOD.extendJob);
            MOD.log("timeslice jobs extended");

            // Map jobs to simulations.
            _.each(jobList, mapJob);
            MOD.log("timeslice jobs mapped");

            // Sort compute jobs (required in order to determine simulation execution status).
            _.each(simulationList, sortComputeJobset);
            MOD.log("timeslice compute jobs sorted");

            // Set execution states.
            _.each(simulationList, setExecutionState);
            MOD.log("timeslice simulation execution state assigned");
        },

        // Parses web-socket event data.
        parseEvent: function (simulation, jobList) {
            // Extend simulation.
            MOD.extendSimulation(simulation);

            // Extend jobs.
            _.each(jobList, MOD.extendJob);

            // Map jobs to simulation.
            _.each(jobList, mapJob);

            // Sort compute jobs (required in order to determine simulation execution status).
            sortComputeJobset(simulation);

            // Set execution state.
            setExecutionState(simulation);
        }
    };

}(
    this.APP.modules.monitoring,
    this._
));
