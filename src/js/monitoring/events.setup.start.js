(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Setup event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("setup:start", function (data) {
        // Cache setup data.
        MOD.state.simulationList = data.simulationList;
        MOD.state.simulationStateHistory = _.groupBy(data.simulationStateHistory, "simulationUID");
        MOD.state.cvTerms = data.cvTerms;

        // Parse data.
        _.each(data.simulationStateHistory, MOD.parseStateChange);
        _.each(data.simulationList, MOD.parseSimulation);

        // Set filters.
        _.each(MOD.state.filters, MOD.initFilterState);

        // Set filtered simulations.
        MOD.setFilteredSimulationList();

        // Set active filter values.
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
