(function (APP, MOD, STATE, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Parses module state.
    MOD.parse = function (jobList, jobPeriodList) {
        MOD.events.trigger("simulationTimesliceParsing", this);

        // Extend simulations.
        _.each(STATE.simulationList, MOD.extendSimulation);
        MOD.events.trigger("simulationTimesliceExtended", this);

        // Parse data.
        _.each(jobList, function (j) {
            MOD.parseJob(STATE.simulationSet[j.simulationID], j);
        });
        _.each(jobPeriodList, function (jp) {
            MOD.parseJobPeriod(STATE.simulationSet[jp.simulationID], jp);
        });
        MOD.events.trigger("simulationTimesliceJobsParsed", this);

        // Set execution end dates.
        _.each(STATE.simulationList, MOD.setSimulationExecutionEndDate);
        MOD.events.trigger("simulationTimesliceEndDateAssigned", this);

        // Set execution states.
        _.each(STATE.simulationList, MOD.setSimulationExecutionState);
        MOD.events.trigger("simulationTimesliceExecutionStateAssigned", this);

        MOD.events.trigger("simulationTimesliceParsed", this);
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
