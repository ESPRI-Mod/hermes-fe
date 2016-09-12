(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns sorted collection of simulations.
    MOD.sortSimulationList = function (simulations) {
        var sortField = MOD.state.sorting.field,
            sortDirection = MOD.state.sorting.direction;

        if (_.contains(['name', 'accountingProject', 'computeNodeLogin'], sortField)) {
            simulations = _.sortBy(simulations, sortField);
        }

        if (_.contains(['computeNodeMachine', 'model', 'space', 'experiment'], sortField)) {
            simulations = _.sortBy(simulations, function (s) {
                return s.ext[sortField].toLowerCase();
            });
        }

        if (_.contains(['executionStartDate', 'executionEndDate'], sortField)) {
            simulations = _.sortBy(simulations, function (s) {
                return s[sortField] ? s[sortField].valueOf() : '--';
            });
        }

        if (_.contains(['executionStartDate', 'executionEndDate'], sortField)) {
            if (sortDirection === 'desc') {
                simulations = simulations.reverse();
            }
        } else if (sortDirection === 'desc') {
            simulations = simulations.reverse();
        }

        return simulations;
    };

    // Returns collection of filtered simulations.
    // @exclusionFilter     Filter to be excluded when determining result.
    MOD.getFilteredSimulationList = function (exclusionFilter) {
        var result, filters;

        // Exclude simulations without a valid start date.
        result = _.reject(MOD.state.simulationList, function (s) {
            return _.isNull(s.executionStartDate);
        });

        // Apply select filters.
        filters = MOD.state.filters;
        if (exclusionFilter) {
            filters = _.without(filters, exclusionFilter);
        }
        _.each(filters, function (f) {
            if (f.key !== 'timeslice' &&
                f.cvTerms.current &&
                f.cvTerms.current.name !== "*") {
                result = _.filter(result, function (s) {
                    return s[f.key] === f.cvTerms.current.name;
                });
            }
        });

        // Apply text filter.
        if (MOD.state.textFilter) {
            result = _.filter(result, function (s) {
                return s.ext.name.includes(MOD.state.textFilter);
            });
        }

        // Sort (when not applying exclusions).
        if (_.isUndefined(exclusionFilter)) {
            result = MOD.sortSimulationList(result);
        }

        return result;
    };

    // Updates collection of filtered simulations.
    MOD.updateFilteredSimulationList = function () {
        MOD.state.simulationListFiltered = MOD.getFilteredSimulationList();
    };

    // Updates filtered simulations sort order.
    MOD.updateSortedSimulationList = function (sortField) {
        // Update sort fields.
        if (MOD.state.sorting.field === sortField) {
            MOD.state.sorting.direction = (MOD.state.sorting.direction === 'asc' ? 'desc' : 'asc');
            MOD.events.trigger('state:simulationListSortOrderToggled');
        } else {
            MOD.events.trigger('state:simulationListSortOrderChanging');
            MOD.state.sorting.field = sortField;

            if (_.contains(['executionStartDate', 'executionEndDate'], sortField)) {
                MOD.state.sorting.direction = 'desc';
            } else {
                MOD.state.sorting.direction = 'asc';
            }
            MOD.events.trigger('state:simulationListSortOrderChanged');
        }

        // Update cookies.
        MOD.setCookie('sort-field', MOD.state.sorting.field);
        MOD.setCookie('sort-direction', MOD.state.sorting.direction);

        // Apply new sort field.
        MOD.state.simulationListFiltered = MOD.sortSimulationList(MOD.state.simulationListFiltered);
        MOD.updatePagination();
        MOD.events.trigger('state:simulationListSorted');
    };

    // Sets the paging state.
    MOD.updatePagination = function (currentPage) {
        var pages, page, paging = MOD.state.paging;

        // Reset pages.
        pages = APP.utils.getPages(MOD.state.simulationListFiltered, MOD.state.pageSize);
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

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
