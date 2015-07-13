(function (APP, MOD, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Fetches a timeslice of data from server & fire relevant event.
    MOD.fetchTimeSlice = function (eventName, triggerBackgroundEvents) {
        var ep;

        if (triggerBackgroundEvents === true) {
            APP.events.trigger("module:processingStarts", {
                module: MOD,
                info: 'Loading data'
            });
        }

        ep = APP.utils.getEndPoint(MOD.urls.FETCH_TIMESLICE);
        ep  = ep.replace('{timeslice}', MOD.state.filterTimeSlice);
        $.getJSON(ep, function (data) {
            MOD.events.trigger(eventName, data);
        });

        if (triggerBackgroundEvents === true) {
            setTimeout(function () {
                APP.events.trigger("module:processingEnds");
            }, 250);
            
        }
    };

    // Returns collection of filtered simulations.
    // @exclusionFilter     Filter to be excluded when determining result.
    MOD.getFilteredSimulationList = function (exclusionFilter) {
        var result, filters;

        // Exclude simulations without a valid start date.
        result = _.reject(MOD.state.simulationList, function (s) {
            return _.isNull(s.executionStartDate);
        });

        // Apply filters.
        filters = _.without(MOD.state.filters, exclusionFilter);
        _.each(filters, function (filter) {
            if (filter.cvTerms.current &&
                filter.cvTerms.current.name !== "*") {
                result = _.filter(result, function (s) {
                    return s[filter.key] === filter.cvTerms.current.name;
                });
            }
        });

        // Sort (when not applying exclusions).
        if (_.isUndefined(exclusionFilter)) {
            result = _.sortBy(result, function (s) {
                return s.executionStartDate.valueOf();
            }).reverse();
        }

        return result;
    };

    // Sets collection of filtered simulations.
    MOD.setFilteredSimulationList = function () {
        MOD.state.simulationListFiltered = MOD.getFilteredSimulationList();
    };

    // Initializes filter state.
    MOD.initFilterState = function (filter) {
        // Set all terms.
        filter.cvTerms.all = MOD.cv.getTermset(filter.cvType);
        filter.cvTerms.all = _.sortBy(filter.cvTerms.all, function (cvTerm) {
            return cvTerm.name.toLowerCase();
        });
        if (filter.supportsByAll) {
            filter.cvTerms.all.unshift(MOD.cv.getGlobalTerm(filter.cvType));
        }

        // Set current term.
        if (!filter.cvTerms.current) {
            filter.cvTerms.current = _.find(filter.cvTerms.all, function (term) {
                return term.name === (filter.defaultValue || "*");
            });
        }
    };

    // Sets the paging state.
    MOD.setPagingState = function (currentPage) {
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
    MOD.triggerSimulationFilterEvent = function () {
        var eventName;

        eventName = "state:";
        eventName += MOD.state.simulationListFiltered ? "simulationListFiltered" :
                                                        "simulationListNull";
        MOD.events.trigger(eventName, this);
    };

    // Sets a filter's active values.
    MOD.setActiveFilterValues = function (filter) {
        var simulationList;

        // Set target simulation list.
        if (filter.cvTerms.current.name === '*') {
            simulationList = MOD.state.simulationListFiltered;
        } else {
            simulationList = MOD.getFilteredSimulationList(filter);
        }

        // Set active terms.
        filter.cvTerms.active = _.map(simulationList, function (s) {
            return s[filter.key];
        });
        if (filter.defaultValue) {
            filter.cvTerms.active.push(filter.defaultValue);
        }
        filter.cvTerms.active = _.uniq(filter.cvTerms.active);
    };

    // Gets list of simulations for inter-monitoring.
    MOD.getSimulationListForIM = function () {
        return _.filter(MOD.state.simulationList, function (simulation) {
            return simulation.ext.isSelectedForIM;
        });
    };
}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq,
    this._
));
