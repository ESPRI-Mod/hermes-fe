(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets collection of filtered simulations.
    MOD.state.setFilteredSimulationList = function () {
        var filtered;

        // Initialise.
        filtered = MOD.state.simulationList;

        // Apply filters.
        _.each(MOD.filters, function (filter) {
            if (MOD.state[filter.key] !== "*") {
                filtered = _.filter(filtered, function (s) {
                    return s[filter.key] === MOD.state[filter.key];
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

    // Set filter data.
    MOD.state.setFilterData = function (filter) {
        var values;

        // Set values.
        values = _.map(MOD.state.simulationList, function (s) {
            return s[filter.key];
        });
        if (filter.defaultValue) {
            values.push(filter.defaultValue);
        }
        values = _.uniq(values);
        values = _.sortBy(values, function (value) {
            return value.toLowerCase();
        });
        values.unshift("*");

        // Update module state.
        MOD.state[filter.key + "List"] = values;
        MOD.state[filter.key] = filter.defaultValue || values[0];
    };

    // Resets filter data.
    MOD.state.updateFilterData = function (filter, newValue) {
        var values;

        // Escape if value is a duplicate.
        values = MOD.state[filter.key + "List"];
        if (_.contains(values, newValue)) {
            return;
        }
        console.log("Updating filter data: " + filter.key + " : " + newValue);

        // Add new.
        values.push(newValue);

        // Resort.
        values = _.sortBy(values, function (value) {
            return value.toLowerCase();
        });

        // Recache.
        MOD.state[filter.key + "List"] = values;

        // Fire event.
        MOD.events.trigger("filter:refresh", filter);
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
