(function (MOD, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets derived job data.
    MOD.extendJob = function (job) {
        // Escape if already done.
        if (job.extended === true) {
            return;
        }

        // Set duration.
        if (job.executionStartDate && job.executionEndDate) {
            job.duration = numeral(job.executionEndDate.diff(job.executionStartDate, 's'));
        }

        // Set lateness.
        if (job.duration && job.duration > job.warningDelay) {
            job.lateness = numeral(job.duration - job.warningDelay);
        }

        // Remember.
        job.extended = true;
    };

}(
    this.APP.modules.monitoring,
    this.numeral
));
