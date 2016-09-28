(function (APP, MOD, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Maps post-processing info from data returned from server.
    var mapJobPostProcessingInfo = function (i) {
        var ppFields = [];

        // Post-processing name.
        if (i[12]) {
            ppFields.push(i[12]);
        }
        // Post-processing date.
        if (i[9]) {
            ppFields.push(i[9].slice(0, 10));
        }
        // Post-processing dimension.
        if (i[10]) {
            ppFields.push(i[10]);
        }
        // Post-processing component.
        if (i[8]) {
            ppFields.push(i[8]);
        }
        // Post-processing file.
        if (i[11]) {
            ppFields.push(i[11]);
        }

        return ppFields.length ? ppFields.join(".") : "--";
    };

    // Maps job info from data returned from server.
    MOD.mapJob = function (i) {
        return {
            duration: null,
            executionEndDate: i[0],
            executionStartDate: i[1],
            executionState: i[3] ? 'error' : i[0] ? 'complete' : 'running',
            extended: false,
            isComputeEnd: i[2],
            isError: i[3],
            jobUID: i[4],
            lateness: null,
            simulationUID: i[5],
            typeof: i[6],
            accountingProject: APP.utils.isNone(i[7]) ? '--' : i[7],
            postProcessingInfo: i[6] !== 'computing' ? mapJobPostProcessingInfo(i) : null,
            postProcessingName: i[12],
            schedulerID: i[13],
            submissionPath: i[14],
            warningDelay: numeral(i[15])
        };
    };

    // Maps previous try info from data returned from server.
    MOD.mapPreviousTries = function (i) {
        return {
            tryID: i[0],
            uid: i[1]
        };
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this.numeral
));
