(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Setup event handler.
    // @data    Page setup data loaded from remote server.
    MOD.events.on("setup:pageDataDownloaded", function (data) {
        // Parse event data.
        _.each(data.simulationList, function (simulation) {
            MOD.parseSimulation(simulation, data.jobHistory);
        });

        // Initialise module state.
        _.extend(MOD.state, {
            simulationList: data.simulationList,
            simulationSet: _.indexBy(data.simulationList, "uid")
        });

        // Initialise filter state.
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
