(function (MOD, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Apply select filter event handler.
    MOD.events.on("selectFilter:updated", function (filter) {
        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update pagination.
        MOD.updatePagination();

        // Update cookie.
        cookies.set('simulation-monitoring-filter-' + filter.cookieKey,
                    filter.cvTerms.current.name,
                    { expires: 3650 });

        // Fire event.
        MOD.events.trigger("state:simulationListUpdate");
    });

    // Apply text filter event handler.
    MOD.events.on("textFilter:updated", function (text) {
        if (MOD.state.textFilter === text.trim().toLowerCase()) return;

        // Update state.
        MOD.state.textFilter = text.trim().toLowerCase();

        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update pagination.
        MOD.updatePagination();

        // Fire event.
        MOD.events.trigger("state:simulationListUpdate");
    });

    // Apply filter event handler.
    MOD.events.on("state:pageSizeChange", function (pageSize) {
        // Update cookie.
        cookies.set('simulation-monitoring-page-size', pageSize, { expires: 3650 });

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
