(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

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

    // Parses a job period in readiness for further processing.
    MOD.parseJobPeriod = function (s, jp) {
        var startDate, startDateInDays, executionProgress;

        // Escape if infeasible.
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

    // Sets simulation's execution end date.
    MOD.setSimulationExecutionEndDate = function (s) {
        // Set end date if a non-complete simulation has post-procesing jobs.
        if (!s.executionEndDate &&
            s.jobCounts.c.all > 0 &&
            s.jobCounts.p.all > 0) {
            s.executionEndDate = s.ext.latestComputeJob.executionEndDate ||
                                 s.ext.latestComputeJob.executionStartDate;
        }
    };

    // Sets simulation's current execution status.
    MOD.setSimulationExecutionState = function (s) {
        // Complete if cmip5.
        if (s.accountingProject === 'cmip5') {
            s.executionState = 'complete';

        // Queued if no compute jobs have started.
        } else if (s.jobCounts.c.all === 0) {
            s.executionState = 'queued';

        // Running if latest job is running.
        } else if (s.ext.latestComputeJob.executionState === 'running') {
            s.executionState = 'running';

        // Error if latest job is in error.
        } else if (s.ext.latestComputeJob.executionState === 'error') {
            s.executionState = 'error';

        // Complete if latest job is a completed compute end job.
        } else if (s.ext.latestComputeJob.executionState === 'complete' &&
                   s.ext.latestComputeJob.isComputeEnd) {
            s.executionState = 'complete';

        // Queued otherwise.
        } else {
            s.executionState = 'queued';
        }

        // Map state to CV.
        MOD.cv.setFieldDisplayName(s, 'simulation_state', 'executionState');
    };
}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));