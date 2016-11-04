(function (APP, MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns a job object mapped form an array of values.
    MOD.mapJob = function (i) {
        return {
            executionEndDate: i[0],
            executionStartDate: i[1],
            executionState: i[5] === 1 ? 'error' : i[0] ? 'complete' : 'running',
            executionState1: i[2],
            id: i[3],
            isComputeEnd: i[4] === 1,
            isError: i[5] === 1,
            isIM: i[6] === 1,
            simulationID: i[8],
            typeof: i[7],
            ext: {}
        };
    };

    // Returns a job period object mapped form an array of values.
    MOD.mapJobPeriod = function (i) {
        return {
            simulationID: i[0],
            startDate: i[1]
        };
    };

    // Returns a simulation object mapped form an array of values.
    MOD.mapSimulation = function (i) {
        return {
            accountingProject: i[0] ? i[0] : '--',
            computeNodeLogin: i[1],
            computeNodeMachine: i[2],
            executionEndDate: i[3],
            executionStartDate: i[4],
            executionProgress: i[3] ? 100 : 0,
            experiment: i[5],
            experimentRaw: i[6],
            isError: i[7],
            hashid: i[8],
            id: i[9],
            model: i[10],
            modelRaw: i[11],
            name: i[12],
            space: i[13],
            spaceRaw: i[14],
            tryID: i[15],
            uid: i[16],
            outputStartDate: i[17],
            outputEndDate: i[18]
        };
    };

}(
    this.APP,
    this.APP.modules.monitoring
));
