(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns collection of filtered simulations.
    // @exclusionFilter     Filter to be excluded when determining result.
    MOD.getFilteredSimulationList = function (exclusionFilter) {
        var filters, result;

        // Set filters to apply.
        filters = _.without(MOD.state.filters, exclusionFilter);

        // Apply filters.
        result = MOD.state.simulationList;
        _.each(filters, function (filter) {
            if (filter.cvTerms.current &&
                filter.cvTerms.current.name !== "*") {
                result = _.filter(result, function (s) {
                    return s[filter.key] === filter.cvTerms.current.name;
                });
            }
        });

        // Sort.
        return _.sortBy(result, function (s) {
            return s.activity + s.name;
        });
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

    // Updates filter state.
    MOD.updateFilterState = function (filter) {
        filter.cvTerms.all = MOD.cv.getTermset(filter.cvType);
        filter.cvTerms.all = _.sortBy(filter.cvTerms.all, function (cvTerm) {
            return cvTerm.name.toLowerCase();
        });
        if (filter.supportsByAll) {
            filter.cvTerms.all.unshift(MOD.cv.getGlobalTerm(filter.cvType));
        }
    };

    // Delete simulations that have been rerun.
    MOD.deleteDeadSimulations = function (hashid) {
        var dead
        dead = _.find(MOD.state.simulationList, function (s) {
            return s.hashid === hashid;
        });
        if (dead) {
            MOD.state.simulationList = _.without(MOD.state.simulationList, dead);
            MOD.state.simulationListFiltered = _.without(MOD.state.simulationListFiltered, dead);
            if (_.has(MOD.state.simulationStateSet, dead.uid)) {
                delete MOD.state.simulationStateSet[dead.uid];
            }
        }

        return dead;
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

    // Simulation event handler.
    MOD.processSimulationEvent = function (eventType, data) {
        // Update cv terms.
        _.extend(MOD.state, {
            cvTerms: _.union(MOD.state.cvTerms, data.cvTerms)
        });

        // Parse event data.
        MOD.parseSimulation(data.simulation, data.jobHistory);

        // Update filtered simulations.
        MOD.setFilteredSimulationList();

        // Update filters.
        _.each(MOD.state.filters, function (filter) {
            if (_.indexOf(filter.cvTerms.active, data.simulation[filter.key]) === -1) {
                filter.cvTerms.active.push(data.simulation[filter.key]);
                MOD.events.trigger("ui:filter:refresh", filter);
            }
        });

        // Update paging.
        MOD.setPagingState(MOD.state.paging.current);

        // Fire events.
        MOD.triggerSimulationFilterEvent();
        MOD.events.trigger("state:" + eventType, data);
    };

    // Job event handler.
    MOD.processJobEvent = function (eventType, data) {
        // Set matching simulation.
        data.simulation = MOD.state.simulationSet[data.job.simulationUID];
        if (_.isUndefined(data.simulation)) {
            return;
        }

        // Parse job.
        MOD.parseJob(data.job);

        // Update simulation jobs.
        data.simulation.ext.jobs = _.filter(data.simulation.ext.jobs, function (job) {
            return job.jobUID !== data.job.jobUID;
        });
        data.simulation.ext.jobs.push(data.job);

        // Parse simulation jobs.
        MOD.parseSimulationJobs(data.simulation, false);

        // Fire events.
        MOD.events.trigger("state:" + eventType, data);
    };
}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
