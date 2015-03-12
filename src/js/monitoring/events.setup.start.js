(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Setup event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("setup:start", function (data) {
        // Cache setup data.
        MOD.state.simulationList = data.simulationList;
        MOD.state.cvTerms = data.cvTerms;

        // Parse simulations.
        _.each(data.simulationList, MOD.parseSimulation);

        // Initialize filters.
        _.each(MOD.state.filters, MOD.initFilter);

        // Set filtered simulations.
        MOD.setFilteredSimulationList();

        // Initialize active filter values.
        _.each(MOD.state.filters, MOD.setActiveFilterValues);

        // Set paging.
        MOD.setPagingState();

        // Fire event.
        MOD.events.trigger("setup:complete", this);
    });

}(
    this.APP.modules.monitoring,
    this._
));
