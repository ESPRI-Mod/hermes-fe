(function (APP, MOD, STATE, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Simulation timeslice fetched event handler.
    // @data    Data fetched from remote server.
    MOD.events.on("simulationTimesliceAssigned", function () {
        // Signal.
        MOD.events.trigger("simulationTimesliceParsing", this);

        // Extend simulations.
        _.each(STATE.simulationList, MOD.extendSimulation);
        MOD.events.trigger("simulationTimesliceExtended", this);

        // Set job counts.
        _.each(STATE.jobCounts, function (jc) {
            var s = STATE.simulationSet[jc.simulationID];
            s.jobCounts[jc.jobType][jc.jobState] = jc.count;
            s.jobCounts[jc.jobType].all += jc.count;
            s.jobCounts.all += jc.count;
        });

        // Set latest compute job.
        _.each(STATE.latestComputeJobs, function (j) {
            var s = STATE.simulationSet[j.simulationID];
            s.ext.latestComputeJob = j;
        });

        // Set job periods & signal.
        _.each(STATE.jobPeriodList, function (jp) {
            MOD.parseJobPeriod(STATE.simulationSet[jp.simulationID], jp);
        });
        MOD.events.trigger("simulationTimesliceJobsParsed", this);

        // Set execution end dates & signal.
        _.each(STATE.simulationList, MOD.setSimulationExecutionEndDate);
        MOD.events.trigger("simulationTimesliceEndDateAssigned", this);

        // Set execution states & signal.
        _.each(STATE.simulationList, MOD.setSimulationExecutionState);
        MOD.events.trigger("simulationTimesliceExecutionStateAssigned", this);

        // Signal.
        MOD.events.trigger("simulationTimesliceParsed", this);
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
    this._
));
