(function (APP, MOD, STATE) {

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
        MOD.setCookie('filter-' + filter.cookieKey, filter.cvTerms.current.name);

        // Fire event.
        MOD.events.trigger("simulationTimesliceUpdated");
    });

    // Text filter event handler.
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
        MOD.events.trigger("simulationTimesliceUpdated");
    });

    // Grid page size change event handler.
    MOD.events.on("state:pageSizeChange", function (pageSize) {
        // Update cookie.
        MOD.setCookie('page-size', pageSize);

        // Update state.
        MOD.state.pageSize = pageSize;

        // Update pagination.
        MOD.updatePagination();

        // Fire event.
        MOD.events.trigger("simulationTimesliceUpdated");
    });

    // Grid sort field change event handler.
    MOD.events.on("state:sortFieldChange", function (key) {
        // Update sort field.
        STATE.sorting.field = _.find(STATE.sorting.fields, function (i) {
            return i.key === key;
        });

        // Update cookie.
        MOD.setCookie('sort-field', STATE.sorting.field.key);

        // Update sorted simulation collection.
        MOD.updateSortedSimulationList();
    });

    // Grid sort direction change event handler.
    MOD.events.on("state:sortDirectionChange", function (key) {
        // Update sort direction.
        STATE.sorting.direction = _.find(STATE.sorting.directions, function (i) {
            return i.key === key;
        });

        // Update cookie.
        MOD.setCookie('sort-direction', STATE.sorting.direction.key);

        // Update sorted simulation collection.
        MOD.updateSortedSimulationList();
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
));
