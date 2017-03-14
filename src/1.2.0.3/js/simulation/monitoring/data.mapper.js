(function (APP, MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Maps a job.
    MOD.mapJob = function (i) {
        return {
            simulationID: i[0],
            executionState: i[4] === 1 ? 'error' : i[6] ? 'complete' : 'running',
            isComputeEnd: i[3] === 1,
            isError: i[4] === 1,
            typeof: i[1],
            executionStartDate: i[5],
            executionEndDate: i[6]
        };
    };

    // Returns a job count object mapped form an array of values.
    MOD.mapJobCount = function (i) {
        return {
            simulationID: i[0],
            jobType: i[1],
            jobState: i[2],
            count: i[3]
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
            outputEndDate: i[18],
            isIM: i[19] === 1
        };
    };

}(
    this.APP,
    this.APP.modules.monitoring
));
