(function (APP, MOD, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Fetches a timeslice of data from server & fire relevant event.
    MOD.fetchTimeSlice = function (timeslice, triggerBackgroundEvents) {
        var ep;

        if (triggerBackgroundEvents === true) {
            APP.events.trigger("module:processingStarts", {
                module: MOD,
                info: 'Loading data'
            });
        }

        ep = APP.utils.getEndPoint(MOD.urls.FETCH_TIMESLICE);
        ep  = ep.replace('{timeslice}', timeslice);
        $.getJSON(ep, function (data) {
            MOD.events.trigger("state:timesliceLoaded", data);
        });

        if (triggerBackgroundEvents === true) {
            setTimeout(function () {
                APP.events.trigger("module:processingEnds");
            }, 250);
        }
    };

    // Returns collection of filtered simulations.
    // @exclusionFilter     Filter to be excluded when determining result.
    var getFilteredSimulationList = function (exclusionFilter) {
        var result, filters;

        // Exclude simulations without a valid start date.
        result = _.reject(MOD.state.simulationList, function (s) {
            return _.isNull(s.executionStartDate);
        });

        // Apply filters.
        filters = MOD.state.filters;
        if (exclusionFilter) {
            filters = _.without(filters, exclusionFilter);
        }
        _.each(filters, function (f) {
            if (f.cvTerms.current &&
                f.cvTerms.current.name !== "*") {
                result = _.filter(result, function (s) {
                    return s[f.key] === f.cvTerms.current.name;
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

    // Updates collection of filtered simulations.
    MOD.updateFilteredSimulationList = function () {
        MOD.state.simulationListFiltered = getFilteredSimulationList();
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
    MOD.updatePagination = function (currentPage) {
        var pages, page, paging = MOD.state.paging;

        // Reset pages.
        pages = APP.utils.getPages(MOD.state.simulationListFiltered);
        paging.count = pages.length;
        paging.current = pages ? pages[0] : null;
        paging.pages = pages;

        // Ensure current page is respected when pages collection changes.
        if (currentPage) {
            page = _.find(pages, function (p) {
                return _.indexOf(p.data, currentPage.data[0]) !== -1;
            });
            if (page) {
                paging.current = page;
            }
        }
    };

    // Sets a filter's active terms.
    MOD.updateActiveFilterTerms = function () {
        _.each(MOD.state.filters, function (filter) {
            var simulationList, activeTermNames;

            // Set target simulation list.
            if (filter.cvTerms.current.name === '*') {
                simulationList = MOD.state.simulationListFiltered;
            } else {
                simulationList = getFilteredSimulationList(filter);
            }

            // Set active term names collection.
            activeTermNames = _.pluck(simulationList, filter.key);
            if (filter.defaultValue) {
                activeTermNames.push(filter.defaultValue);
            }
            activeTermNames = _.uniq(activeTermNames);

            // Set term is active flag.
            _.each(filter.cvTerms.all, function (term) {
                term.isActive = term.name === '*' ||
                                _.indexOf(activeTermNames, term.name) >= 0;
            });

            // Fire event.
            MOD.events.trigger("filter:activeTermsUpdated", filter);
        });
    };
}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq,
    this._
));
