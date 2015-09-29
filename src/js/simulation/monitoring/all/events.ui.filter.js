(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Apply filter event handler.
    MOD.events.on("ui:filter", function () {
        // Set filtered simulations.
        MOD.setFilteredSimulationList();

        // Update active filter values.
        _.each(MOD.state.filters, MOD.setActiveFilterValues);

        // Set paging.
        MOD.setPagingState();

        // Fire event.
        MOD.events.trigger("state:simulationListFiltered");
    });

}(
    this.APP.modules.monitoring,
    this._
));
