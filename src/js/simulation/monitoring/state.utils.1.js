(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Initializes filter cv termsets.
    MOD.initFilterCVTermsets = function () {
        // Push terms into filters.
        _.each(MOD.state.cvTerms, function (term) {
            if (_.has(MOD.state.filterSet, term.typeof)) {
                MOD.state.filterSet[term.typeof].cvTerms.all.push(term);
                MOD.state.filterSet[term.typeof].cvTerms.active.push(term);
            } else {
                MOD.logWarning("SUPERFLUOS TERM :: " + term.typeof + " :: " + term.name);
            }
        });

        // Set global filter.
        _.each(MOD.state.filters, function (f) {
            var term;
            term = {
                typeof: f.cvType,
                displayName: '*',
                name: '*',
                id: '*',
                synonyms: [],
                sortKey: "AAA",
                text: f.globalFilterLabel || '*'
            };
            if (f.globalFilterPosition === 'last') {
                f.cvTerms.all.push(term);
                f.cvTerms.active.push(term);
            } else {
                f.cvTerms.all.unshift(term);
                f.cvTerms.active.unshift(term);
            }
        });

        // Set current term.
        _.each(MOD.state.filters, function (f) {
            f.cvTerms.current = _.find(f.cvTerms.all, function (term) {
                return term.name === f.initialValue;
            });
        });
    };

    // Updates select filter value.
    MOD.updateSelectFilterValue = function (filterKey, filterOption) {
        var filter;

        filter = _.find(MOD.state.filters, function (f) {
            return f.key === filterKey;
        });
        filter.cvTerms.current = _.find(filter.cvTerms.all, function (t) {
            return t.name === filterOption;
        });

        MOD.setCookie('filter-' + filter.cookieKey, filter.cvTerms.current.name);

        if (filterKey === 'timeslice') {
            MOD.fetchSimulationTimeSlice(true);
        } else {
            MOD.events.trigger('selectFilter:updated', filter);
        }
    };

    // Updates set of active cv terms used to filter simulation list.
    MOD.updateActiveFilterTerms = function () {
        _.each(MOD.state.filters, function (filter) {
            var simulationList,
                activeTermNames;

            // Escape if processing timeslice filter.
            if (filter.key === 'timeslice') {
                return;
            }

            // Set target simulation list.
            if (filter.cvTerms.current.name === '*') {
                simulationList = MOD.state.simulationListFiltered;
            } else {
                simulationList = MOD.getFilteredSimulationList(filter);
            }

            // Set active term names collection.
            activeTermNames = _.pluck(simulationList, filter.key);
            if (filter.forcedValue) {
                activeTermNames.push(filter.forcedValue);
            }
            activeTermNames = _.uniq(activeTermNames);

            // Set term is active flag.
            filter.cvTerms.active = _.filter(filter.cvTerms.all, function (term) {
                return term.name === '*' || _.indexOf(activeTermNames, term.name) >= 0;
            });

            // Fire event.
            if (MOD.view) {
                MOD.events.trigger("filterOptionsUpdate", filter);
            }
        });

        // Fire event.
        if (MOD.view) {
            MOD.events.trigger("filtersUpdated");
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
