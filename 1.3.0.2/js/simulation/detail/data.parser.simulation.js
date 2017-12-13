(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var
        getSimulationComputeState = function (s, lastJob) {
            // Complete if cmip5.
            if (s.accountingProject === 'cmip5') {
                return 'complete';
            }

            // Queued if no compute jobs have started.
            if (s.jobs.compute.all.length === 0) {
                return 'queued';
            }

            // Derive from last compute job.
            if (lastJob.executionState === 'running') {
                return 'running';
            }
            else if (lastJob.executionState === 'late') {
                return 'late';
            }
            else if (lastJob.executionState === 'error') {
                return 'error';
            }
            else if (lastJob.executionState === 'complete' &&
                     lastJob.isComputeEnd) {
                return 'complete';
            } else {
                return 'queued';
            }
        },

        setSimulationDerivedInformation = function (s) {
            var lastComputeJob;

            // Set last compute job.
            if (s.jobs.compute.all.length) {
                lastComputeJob = _.last(s.jobs.compute.allUnsorted);
            }

            // Escape if non-derivable.
            // if (!s.executionEndDate &&
            //     s.jobs.compute.all.length &&
            //     s.jobs.postProcessing.all.length) {
            //     s.executionEndDate = lastJob.executionEndDate ||
            //                          lastJob.executionStartDate;
            // }

            // Derive simulation execution state.
            s.executionState = getSimulationComputeState(s, lastComputeJob);

            // Map state to CV.
            MOD.cv.setFieldDisplayName(s, 'simulation_state', 'executionState');

            // Set job type collections.
            _.each(s.jobs.all, function (job) {
                switch (job.typeof) {
                case 'c':
                    s.jobs.compute[job.executionState].push(job);
                    break;
                case 'p':
                    s.jobs.postProcessing[job.executionState].push(job);
                    break;
                default:
                    break;
                }
            });
        };

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (s, jList, jp) {
        // Extend.
        MOD.extendSimulation(s);
        _.each(jList, MOD.extendJob);

        // Parse.
        _.each(jList, function (j) {
            MOD.parseJob(s, j);
        });
        MOD.parseJobPeriod(s, jp);

        // Sort / paginate.
        _.each(s.jobsets, function (jobset) {
            MOD.sortJobset(jobset);
            MOD.setJobsetPagination(jobset, true);
        });

        // Set derived execution information.
        setSimulationDerivedInformation(s);
    };

}(
    this.APP.modules.monitoring,
    this._
));