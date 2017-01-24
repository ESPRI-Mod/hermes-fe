(function (APP, MOD, STATE, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Controlled vocabularies loaded event handler.
    // @data    Data loaded from remote server.
    MOD.events.on("setup:cvDataLoaded", function (data) {
        // Update module state.
        STATE.cvTerms = APP.utils.parseCVTerms(data.cvTerms);

        // Initialise filter cv terms sets.
        MOD.initFilterCvTermsets();

        // Fetch simulation timeslice.
        MOD.fetchSimulationTimeSlice();
    });

    // Simulation timeslice loaded event handler.
    // @data    Data loaded from remote server.
    MOD.events.on("state:simulationTimesliceLoaded", function (data) {
        // Update module level state.
        STATE.simulationList = _.map(data.simulationList, MOD.mapSimulation);
        STATE.simulationSet = _.indexBy(STATE.simulationList, "id");
        STATE.simulationHashSet = _.indexBy(STATE.simulationList, "hashid");
        STATE.simulationUIDSet = _.indexBy(STATE.simulationList, "uid");
        MOD.log("simulation timeslice: module state updated");

        // Parse jobs.
        MOD.parse(_.map(data.jobList, MOD.mapJob),
                  _.map(data.jobPeriodList, MOD.mapJobPeriod));
        MOD.log("simulation timeslice: parsed");

        // Update module state.
        MOD.updateFilteredSimulationList();
        MOD.updateActiveFilterTerms();
        MOD.updatePagination();

        // Fire event.
        if (MOD.view) {
            MOD.events.trigger("state:simulationListUpdate", this);
        } else {
            MOD.events.trigger("setup:complete", this);
        }
    });

    // Job timeslice loaded event handler.
    // @data    Data loaded from remote server.
    MOD.events.on("state:jobTimesliceLoaded", function (data) {
        // Parse jobs.
        MOD.parse(_.map(data.jobList, MOD.mapJob),
                  _.map(data.jobPeriodList, MOD.mapJobPeriod));
        MOD.log("job timeslice: parsed");

        // Update module state.
        MOD.updateFilteredSimulationList();
        MOD.updateActiveFilterTerms();

        // Fire event.
        MOD.events.trigger("state:simulationListUpdate", this);
    });
}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
    this._
));
