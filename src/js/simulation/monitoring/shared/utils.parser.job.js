(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var getJobTypesets,
        parseComputeJobs,
        setTotalJobCount,
        setJobSets,
        sortJobs;

    // Returns top-level job sets.
    getJobTypesets = function (simulation) {
        return [
            simulation.jobs.global,
            simulation.jobs.compute,
            simulation.jobs.postProcessing,
            simulation.jobs.postProcessingFromChecker
        ];
    };

    // Sets different job sets.
    setJobSets = function (simulation) {
        // Set compute jobs.
        simulation.jobs.compute.all = _.filter(simulation.jobs.global.all, function (job) {
            return job.ext.type === 'computing';
        });
        simulation.jobs.compute.running = _.filter(simulation.jobs.compute.all, function (job) {
            return job.executionState === 'running';
        });
        simulation.jobs.compute.complete = _.filter(simulation.jobs.compute.all, function (job) {
            return job.executionState === 'complete';
        });
        simulation.jobs.compute.error = _.filter(simulation.jobs.compute.all, function (job) {
            return job.executionState === 'error';
        });

        // Set post-processing jobs.
        simulation.jobs.postProcessing.all = _.filter(simulation.jobs.global.all, function (job) {
            return job.ext.type === 'post-processing';
        });
        simulation.jobs.postProcessing.running = _.filter(simulation.jobs.postProcessing.all, function (job) {
            return job.executionState === 'running';
        });
        simulation.jobs.postProcessing.complete = _.filter(simulation.jobs.postProcessing.all, function (job) {
            return job.executionState === 'complete';
        });
        simulation.jobs.postProcessing.error = _.filter(simulation.jobs.postProcessing.all, function (job) {
            return job.executionState === 'error';
        });

        // Set post-processing (from checker) jobs.
        simulation.jobs.postProcessingFromChecker.all = _.filter(simulation.jobs.global.all, function (job) {
            return job.ext.type === 'post-processing-from-checker';
        });
        simulation.jobs.postProcessingFromChecker.running = _.filter(simulation.jobs.postProcessingFromChecker.all, function (job) {
            return job.executionState === 'running';
        });
        simulation.jobs.postProcessingFromChecker.complete = _.filter(simulation.jobs.postProcessingFromChecker.all, function (job) {
            return job.executionState === 'complete';
        });
        simulation.jobs.postProcessingFromChecker.error = _.filter(simulation.jobs.postProcessingFromChecker.all, function (job) {
            return job.executionState === 'error';
        });

        // _.each(getJobTypesets(simulation), function (jobSet) {
        //     _.each(['running', 'complete', 'error'], function (jobState) {
        //         jobSet[jobState] = _.filter(jobSet.all, function (job) {
        //             return job.executionState === jobState;
        //         });
        //     });
        // });
    };

    // Sorts jobs.
    sortJobs = function (simulation) {
        _.each(getJobTypesets(simulation), function (jobSet) {
            jobSet.all = _.sortBy(jobSet.all, function (job) {
                return job.ext.executionStartDate;
            });
        });
    };

    // Parses set of simulation compute jobs.
    parseComputeJobs = function (simulation) {
        var first;

        // Escape if there are no jobs to process.
        if (simulation.jobs.compute.all.length === 0) {
            return;
        }

        // Sort compute jobs.
        simulation.jobs.compute.all = _.sortBy(simulation.jobs.compute.all, function (job) {
            return job.ext.executionStartDate;
        });

        //Set first/last jobs.
        first = simulation.jobs.compute.first = _.first(simulation.jobs.compute.all);
        simulation.jobs.compute.last = _.last(simulation.jobs.compute.all);

        // Reparse spin-up job start date (if necessary).
        if (_.isNull(first.executionStartDate)) {
            first.executionStartDate = simulation.executionStartDate;
            MOD.parseJob(first);
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
    MOD.parseJobs = function (simulation, doIndividualParse) {
        if (_.isUndefined(doIndividualParse) || doIndividualParse === true) {
            _.each(simulation.jobs.global.all, MOD.parseJob);
        }
        setJobSets(simulation);
        setTotalJobCount(simulation);
        parseComputeJobs(simulation);
        sortJobs(simulation);
    };

    // Parses a job in readiness for processing.
    MOD.parseJob = function (job) {
        // Extend job.
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
