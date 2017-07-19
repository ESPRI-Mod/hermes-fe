(function (APP, MOD, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets derived job data.
    MOD.extendJob = function (j) {
        var lateness;

        // Escape if already done.
        if (j.extended === true) {
            return;
        }

        // Set duration of finished jobs.
        if (j.executionStartDate && j.executionEndDate) {
            j.duration = numeral(moment(j.executionEndDate).diff(moment(j.executionStartDate), 's'));
            // if (j.duration > j.warningDelay) {
            //     j.lateness = numeral(j.duration - j.warningDelay);
            // }
        }

        // For unfinished jobs derive lateness indicator.
        if (!j.isError && !j.executionEndDate) {
            lateness = APP.NOW.diff(moment(j.warningLimit), 's');
            j.lateness = numeral(lateness);
            if (lateness >= 0 && j.warningState === 0) {
                j.warningState = 2;
            }
        }

        // Set job execution state.
        j.executionState = j.isError ? 'error' :
                           j.executionEndDate ? 'complete' :
                           j.warningState ? 'late' :
                           'running';

        // Remember.
        j.extended = true;
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this.moment,
    this.numeral
));
