(function (MOD, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns a job object mapped form an array of values.
    MOD.mapJob = function (i) {
        return {
            executionEndDate: i[0] ? moment(i[0]) : null,
            executionStartDate: i[1] ? moment(i[1]) : null,
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
            executionEndDate: i[5] ? moment(i[5]) : null,
            executionStartDate: i[6] ? moment(i[6]) : null,
            experiment: i[7],
            experimentRaw: i[8],
            isError: i[9],
            hashid: i[10],
            model: i[11],
            modelRaw: i[12],
            name: i[13],
            space: i[14],
            spaceRaw: i[15],
            tryID: i[16],
            uid: i[17]
        };
    };

}(
    this.APP.modules.monitoring,
    this.moment
));
