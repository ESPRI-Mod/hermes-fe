(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets job default values.
    MOD.extendJob01 = function (job) {
        _.defaults(job, {
            duration: null,
            executionEndDate: null,
            executionStartDate: null,
            executionState: null,
            ext: {
                accountingProject: APP.utils.isNone(job.accountingProject) ? "--" :
                                                    job.accountingProject,
                duration: '--',
                executionEndDate: '--',
                executionStartDate: '--',
                executionState: undefined,
                isPostProcessing: _.has(job, 'typeof') ? job.typeof !== 'computing' : true,
                lateness: '--',
                postProcessingInfo: '--',
                warningDelay: '--'
            },
            isError: false,
            postProcessingComponent: null,
            postProcessingDate: null,
            postProcessingDimension: null,
            postProcessingFile: null,
            postProcessingName: null,
            typeof: 'post-processing',
            warningDelay: parseInt(_.has(job, 'warningDelay') ? job.warningDelay :
                                                                MOD.defaults.jobWarningDelay, 10)
        });
    };

    // Set job post-processing fields.
    MOD.extendJob02 = function (job) {
        var ppFields = [];

        if (job.postProcessingName) {
            ppFields.push(job.postProcessingName);
        }
        if (job.postProcessingDate) {
            ppFields.push(job.postProcessingDate.slice(0, 10));
        }
        if (job.postProcessingDimension) {
            ppFields.push(job.postProcessingDimension);
        }
        if (job.postProcessingComponent) {
            ppFields.push(job.postProcessingComponent);
        }
        if (job.postProcessingFile) {
            ppFields.push(job.postProcessingFile);
        }
        if (ppFields.length) {
            job.ext.postProcessingInfo = ppFields.join(".");
        }
    };

    // Sets job date related fields.
    MOD.extendJob03 = function (job) {
        // Format date fields.
        if (job.executionStartDate) {
            job.executionStartDate = moment(job.executionStartDate);
            job.ext.executionStartDate = job.executionStartDate.format('DD-MM-YYYY HH:mm:ss');
        }
        if (job.executionEndDate) {
            job.executionEndDate = moment(job.executionEndDate);
            job.ext.executionEndDate = job.executionEndDate.format('DD-MM-YYYY HH:mm:ss');
        }

        // Format warning delay.
        job.ext.warningDelay = job.warningDelay;
        job.ext.warningDelay = numeral(job.warningDelay).format('00:00:00');
        if (job.ext.warningDelay.length === 7) {
            job.ext.warningDelay = "0" + job.ext.warningDelay;
        }

        // Set duration.
        if (job.executionStartDate && job.executionEndDate) {
            job.duration = numeral(job.executionEndDate.diff(job.executionStartDate, 's'));
            job.ext.duration = job.duration.format('00:00:00');
            if (job.ext.duration.length === 7) {
                job.ext.duration = "0" + job.ext.duration;
            }
        }

        // Set lateness.
        if (job.duration && job.duration > job.warningDelay) {
            job.ext.lateness = (job.duration - job.warningDelay).format('00:00:00');
            if (job.ext.lateness.length === 7) {
                job.ext.lateness = "0" + job.ext.lateness;
            }
        }
    };

    // Sets job execution state.
    MOD.extendJob04 = function (job) {
        if (job.isError) {
            job.executionState = 'error';
        } else if (job.executionEndDate) {
            job.executionState = 'complete';
        } else {
            job.executionState = 'running';
        }
    };

    // Sets job execution state.
    MOD.extendJob = function (job) {
        if (_.has(job, 'ext') === false) {
            MOD.extendJob01(job);
            if (job.ext.isPostProcessing) {
                MOD.extendJob02(job);
            }
            MOD.extendJob03(job);
            MOD.extendJob04(job);
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.moment,
    this.numeral
));
