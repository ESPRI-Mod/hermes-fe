(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses loaded timeslice.
    MOD.parseTimeslice = function (simulations, jobs) {
        // Extend simulations.
        _.each(simulations, MOD.extendSimulation);
        MOD.log("timeslice simulations extended");

        // Parse jobs.
        _.each(jobs, function (j) {
            MOD.parseJob(MOD.state.simulationSet[j.simulationID], j)
        });
        MOD.log("timeslice jobs mapped");

        // Set execution end dates.
        _.each(simulations, MOD.setSimulationExecutionEndDate);
        MOD.log("timeslice simulation end dates assigned");

        // Set execution states.
        _.each(simulations, MOD.setSimulationExecutionState);
        MOD.log("timeslice simulation compute state assigned");
    };

    // Parses web-socket event data.
    MOD.parseEvent = function (s, jobs) {
        // Extend simulation.
        MOD.extendSimulation(s);

        // Parse jobs.
        _.each(jobs, function (j) {
            MOD.parseJob(s, j);
        });

        // Set derived execution end date (necessary if 0100 not sent).
        MOD.setSimulationExecutionEndDate(s);

        // Set execution state.
        MOD.setSimulationExecutionState(s);
    };

}(
    this.APP.modules.monitoring,
    this._
));
