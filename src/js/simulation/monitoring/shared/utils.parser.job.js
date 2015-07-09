(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var parseComputeJobs,
        setTotalJobCount,
        sortJobset,
        sortJobsets;

    // Sorts a job set.
    sortJobset = function (jobSet) {
        if (jobSet.all.length > 1) {
            jobSet.all = _.sortBy(jobSet.all, function (job) {
                return job.ext.executionStartDate;
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

    // set total job count field.
    setTotalJobCount = function (simulation) {
        if (simulation.jobs.global.all.length) {
            simulation.jobs.count = simulation.jobs.global.all.length;
        } else {
            simulation.jobs.count = "--";
        }
    };

    // Parses simulation jobs in readiness for processing.
    MOD.parseJobs = function (simulation) {
        sortJobsets(simulation);
        setTotalJobCount(simulation);
        parseComputeJobs(simulation);
    };

    // Appends a job to the relevant simulation job set.
    MOD.appendJob = function (simulation, job) {
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

    // Extends a job in readiness for processing.
    MOD.extendJob = function (job) {
        // Initialise extension fields.
        _.extend(job, {
            accountingProject: undefined,
            executionState: undefined,
            ext: {
                id: undefined,
                duration: '--',
                executionEndDate: '--',
                expectedExecutionEndDate: '--',
                executionStartDate: '--',
                executionState: undefined,
                type: job.typeof || 'computing'
            },
            isLate: undefined
        });

        // Format date fields.
        APP.utils.formatDateTimeField(job, "executionStartDate");
        APP.utils.formatDateTimeField(job, "expectedExecutionEndDate");
        APP.utils.formatDateTimeField(job, "executionEndDate");

        // Set duration (in seconds).
        if (job.executionStartDate && job.executionEndDate) {
            job.ext.duration = job.executionEndDate.diff(job.executionStartDate, 'seconds');
            job.ext.duration = numeral(job.ext.duration).format('00:00:00');
        }

        // Set execution state.
        if (job.isError) {
            job.executionState = 'error';
        } else if (job.executionEndDate) {
            job.executionState = 'complete';
        } else {
            job.executionState = 'running';
        }

        // Set is late flag.
        if (job.executionEndDate) {
            job.isLate = job.wasLate;
        } else {
            job.isLate = moment().valueOf() > job.expectedExecutionEndDate.valueOf();
        }

        // Set accounting project.
        if (job.accountingProject === 'None' || _.isNull(job.accountingProject)) {
            job.ext.accountingProject = "--";
        } else {
            job.ext.accountingProject = job.accountingProject;
        }
    };
}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.moment,
    this.numeral
));
