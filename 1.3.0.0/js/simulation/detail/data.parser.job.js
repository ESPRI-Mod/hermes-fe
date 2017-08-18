(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

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
        var startDate,
            startDateInDays,
            executionProgress;

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
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));