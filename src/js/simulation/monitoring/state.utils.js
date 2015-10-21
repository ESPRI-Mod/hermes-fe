(function (APP, MOD, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Fetches a timeslice of data from server & fire relevant event.
    MOD.fetchTimeSlice = function (timeslice, triggerBackgroundEvents) {
        var ep;

        if (triggerBackgroundEvents === true) {
            APP.events.trigger("module:processingStarts", {
                module: MOD,
                info: 'Fetching data'
            });
        }

        ep = APP.utils.getEndPoint(MOD.urls.FETCH_TIMESLICE);
        ep  = ep.replace('{timeslice}', timeslice);
        MOD.log("timeslice fetching begins");
        $.getJSON(ep, function (data) {
            MOD.log("timeslice fetched");
            MOD.events.trigger("state:timesliceLoaded", data);
            if (triggerBackgroundEvents === true) {
                setTimeout(function () {
                    APP.events.trigger("module:processingEnds");
                }, 250);
            }
        });
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
            if (f.isCustom === false &&
                f.cvTerms.current &&
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

    // Initializes filter cv termsets.
    MOD.initFilterCvTermsets = function () {
        _.each(MOD.state.filters, function (f) {
            if (f.supportsByAll) {
                f.cvTerms.all.push({
                    typeof: f.cvType,
                    name: '*',
                    displayName: '*',
                    synonyms: [],
                    sortKey: "AAA"
                });
            }
        });
        _.each(MOD.state.cvTerms, function (term) {
            if (_.has(MOD.state.filterSet, term.typeof)) {
                MOD.state.filterSet[term.typeof].cvTerms.all.push(term);
            }
        });
        _.each(MOD.state.filters, function (f) {
            f.cvTerms.current = f.cvTerms.current || _.find(f.cvTerms.all, function (term) {
                return term.name === (f.defaultValue || "*");
            });
        });
    };

    // Initializes filter cv termsets.
    MOD.updateFilterCvTermsets = function (terms) {
        MOD.state.cvTerms = _.union(MOD.state.cvTerms, terms);
        _.each(terms, function (term) {
            if (_.has(MOD.state.filterSet, term.typeof)) {
                MOD.state.filterSet[term.typeof].cvTerms.all.push(term);
            }
        });
    };

    // Updates current filter value.
    MOD.updateFilterValue = function (filterKey, filterOption) {
        var filter;

        filter = _.find(MOD.state.filters, function (f) {
            return f.key === filterKey;
        });
        filter.cvTerms.current = _.find(filter.cvTerms.all, function (t) {
            return t.name === filterOption;
        });
        MOD.events.trigger('filter:updated', filter);
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

    // Updates set of active cv terms used to filter simulation list.
    MOD.updateActiveFilterTerms = function () {
        _.each(MOD.state.filters, function (filter) {
            var simulationList, activeTermNames;

            // Escape if processing a custom filter.
            if (filter.isCustom) {
                return;
            }

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
            MOD.events.trigger("state:filterOptionsUpdate", filter);
        });
    };
}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq,
    this._
));
