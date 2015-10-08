(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets job default values.
    MOD.extendJob01 = function (job) {
        _.defaults(job, {
            executionEndDate: null,
            executionState: null,
            ext: {
                executionState: undefined,
                isPostProcessing: _.has(job, 'typeof') ? job.typeof !== 'computing' : true
            },
            isError: false,
            typeof: 'post-processing'
        });
    };

    // Sets job execution state.
    MOD.extendJob02 = function (job) {
        if (job.isError) {
            job.executionState = 'error';
        } else if (job.executionEndDate) {
            job.executionState = 'complete';
        } else {
            job.executionState = 'running';
        }
    };

    // Extends a job in readiness for processing.
    MOD.extendJob = function (job) {
        MOD.extendJob01(job);
        MOD.extendJob02(job);
    };

}(
    this.APP.modules.monitoring,
    this._
));
