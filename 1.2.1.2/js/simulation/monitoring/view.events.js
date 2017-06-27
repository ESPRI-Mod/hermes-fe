(function (APP, MOD, EVENTS, STATE) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Cascades updates to managed list of simulations.
    var cascadeSimulationListUpdate = function () {
        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update active monitoring targets.
        MOD.updateActiveMonitoringTargets();

        // Update pagination.
        MOD.updatePagination();

        // Fire event.
        EVENTS.trigger("simulationTimesliceUpdated");
    };

    // Simulation timeslice parsed event handler.
    // @data    Data fetched from remote server.
    EVENTS.on("simulationTimesliceParsed", function () {
        // Updated relevant state.
        cascadeSimulationListUpdate();
    });

    // Apply select filter event handler.
    EVENTS.on("selectFilter:updated", function (filter) {
        // Update cookie.
        MOD.setCookie('filter-' + filter.cookieKey, filter.cvTerms.current.name);

        // Updated relevant state.
        cascadeSimulationListUpdate();
    });

    // Text filter event handler.
    EVENTS.on("textFilter:updated", function (text) {
        if (MOD.state.textFilter === text.trim().toLowerCase()) return;

        // Update state.
        MOD.state.textFilter = text.trim().toLowerCase();

        // Updated relevant state.
        cascadeSimulationListUpdate();
    });

    // Grid page size change event handler.
    EVENTS.on("state:pageSizeChange", function (pageSize) {
        // Update cookie.
        MOD.setCookie('page-size', pageSize);

        // Update state.
        MOD.state.pageSize = pageSize;

        // Update pagination.
        MOD.updatePagination();

        // Fire event.
        EVENTS.trigger("simulationTimesliceUpdated");
    });

    // Grid sort field change event handler.
    EVENTS.on("state:sortFieldChange", function (key) {
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
    EVENTS.on("state:sortDirectionChange", function (key) {
        // Update sort direction.
        STATE.sorting.direction = _.find(STATE.sorting.directions, function (i) {
            return i.key === key;
        });

        // Update cookie.
        MOD.setCookie('sort-direction', STATE.sorting.direction.key);

        // Update sorted simulation collection.
        MOD.updateSortedSimulationList();
    });

    // Event handler: toggle inter-monitoring link.
    EVENTS.on("im:toggle", function () {
        // Update flag.
        STATE.monitoredSimulationsOnly = !STATE.monitoredSimulationsOnly;

        // Updated relevant state.
        cascadeSimulationListUpdate();
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.events,
    this.APP.modules.monitoring.state,
));
