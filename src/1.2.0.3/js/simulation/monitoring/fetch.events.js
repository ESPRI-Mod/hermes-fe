(function (APP, MOD, STATE, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Controlled vocabularies fetched event handler.
    // @data    Data fetched from remote server.
    MOD.events.on("cv:dataFetched", function (data) {
        // Update module state.
        STATE.cvTerms = APP.utils.parseCVTerms(data.cvTerms);

        // Initialise filter cv terms sets.
        MOD.initFilterCVTermsets();

        // Fetch simulation timeslice.
        MOD.fetchSimulationTimeSlice();
    });

    // Simulation timeslice fetched event handler.
    // @data    Data fetched from remote server.
    MOD.events.on("simulationTimesliceFetched", function (data) {
        // Update state.
        STATE.simulationList = _.map(data.simulationList, MOD.mapSimulation);
        STATE.simulationSet = _.indexBy(STATE.simulationList, "id");
        STATE.simulationHashSet = _.indexBy(STATE.simulationList, "hashid");
        STATE.simulationUIDSet = _.indexBy(STATE.simulationList, "uid");
        STATE.jobCounts = _.map(data.jobCounts, MOD.mapJobCount);
        STATE.latestComputeJobs = _.map(data.latestComputeJobs, MOD.mapJob);
        STATE.jobPeriodList = _.map(data.jobPeriodList, MOD.mapJobPeriod);

        // Signal.
        MOD.events.trigger("simulationTimesliceAssigned", this);
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
    this._
));
