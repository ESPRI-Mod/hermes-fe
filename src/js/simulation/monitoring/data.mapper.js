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
            activity: i[1],
            activityRaw: i[2],
            computeNodeLogin: i[3],
            computeNodeLoginRaw: i[4],
            computeNodeMachine: i[5],
            computeNodeMachineRaw: i[6],
            executionEndDate: i[7],
            executionStartDate: i[8],
            experiment: i[9],
            experimentRaw: i[10],
            isError: i[11],
            hashid: i[12],
            model: i[13],
            modelRaw: i[14],
            name: i[15],
            outputEndDate: i[16],
            outputStartDate: i[17],
            space: i[18],
            spaceRaw: i[19],
            tryID: i[20],
            uid: i[21]
        };
    };

}(
    this.APP.modules.monitoring
));
