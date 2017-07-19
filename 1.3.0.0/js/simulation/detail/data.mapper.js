(function (APP, MOD, moment, numeral) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Maps post-processing info from data returned from server.
    var mapJobPostProcessingInfo = function (i) {
        var ppFields = [];

        // Post-processing name.
        if (i[15]) {
            ppFields.push(i[15]);
        }
        // Post-processing date.
        if (i[12]) {
            ppFields.push(i[12].slice(0, 10));
        }
        // Post-processing dimension.
        if (i[13]) {
            ppFields.push(i[13]);
        }
        // Post-processing component.
        if (i[11]) {
            ppFields.push(i[11]);
        }
        // Post-processing file.
        if (i[14]) {
            ppFields.push(i[14]);
        }

        return ppFields.length ? ppFields.join(".") : "--";
    };

    // Maps job info from data returned from server.
    MOD.mapJob = function (i) {
        return {
            // core fields:
            executionEndDate: i[0],
            executionStartDate: i[1],
            executionState1: i[2],
            id: i[3],
            isComputeEnd: i[4] === 1,
            isError: i[5] === 1,
            isIM: i[6] === 1,
            simulationID: i[8],
            typeof: i[7],
            // non-core fields:
            accountingProject: APP.utils.isNone(i[9]) ? '--' : i[9],
            jobUID: i[10],
            postProcessingInfo: i[7] === 'p' ? mapJobPostProcessingInfo(i) : null,
            postProcessingName: i[15],
            schedulerID: i[16],
            simulationUID: i[19],
            submissionPath: i[17],
            warningDelay: numeral(i[18]),
            warningLimit: i[21],
            warningState: i[20] === 1,
            // work fields:
            duration: null,
            extended: false,
            lateness: null
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
    this.moment,
    this.numeral
));
