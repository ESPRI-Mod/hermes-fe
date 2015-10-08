(function (APP, MOD, _, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Extends a job in readiness for processing.
    MOD.extendJob = function (job) {
        var ppFields = [];

        // Escape if already extended.
        if (_.has(job, 'ext')) {
            return;
        }

        // Set defaults:
        _.defaults(job, {
            accountingProject: null,
            executionEndDate: null,
            executionState: null,
            ext: {
                // ... user interface fields
                accountingProject: '--',
                lateness: '--',
                duration: '--',
                executionEndDate: '--',
                executionStartDate: '--',
                executionState: undefined,
                postProcessingInfo: '--',
                // ... helper fields
                expectedExecutionEndDate: null,
                isPostProcessing: _.has(job, 'typeof') ? job.typeof !== 'computing' : true
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

        // Set accounting project.
        if (APP.utils.isNone(job.accountingProject) === false) {
            job.ext.accountingProject = job.accountingProject;
        }

        // Set post-processing fields.
        if (job.ext.isPostProcessing) {
            if (job.postProcessingName) {
                ppFields.push(job.postProcessingName);
            }
            if (job.postProcessingDate) {
                ppFields.push(job.postProcessingDate);
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
        }

        // Format date fields.
        APP.utils.formatDateTimeField(job, "executionStartDate");
        APP.utils.formatDateTimeField(job, "executionEndDate");

        // Set expected end date.
        if (job.executionStartDate) {
            job.ext.expectedExecutionEndDate = moment(job.executionStartDate).add(job.warningDelay, 's');
        }

        // Set duration.
        if (job.executionStartDate && job.executionEndDate) {
            job.ext.duration = job.executionEndDate.diff(job.executionStartDate, 's');
            job.ext.duration = numeral(job.ext.duration).format('00:00:00');
        }

        // Set lateness.
        if (job.executionStartDate &&
            job.executionEndDate &&
            job.executionEndDate > job.ext.expectedExecutionEndDate) {
            job.ext.lateness = job.executionEndDate.diff(job.ext.expectedExecutionEndDate, 's');
            job.ext.lateness = numeral(job.ext.lateness).format('00:00:00');
        }

        // Set execution state.
        if (job.isError) {
            job.executionState = 'error';
        } else if (job.executionEndDate) {
            job.executionState = 'complete';
        } else {
            job.executionState = 'running';
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.moment,
    this.numeral
));
