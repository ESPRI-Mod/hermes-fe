(function (APP, MOD, _) {

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
        };

    // Returns description of a simulation related event.
    MOD.getEventDescription = function (ei) {
        switch (ei.eventType) {
        case 'simulationComplete':
            return "SIMULATION COMPLETED";
        case 'simulationError':
            return "SIMULATION ERROR";
        case 'simulationStart':
            if (ei.simulation.ext.isRestart === false) {
                return "SIMULATION STARTED";
            }
            return "SIMULATION RESTARTED";
        case 'jobComplete':
            if (_.has(MOD.jobTypeDescriptions, ei.job.typeof)) {
                return MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() + " JOB COMPLETED";
            } else {
                return "JOB COMPLETED";
            }
        case 'jobError':
            if (_.has(MOD.jobTypeDescriptions, ei.job.typeof)) {
                return MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() + " JOB ERROR";
            } else {
                return "JOB ERROR";
            }
        case 'jobStart':
            if (_.has(MOD.jobTypeDescriptions, ei.job.typeof)) {
                return MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() + " JOB STARTED";
            } else {
                return "JOB STARTED";
            }
        case 'jobPeriodUpdate':
            return "OUTPUT PERIOD UPDATED";
        default:
            break;
        }
    };

    // Parses a job in readiness for further processing.
    MOD.parseJob = function (s, j) {
        if (_.isUndefined(s)) return;

        // Push jobs into relevant collections.
        s.jobs.all.push(j);
        switch (j.typeof) {
        case 'c':
            s.jobs.compute.all.push(j);
            s.jobs.compute.allUnsorted.push(j);
            break;
        case 'p':
            s.jobs.postProcessing.all.push(j);
            s.jobs.postProcessing.allUnsorted.push(j);
            break;
        default:
            break;
        }
    };

    // Parses a job period in readiness for further processing.
    MOD.parseJobPeriod = function (s, jp) {
        var startDate, startDateInDays, executionProgress;

        if (APP.utils.isNone(s) || APP.utils.isNone(jp)) return;

        // Calculate simulation progress:
        // ... 100% if sucessfully completed;
        if (s.executionEndDate && s.isError === false) {
            executionProgress = 1;

        // ... derive from delta between last job period update and output start date.
        } else {
            startDate = jp.startDate.toString();
            startDate = startDate.substring(0, 4) + "-" +
                        startDate.substring(4, 6) + "-" +
                        startDate.substring(6);
            startDateInDays = APP.utils.convertDateToDays(startDate);
            executionProgress = (startDateInDays - s.ext.outputStartDateInDays) / s.ext.outputTimeSpanInDays;
            // ... misconfigured output end date correction.
            if (executionProgress > 1 || executionProgress < 0) {
                executionProgress = 0;
            }
        }

        // Update state (if appropriate).
        if (executionProgress > s.ext.executionProgress) {
            s.ext.executionProgress = executionProgress;
            return executionProgress;
        }
    };

    MOD.setSimulationDerivedInformation = function (s) {
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


}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));