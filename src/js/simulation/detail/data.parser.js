(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (s, jobs) {
        // Extend simulation.
        MOD.extendSimulation(s);

        // Extend jobs.
        _.each(jobs, MOD.extendJob);

        // Parse jobs.
        _.each(jobs, function (j) {
            MOD.parseJob(s, j);
        });

        // Sort jobsets.
        MOD.sortJobset(s.jobs.compute);
        MOD.sortJobset(s.jobs.postProcessing);

        // Set pagination.
        MOD.setJobsetPagination(s.jobs.compute, true);
        MOD.setJobsetPagination(s.jobs.postProcessing, true);

        // Set derived execution state.
        MOD.setSimulationExecutionState(s);

        // Set derived execution end date (necessary if 0100 not sent).
        MOD.setSimulationExecutionEndDate(s);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
