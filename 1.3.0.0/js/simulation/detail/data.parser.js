(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses a simulation in readiness for processing.
    MOD.parseSimulation = function (s, jList, jp) {
        // Extend simulation.
        MOD.extendSimulation(s);

        // Extend jobs.
        _.each(jList, MOD.extendJob);

        // Parse jobs.
        _.each(jList, function (j) {
            MOD.parseJob(s, j);
        });

        // Parse job period.
        MOD.parseJobPeriod(s, jp);

        // Sort jobsets.
        MOD.sortJobset(s.jobs.compute);
        MOD.sortJobset(s.jobs.postProcessing);

        // Set pagination.
        MOD.setJobsetPagination(s.jobs.compute, true);
        MOD.setJobsetPagination(s.jobs.postProcessing, true);

        // Set derived execution information.
        MOD.setSimulationDerivedInformation(s);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
