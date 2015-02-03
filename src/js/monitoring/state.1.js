(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets collection of filtered simulations.
    MOD.state.setFilteredSimulationList = function () {
        var filtered;

        // Initialise.
        filtered = MOD.state.simulationList;

        // Apply filters.
        _.each(MOD.state.filters, function (filter) {
            if (filter.cvTerms.current && filter.cvTerms.current.name !== "*") {
                filtered = _.filter(filtered, function (s) {
                    return s[filter.key] === filter.cvTerms.current.name;
                });
            }
        });

        // Sort.
        filtered = _.sortBy(filtered, function (s) {
            return s.activity + s.name;
        });

        // Set.
        MOD.state.simulationListFiltered = filtered;
    };

    // Sets the paging state.
    MOD.state.setPagingState = function (currentPage) {
        var pages, page, paging = MOD.state.paging;

        // Reset pages.
        pages = APP.utils.getPages(MOD.state.simulationListFiltered);
        paging.count = pages.length;
        paging.current = pages ? pages[0] : undefined;
        paging.pages = pages;
        paging.previous = undefined;

        // Ensure current page is respected.
        if (currentPage) {
            page = _.find(pages, function (p) {
                return _.indexOf(p.data, currentPage.data[0]) !== -1;
            });
            if (page) {
                paging.current = page;
            }
        }
    };

    // Triggers simulation filter event.
    MOD.state.triggerSimulationFilterEvent = function () {
        var eventName;

        eventName = "state:";
        eventName += MOD.state.simulationListFiltered ? "simulationListFiltered" :
                                                        "simulationListNull";
        MOD.events.trigger(eventName, this);
    };

}(this.APP, this.APP.modules.monitoring, this._));
