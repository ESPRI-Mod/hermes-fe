(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var getExecutionState,
        mapJob,
        setExecutionState,
        sortComputeJobset;

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
    MOD.parseSimulation = function (simulation, jobHistory) {
        MOD.parseSimulations([simulation], jobHistory, _.indexBy([simulation], "uid"));
    };

    // Module data parser.
    MOD.parser = {
        // Parses loaded timeslice.
        parseTimeslice: function () {
            // Extend simulations.
            _.each(MOD.state.simulationList, MOD.extendSimulation);
            MOD.log("timeslice simulations extended");

            // Extend jobs.
            _.each(MOD.state.jobList, MOD.extendJob);
            MOD.log("timeslice jobs extended");

            // Map jobs to simulations.
            _.each(MOD.state.jobList, mapJob);
            MOD.log("timeslice jobs mapped to simulation");

            // Sort compute jobs (required in order to determine simulation execution status).
            _.each(MOD.state.simulationList, sortComputeJobset);
            MOD.log("timeslice compute jobs sorted");

            // Set execution states.
            _.each(MOD.state.simulationList, setExecutionState);
            MOD.log("timeslice simulation execution state assigned");
        }
    };

}(
    this.APP.modules.monitoring,
    this._
));
