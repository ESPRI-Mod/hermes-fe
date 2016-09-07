(function (MOD) {

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
            jobUID: i[4],
            postProcessingName: i[7],
            simulationUID: i[5],
            typeof: i[6],
            ext: {}
        };
    };

    // Returns a simulation object mapped form an array of values.
    MOD.mapSimulation = function (i) {
        return {
            accountingProject: i[0] ? i[0] : '--',
            computeNodeLogin: i[1],
            computeNodeLoginRaw: i[2],
            computeNodeMachine: i[3],
            computeNodeMachineRaw: i[4],
            executionEndDate: i[5],
            executionStartDate: i[6],
            experiment: i[7],
            experimentRaw: i[8],
            isError: i[9],
            hashid: i[10],
            model: i[11],
            modelRaw: i[12],
            name: i[13],
            outputEndDate: i[14],
            outputStartDate: i[15],
            space: i[16],
            spaceRaw: i[17],
            tryID: i[18],
            uid: i[19]
        };
    };

}(
    this.APP.modules.monitoring
));
