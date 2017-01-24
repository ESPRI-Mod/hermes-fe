(function (APP, MOD, STATE, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses module state.
    MOD.parse = function (jobList, jobPeriodList) {
        // Extend simulations.
        _.each(STATE.simulationList, MOD.extendSimulation);
        MOD.log("simulations extended");

        // Parse data.
        _.each(jobList, function (j) {
            MOD.parseJob(STATE.simulationSet[j.simulationID], j);
        });
        _.each(jobPeriodList, function (jp) {
            MOD.parseJobPeriod(STATE.simulationSet[jp.simulationID], jp);
        });
        MOD.log("jobs parsed");

        // Set execution end dates.
        _.each(STATE.simulationList, MOD.setSimulationExecutionEndDate);
        MOD.log("simulations end dates assigned");

        // Set execution states.
        _.each(STATE.simulationList, MOD.setSimulationExecutionState);
        MOD.log("simulations compute state assigned");
    };

    // Parses web-socket event data.
    MOD.parseWSEventData = function (s, jList, jp) {
        // Extend simulation.
        MOD.extendSimulation(s);

        // Parse jobs.
        _.each(jList, function (j) {
            MOD.parseJob(s, j);
        });

        // Parse job period.
        if (APP.utils.isNone(jp) === false) {
            MOD.parseJobPeriod(s, jp);
        }

        // Set execution end date.
        MOD.setSimulationExecutionEndDate(s);

        // Set execution state.
        MOD.setSimulationExecutionState(s);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
    this._
));
