(function (APP, $, _, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Initializes filter cv termsets.
    APP.initFilterCvTermsets = function () {
        // Append global filter.
        _.each(APP.state.filters, function (f) {
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

        // Push terms into filters.
        _.each(APP.state.cvTerms, function (term) {
            if (_.has(APP.state.filterSet, term.typeof)) {
                APP.state.filterSet[term.typeof].cvTerms.all.push(term);
            }
        });

        // Set current term.
        _.each(APP.state.filters, function (f) {
            f.cvTerms.current = _.find(f.cvTerms.all, function (term) {
                return term.name === f.initialValue;
            });
        });
    };

    // Updates current filter value.
    APP.updateFilterValue = function (filterKey, filterOption) {
        var filter;

        filter = _.find(APP.state.filters, function (f) {
            return f.key === filterKey;
        });
        filter.cvTerms.current = _.find(filter.cvTerms.all, function (t) {
            return t.name === filterOption;
        });
        cookies.set('simulation-monitoring-filter-' + filter.cookieKey,
                    filter.cvTerms.current.name,
                    { expires: 3650 });

        APP.events.trigger('filter:updated', filter);
    };

    // Updates set of active cv terms used to filter simulation list.
    APP.updateActiveFilterTerms = function () {
        _.each(APP.state.filters, function (filter) {
            var simulationList,
                activeTermNames;

            // Escape if processing a custom filter.
            if (filter.isCustom) {
                return;
            }

            // Set target simulation list.
            if (filter.cvTerms.current.name === '*') {
                simulationList = APP.state.simulationListFiltered;
            } else {
                simulationList = getFilteredSimulationList(filter);
            }

            // Set active term names collection.
            activeTermNames = _.pluck(simulationList, filter.key);
            if (filter.forcedValue) {
                activeTermNames.push(filter.forcedValue);
            }
            activeTermNames = _.uniq(activeTermNames);

            // Set term is active flag.
            _.each(filter.cvTerms.all, function (term) {
                term.isActive = (term.name === '*' || _.indexOf(activeTermNames, term.name) >= 0);
            });

            // Fire event.
            APP.events.trigger("state:filterOptionsUpdate", filter);
        });

        // Fire event.
        APP.events.trigger("state:filtersUpdated");
    };

}(
    this.APP,
    this.$jq,
    this._,
    this.Cookies
));
