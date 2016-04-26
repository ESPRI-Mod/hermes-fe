(function (MOD, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Apply filter event handler.
    MOD.events.on("filter:updated", function (filter) {
        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update pagination.
        MOD.updatePagination();

        // Update cookie.
        cookies.set(filter.cookieKey, filter.cvTerms.current.name);

        // Fire event.
        MOD.events.trigger("state:simulationListUpdate");
    });

    // Apply filter event handler.
    MOD.events.on("state:pageSizeChange", function (pageSize) {
        // Update cookie.
        cookies.set('simulation-monitoring-page-size', pageSize);

        // Update state.
        MOD.state.pageSize = pageSize;

        // Update pagination.
        MOD.updatePagination();

        // Fire event.
        MOD.events.trigger("state:simulationListUpdate");
    });

}(
    this.APP.modules.monitoring,
    this.Cookies
));
