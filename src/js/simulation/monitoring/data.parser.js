(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses loaded timeslice.
    MOD.parseTimeslice = function (sList, jList, jpList) {
        // Extend simulations.
        _.each(sList, MOD.extendSimulation);
        MOD.log("timeslice simulations extended");

        // Parse jobs.
        _.each(jList, function (j) {
            MOD.parseJob(MOD.state.simulationSet[j.simulationID], j);
        });
        MOD.log("timeslice jobs parsed");

        // Parse job periods.
        _.each(jpList, function (jp) {
            MOD.parseJobPeriod(MOD.state.simulationSet[jp.simulationID], jp);
        });
        MOD.log("timeslice job periods parsed");

        // Set execution end dates.
        _.each(sList, MOD.setSimulationExecutionEndDate);
        MOD.log("timeslice simulation end dates assigned");

        // Set execution states.
        _.each(sList, MOD.setSimulationExecutionState);
        MOD.log("timeslice simulation compute state assigned");
    };

    // Parses web-socket event data.
    MOD.parseEventData = function (s, jList, jp) {
        // Extend simulation.
        MOD.extendSimulation(s);

        // Parse jobs.
        _.each(jList, function (j) {
            MOD.parseJob(s, j);
        });

        // Parse job period.
        MOD.parseJobPeriod(s, jp);

        // Set execution end date.
        MOD.setSimulationExecutionEndDate(s);

        // Set execution state.
        MOD.setSimulationExecutionState(s);
    };

}(
    this.APP.modules.monitoring,
    this._
));
