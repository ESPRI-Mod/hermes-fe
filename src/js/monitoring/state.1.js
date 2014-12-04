(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets collection of filtered simulations.
    MOD.state.setFilteredSimulationList = function () {
        var filtered;

        // Filter.
        filtered = MOD.state.simulationList;
        _.each(MOD.filters, function (f) {
            var item;

            item = MOD.state[f.typeName];
            if (item.name !== "*") {
                filtered = _.filter(filtered, function (s) {
                    return s[f.typeName].toLowerCase() === item.name.toLowerCase();
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

        eventName = MOD.state.simulationListFiltered ? "simulationListFiltered" :
                                                       "simulationListNull";
        MOD.events.trigger("state:" + eventName, this);
    };

}(this.APP, this.APP.modules.monitoring, this._));
