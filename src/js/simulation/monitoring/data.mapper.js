(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns a job object mapped form an array of values.
    MOD.mapJob = function (i) {
        return {
            executionEndDate: i[0],
            executionStartDate: i[1],
            executionState: i[3] ? 'error' : i[0] ? 'complete' : 'running',
            executionState1: i[6],
            isComputeEnd: i[2] === 1,
            isError: i[3] === 1,
            isIM: i[7] === 1,
            id: i[4],
            simulationID: i[8],
            typeof: i[5],
            ext: {}
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
            experiment: i[5],
            experimentRaw: i[6],
            isError: i[7],
            hashid: i[8],
            model: i[9],
            modelRaw: i[10],
            name: i[11],
            space: i[12],
            spaceRaw: i[13],
            tryID: i[14],
            uid: i[15],
            id: i[16]
        };
    };

}(
    this.APP.modules.monitoring
));
