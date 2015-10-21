(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns a job object mapped form an array of values.
    MOD.mapJob = function (i) {
        return {
            executionEndDate: i[0],
            executionStartDate: i[1],
            isComputeEnd: i[2],
            isError: i[3],
            jobUID: i[4],
            simulationUID: i[5],
            typeof: i[6],
            accountingProject: i[7],
            postProcessingComponent: i[8],
            postProcessingDate: i[9],
            postProcessingDimension: i[10],
            postProcessingFile: i[11],
            postProcessingName: i[12],
            schedulerID: i[13],
            submissionPath: i[14],
            warningDelay: i[15]
        };
    };

}(
    this.APP.modules.monitoring,
    this._
));
