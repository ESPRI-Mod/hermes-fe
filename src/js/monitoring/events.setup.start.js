(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Setup event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("setup:start", function (data) {
        // Parse event data.
        _.each(data.simulationList, function (simulation) {
            MOD.parseSimulation(simulation, data.jobHistory);
        });

        // Initialise state.
        _.extend(MOD.state, {
            cvTerms: data.cvTerms,
            simulationList: data.simulationList,
            simulationSet: _.indexBy(data.simulationList, "uid")
        });

        // Initialise filter values.
        _.each(MOD.state.filters, MOD.initFilterState);

        // Initialise filtered list.
        MOD.setFilteredSimulationList();

        // Initialise active filter values.
        _.each(MOD.state.filters, MOD.setActiveFilterValues);

        // Initialise paging.
        MOD.setPagingState();

        // Fire event.
        MOD.events.trigger("setup:complete", this);
    });

}(
    this.APP.modules.monitoring,
    this._
));
