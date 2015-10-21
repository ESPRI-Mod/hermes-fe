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
            typeof: i[6]
        };
    };

    // Returns a simulation object mapped form an array of values.
    MOD.mapSimulation = function (i) {
        return {
            accountingProject: i[0],
            activity: i[1],
            activityRaw: i[2],
            computeNode: i[3],
            computeNodeRaw: i[4],
            computeNodeLogin: i[5],
            computeNodeLoginRaw: i[6],
            computeNodeMachine: i[7],
            computeNodeMachineRaw: i[8],
            executionEndDate: i[9],
            executionStartDate: i[10],
            experiment: i[11],
            experimentRaw: i[12],
            isError: i[13],
            hashid: i[14],
            model: i[15],
            modelRaw: i[16],
            name: i[17],
            outputEndDate: i[18],
            outputStartDate: i[19],
            space: i[20],
            spaceRaw: i[21],
            tryID: i[22],
            uid: i[23]
        };
    };

}(
    this.APP.modules.monitoring,
    this._
));
