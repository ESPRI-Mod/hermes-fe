(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var
        // Returns colleciton of managed job sets.
        getJobSets = function (simulation) {
            return [
                simulation.jobs.compute,
                simulation.jobs.postProcessing
            ];
        },

        // Sets simulation's execution end date.
        setExecutionEndDate = function (s) {
            var last;

            // Escape if non-derivable.
            if (s.executionEndDate ||
                s.jobs.compute.all.length === 0 ||
                s.jobs.postProcessing.all.length === 0) return;

            // Derive from last compute job.
            last = _.last(s.jobs.compute.allUnsorted);
            s.executionEndDate = last.executionEndDate || last.executionStartDate;
        },

        // Sets simulation's current execution status.
        setExecutionState = function (simulation) {
            simulation.executionState = MOD.getSimulationComputeState(simulation);
            MOD.cv.setFieldDisplayName(simulation, 'simulation_state', 'executionState');
        },

        // Parses a simulation job.
        parseJob = function (simulation, job) {
            // Push jobs into relevant collections.
            simulation.jobs.all.push(job);
            switch (job.typeof) {
            case 'computing':
                simulation.jobs.compute.all.push(job);
                simulation.jobs.compute.allUnsorted.push(job);
                simulation.jobs.compute[job.executionState].push(job);
                break;
            case 'post-processing':
                simulation.jobs.postProcessing.all.push(job);
                simulation.jobs.postProcessing[job.executionState].push(job);
                break;
            default:
                break;
            }

            // Set simulation submission path.
            if (!simulation.ext.submissionPath && job.typeof === 'computing') {
                simulation.ext.submissionPath = job.submissionPath;
            }

            // Set flag indicating whether the simulation has a monitoring job.
            if (simulation.hasMonitoring === false &&
                job.typeof === 'post-processing' &&
                job.postProcessingName === 'monitoring' &&
                job.executionEndDate &&
                job.isError === false &&
                _.has(MOD.urls.M, simulation.computeNode)) {
                simulation.hasMonitoring = true;
            }
        };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobList) {
        // Extend simulation.
        MOD.extendSimulation(simulation);

        // Extend jobs.
        _.each(jobList, MOD.extendJob);

        // Parse jobs.
        _.each(jobList, function (job) {
            parseJob(simulation, job);
        });

        // Set sorted jobsets.
        _.each(getJobSets(simulation), MOD.sortJobset);

        // Set job pagination state.
        _.each(getJobSets(simulation), function (jobSet) {
            MOD.setJobsetPagination(jobSet, true);
        });

        // Set derived execution state.
        setExecutionState(simulation);

        // Set derived execution end date (necessary if 0100 not sent).
        setExecutionEndDate(simulation);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
