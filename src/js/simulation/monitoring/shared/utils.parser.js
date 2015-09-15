(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var getExecutionState,
        mapJob,
        parseComputeJobs,
        setExecutionState,
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
        if (last.executionState === 'complete' && simulation.executionEndDate && simulation.isError === false) {
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
                return job.ext.executionStartDate;
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

    // Parses set of simulation compute jobs.
    parseComputeJobs = function (simulation) {
        var first;

        // Escape if there are no jobs to process.
        if (simulation.jobs.compute.all.length === 0) {
            return;
        }

        // Re-extend spin-up job start date (if necessary).
        first = _.first(simulation.jobs.compute.all);
        if (_.isNull(first.executionStartDate)) {
            first.executionStartDate = simulation.executionStartDate;
            MOD.extendJob(first);
        }

        // Set late flag.
        if (_.isNull(simulation.executionEndDate) &&
            _.findWhere(simulation.jobs.compute.all, { isLate: true })) {
            simulation.jobs.compute.hasLate = true;
        }
    };

    // Appends a job to the relevant simulation job set.
    mapJob = function (simulation, job) {
        simulation.jobs.global.all.push(job);
        simulation.jobs.global[job.executionState].push(job);
        switch (job.ext.type) {
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
            simulation.jobs.compute.all.push(job);
            simulation.jobs.compute[job.executionState].push(job);
            break;
        }
    };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (simulation, jobHistory) {
        MOD.parseSimulations([simulation], jobHistory, _.indexBy([simulation], "uid"));
    };

    // Parses a collection of simulations in readiness for processing.
    MOD.parseSimulations = function (simulationList, jobHistory, simulationSet) {
        // Extend simulations.
        _.each(simulationList, MOD.extendSimulation);

        // Extend jobs.
        _.each(jobHistory, MOD.extendJob);

        // Map jobs to simulations.
        _.each(jobHistory, function (job) {
            if (_.has(simulationSet, job.simulationUID)) {
                mapJob(simulationSet[job.simulationUID], job);
            }
        });

        // Sort jobs.
        _.each(simulationList, sortJobsets);

        // Parse compute jobs.
        _.each(simulationList, parseComputeJobs);

        // Set execution states.
        _.each(simulationList, setExecutionState);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.moment,
    this.numeral
));
