(function (APP, MOD, constants, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Setup data loaded event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("state:setupDataLoaded", function (data) {
        // Cache setup data.
        MOD.state.simulationList = data.simulationList;
        MOD.state.cvTerms = data.cvTerms;

        // Parse simulations.
        _.each(data.simulationList, MOD.parseSimulation);

        // Set filters.
        _.each(MOD.state.filters, MOD.state.setFilter);

        // Set filtered simulations.
        MOD.state.setFilteredSimulationList();

        // Set paging.
        MOD.state.setPagingState();

        // Fire event.
        MOD.events.trigger("state:initialized", this);
    });

    // Apply filter event handler.
    MOD.events.on("ui:applyFilter", function () {
        // Set filtered simulations.
        MOD.state.setFilteredSimulationList();

        // Set paging.
        MOD.state.setPagingState();

        // Fire event.
        MOD.state.triggerSimulationFilterEvent();
    });

}(this.APP, this.APP.modules.monitoring, this.APP.constants, this._));
