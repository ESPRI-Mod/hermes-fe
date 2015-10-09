(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var getExecutionState,
        mapJob,
        setExecutionState,
        setHasPostProcessingInfo,
        sortJobset,
        sortJobsets;

    // Returns simulation's current execution status.
    getExecutionState = function (simulation) {
        var last;

        // Complete if cmip5.
        if (simulation.activity === 'cmip5') {
            return 'complete';
        }

        // Queued if no jobs have started.
        if (simulation.jobs.compute.all.length === 0) {
            return 'queued';
        }

        // Set last job.
        last = _.last(simulation.jobs.compute.all);

        // Running if last job is running.
        if (last.executionState === 'running') {
            return 'running';
        }

        // Error if last job is error.
        if (last.executionState === 'error') {
            return 'error';
        }

        // Complete if last job is complete and 0100 has been received.
        if (last.executionState === 'complete' &&
            simulation.executionEndDate &&
            simulation.isError === false) {
            return 'complete';
        }

        // Otherwise queued.
        return 'queued';
    };

    // Sets simulation's current execution status.
    setExecutionState = function (simulation) {
        simulation.executionState = getExecutionState(simulation);
        MOD.cv.setFieldDisplayName(simulation, 'simulation_state', 'executionState');
    };

    // Sorts a job set.
    sortJobset = function (jobSet) {
        if (jobSet.all.length > 1) {
            jobSet.all = _.sortBy(jobSet.all, function (job) {
                return job.executionStartDate;
            });
        }
    };

    // Sets different job sets.
    sortJobsets = function (simulation) {
        _.each([
            simulation.jobs.compute,
            simulation.jobs.postProcessing,
            simulation.jobs.postProcessingFromChecker
        ], sortJobset);
    };

    // Appends a job to the relevant simulation job set.
    mapJob = function (simulation, job) {
        simulation.jobs.all.push(job);
        switch (job.typeof) {
        case 'computing':
            simulation.jobs.compute.all.push(job);
            simulation.jobs.compute[job.executionState].push(job);
            break;
        case 'post-processing':
            simulation.jobs.postProcessing.all.push(job);
            simulation.jobs.postProcessing[job.executionState].push(job);
            break;
        case 'post-processing-from-checker':
            simulation.jobs.postProcessingFromChecker.all.push(job);
            simulation.jobs.postProcessingFromChecker[job.executionState].push(job);
            break;
        default:
            break;
        }
    };

    // Sets a flag indicating whether there is post processing information to display.
    setHasPostProcessingInfo = function (jobs) {
        jobs.hasInfo = _.isObject(_.find(jobs.all, function (job) {
            return job.ext.postProcessingInfo !== "--";
        }));
    };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobList) {
        // Extend simulation.
        MOD.extendSimulation(simulation);
        MOD.log("simulation extended");

        // Extend jobs.
        _.each(jobList, MOD.extendJob);
        MOD.log("simulation jobs extended");

        // Map jobs to simulations.
        _.each(jobList, function (job) {
            mapJob(simulation, job);
        });
        MOD.log("simulation jobs mapped");

        // Set flags indicating whether there is post-processing info to display.
        setHasPostProcessingInfo(simulation.jobs.postProcessing);
        setHasPostProcessingInfo(simulation.jobs.postProcessingFromChecker);
        MOD.log("simulation post-processing flag assigned");

        // Sort jobs.
        sortJobsets(simulation);
        MOD.log("simulation jobs sorted");

        // Set execution states.
        setExecutionState(simulation);
        MOD.log("simulation execution state assigned");
    };

}(
    this.APP.modules.monitoring,
    this._
));
