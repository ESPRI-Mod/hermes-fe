(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var
        getSimulationComputeState = function (s) {
            var last;

            // Complete if cmip5.
            if (s.accountingProject === 'cmip5') {
                return 'complete';
            }

            // Queued if no compute jobs have started.
            if (s.jobs.compute.all.length === 0) {
                return 'queued';
            }

            // Complete if there are post-processing jobs.
            if (s.jobs.postProcessing.all.length > 0) {
                return 'complete';
            }

            // Derive from last compute job.
            last = _.last(s.jobs.compute.allUnsorted);
            if (last.executionState === 'running') {
                return 'running';
            }
            if (last.executionState === 'error') {
                return 'error';
            }
            if (last.executionState === 'complete' && last.isComputeEnd) {
                return 'complete';
            }

            // Queued otherwise.
            return 'queued';
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
            return MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() +   " JOB COMPLETED";
        case 'jobError':
            return MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() +   " JOB ERROR";
        case 'jobStart':
            return MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() +   " JOB STARTED";
        default:
            break;
        }
    };

    // Parses a simulation job in readiness for further processing.
    MOD.parseJob = function (s, j) {
        if (_.isUndefined(s)) return;

        // Push jobs into relevant collections.
        s.jobs.all.push(j);
        switch (j.typeof) {
        case 'computing':
            s.jobs.compute.all.push(j);
            s.jobs.compute.allUnsorted.push(j);
            break;
        case 'post-processing':
            s.jobs.postProcessing.all.push(j);
            s.jobs.postProcessing.allUnsorted.push(j);
            break;
        default:
            break;
        }

        // Set flag indicating whether the simulation has a monitoring job.
        if (s.hasMonitoring === false &&
            j.typeof === 'post-processing' &&
            j.postProcessingName === 'monitoring' &&
            j.executionEndDate &&
            j.isError === false) {
            s.hasMonitoring = true;
        }
    };

    // Sets simulation's execution end date.
    MOD.setSimulationExecutionEndDate = function (s) {
        var last;

        // Escape if non-derivable.
        if (s.executionEndDate ||
            s.jobs.compute.all.length === 0 ||
            s.jobs.postProcessing.all.length === 0) {
            return;
        }

        // Derive from last compute job.
        last = _.last(s.jobs.compute.allUnsorted);
        s.executionEndDate = last.executionEndDate || last.executionStartDate;
    };

    // Sets simulation's current execution status.
    MOD.setSimulationExecutionState = function (s) {
        // Override compute job execution state when a later job has started.
        var lastJob = _.last(s.jobs.compute.allUnsorted);
        _.each(s.jobs.compute.allUnsorted, function (job) {
            // Another compute job ran afterwards.
            if (job != lastJob) {
                if (job.executionState === 'running') {
                    job.executionState = 'complete';
                    job.executionEndDate = 'N/A';
                }
            // A post=processing job ran afterwards.
            } else if (!job.executionEndDate) {
                if (_.find(s.jobs.postProcessing.allUnsorted, function (j) {
                    return j.executionStartDate.diff(job.executionStartDate) >= 0;
                })) {
                    job.executionState = 'complete';
                    job.executionEndDate = 'N/A';
                }
            }
        });

        // Derive simulation execution state.
        s.executionState = getSimulationComputeState(s);

        // Map state to CV.
        MOD.cv.setFieldDisplayName(s, 'simulation_state', 'executionState');

        // Set job type collections.
        _.each(s.jobs.all, function (job) {
            switch (job.typeof) {
            case 'computing':
                s.jobs.compute[job.executionState].push(job);
                break;
            case 'post-processing':
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