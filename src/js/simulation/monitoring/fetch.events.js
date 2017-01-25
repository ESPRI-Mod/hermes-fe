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
        // Update simulations.
        STATE.simulationList = _.map(data.simulationList, MOD.mapSimulation);
        STATE.simulationSet = _.indexBy(STATE.simulationList, "id");
        STATE.simulationHashSet = _.indexBy(STATE.simulationList, "hashid");
        STATE.simulationUIDSet = _.indexBy(STATE.simulationList, "uid");
        MOD.events.trigger("simulationTimesliceAssigned", this);

        // Parse jobs.
        MOD.parse(_.map(data.jobList, MOD.mapJob),
                  _.map(data.jobPeriodList, MOD.mapJobPeriod));

        // Update related state.
        MOD.updateFilteredSimulationList();
        MOD.updateActiveFilterTerms();
        MOD.updatePagination();

        // Fire event.
        MOD.events.trigger("simulationTimesliceUpdated", this);
    });

    // Job timeslice fetched event handler.
    // @data    Data fetched from remote server.
    MOD.events.on("jobTimesliceFetched", function (data) {
        // Parse jobs.
        MOD.parse(_.map(data.jobList, MOD.mapJob),
                  _.map(data.jobPeriodList, MOD.mapJobPeriod));
        MOD.events.trigger("jobTimesliceParsed", this);

        // Update related state.
        MOD.updateFilteredSimulationList();
        MOD.updateActiveFilterTerms();

        // Signal.
        MOD.events.trigger("jobTimesliceUpdated", this);
        MOD.events.trigger("ws:activating", this);
    });
}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
    this._
));
