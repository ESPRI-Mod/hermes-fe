(function (MOD, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets dervied job data.
    MOD.extendJob = function (job) {
        // Escape if already done.
        if (job.ext.extended === true) {
            return;
        }

        // Format date fields.
        if (job.executionStartDate) {
            job.ext.executionStartDate = job.executionStartDate.format('DD-MM-YYYY HH:mm:ss');
        }
        if (job.executionEndDate) {
            job.ext.executionEndDate = job.executionEndDate.format('DD-MM-YYYY HH:mm:ss');
        }

        // Set duration.
        if (job.executionStartDate && job.executionEndDate) {
            job.duration = numeral(job.executionEndDate.diff(job.executionStartDate, 's'));
            job.ext.duration = job.duration.format('HH:mm:ss');
        }

        // Set lateness.
        if (job.duration && job.duration > job.warningDelay) {
            job.ext.lateness = (job.duration - job.warningDelay).format('HH:mm:ss');
        }

        // Remember.
        job.ext.extended = true;
    };

}(
    this.APP.modules.monitoring,
    this.numeral
));
