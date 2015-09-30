(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Apply filter event handler.
    MOD.events.on("filter:updated", function () {
        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update pagination.
        MOD.updatePagination();

        // Fire event.
        MOD.events.trigger("state:simulationListFiltered");
    });

}(
    this.APP.modules.monitoring
));
