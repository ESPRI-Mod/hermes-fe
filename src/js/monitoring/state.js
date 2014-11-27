// --------------------------------------------------------
// momitoring/state.js
// Manages module level state.
// --------------------------------------------------------
(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    MOD.state = {
        // Current activity.
        activity: undefined,

        // List of activities.
        activityList: [],

        // Current compute node.
        computeNode: undefined,

        // List of compute nodes.
        computeNodeList: [],

        // Current compute node login.
        computeNodeLogin: undefined,

        // List of compute node logins.
        computeNodeLoginList: [],

        // Current compute node machine.
        computeNodeMachine: undefined,

        // List of compute node machines.
        computeNodeMachineList: [],

        // Current experiment.
        experiment: undefined,

        // List of experiments.
        experimentList: [],

        // Current model.
        model: undefined,

        // List of models.
        modelList: [],

        // List of simulations.
        simulationList: [],

        // List of filtered simulations.
        simulationListFiltered: [],

        // Current execution state.
        executionState: undefined,

        // List of execution states.
        executionStateList: [],

        // Current space.
        space: undefined,

        // List of spaces.
        spaceList: [],

        // Paging related state.
        paging : {
            current : undefined,
            count : undefined,
            previous : undefined,
            pages : []
        }
    };

    // Sets collection of filtered simulations.
    MOD.state.setFilteredSimulationList = function () {
        var filtered, state = MOD.state;

        // Set filtered simulations.
        filtered = state.simulationList;
        _.each(MOD.filters, function (f) {
            if (state[f.typeName].id > 0) {
                filtered = _.filter(filtered, function (s) {
                    return s[f.typeName + "ID"] === state[f.typeName].id;
                });
            }
        });

        // Sort.
        filtered = _.sortBy(filtered, function (s) {
            return s.activity + s.name;
        });

        // Update state.
        state.simulationListFiltered = filtered;
    };

    // Sets the paging state.
    MOD.state.setPagingState = function (currentPage) {
        var pages, page, state = MOD.state;

        // Reset pages.
        pages = APP.utils.getPages(state.simulationListFiltered);
        state.paging.pages = pages;
        state.paging.count = pages.length;
        state.paging.current = state.paging.count ? pages[0] : undefined;
        state.paging.previous = undefined;

        // Ensure current page is respected.
        if (currentPage) {
            page = _.find(pages, function (p) {
                return _.indexOf(p.data, currentPage.data[0]) !== -1;
            });
            if (page) {
                state.paging.current = page;
            }
        }
    };

}(this.APP, this.APP.modules.monitoring, this._));
