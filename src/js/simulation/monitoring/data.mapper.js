(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns a job object mapped form an array of values.
    MOD.mapJob = function (i) {
        return {
            executionEndDate: i[0],
            executionStartDate: i[1],
            executionState: i[3] ? 'error' : i[0] ? 'complete' : 'running',
            isComputeEnd: i[2],
            isError: i[3],
            isPostProcessing: i[6] !== 'computing',
            isPostProcessingMonitoring: i[3] ? false : i[0] ? i[7] === 'monitoring' : false,
            jobUID: i[4],
            simulationUID: i[5],
            typeof: i[6],
            ext: {}
        };
    };

    // Returns a simulation object mapped form an array of values.
    MOD.mapSimulation = function (i) {
        return {
            activity: i[0],
            activityRaw: i[1],
            computeNodeLogin: i[2],
            computeNodeLoginRaw: i[3],
            computeNodeMachine: i[4],
            computeNodeMachineRaw: i[5],
            executionEndDate: i[6],
            executionStartDate: i[7],
            experiment: i[8],
            experimentRaw: i[9],
            isError: i[10],
            hashid: i[11],
            model: i[12],
            modelRaw: i[13],
            name: i[14],
            outputEndDate: i[15],
            outputStartDate: i[16],
            space: i[17],
            spaceRaw: i[18],
            tryID: i[19],
            uid: i[20]
        };
    };

}(
    this.APP.modules.monitoring,
    this._
));
