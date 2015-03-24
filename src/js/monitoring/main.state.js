(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    MOD.state = {
        // CV terms.
        cvTerms: [],

        // Filters.
        filters: [
            {
                key: 'activity',
                defaultValue: 'ipsl'
            },
            {
                cvType: 'compute_node',
                key: 'computeNode',
                displayName: 'Node'
            },
            {
                cvType: 'compute_node_machine',
                key: 'computeNodeMachine',
                displayName: 'Machine'
            },
            {
                cvType: 'compute_node_login',
                key: 'computeNodeLogin',
                displayName: 'Login'
            },
            {
                key: 'experiment'
            },
            {
                key: 'model',
                displayName: 'Tag / Model'
            },
            {
                cvType: 'simulation_state',
                key: 'executionState',
                displayName: 'State'
            },
            {
                cvType: 'simulation_space',
                key: 'space',
                displayName: 'Space'
            },
        ],

        // List of simulations.
        simulationList: [],

        // List of filtered simulations.
        simulationListFiltered: [],

        // Hostory of simulation state changes.
        simulationStateHistory: {},

        // Paging related state.
        paging: {
            current: undefined,
            count: undefined,
            previous: undefined,
            pages: []
        }
    };

    // Set filter defaults.
    _.each(MOD.state.filters, function (filter) {
        var queryParamValue;

        filter.cvTerms = {
            active: [],
            all: [],
            current: undefined
        };
        if (!_.has(filter, "supportsByAll")) {
            filter.supportsByAll = true;
        }
        if (!_.has(filter, "defaultValue")) {
            filter.defaultValue = undefined;
        }
        if (!_.has(filter, "cvType")) {
            filter.cvType = filter.key;
        }
        if (!_.has(filter, "displayName")) {
            filter.displayName = filter.key.substring(0, 1).toUpperCase() +
                                 filter.key.substring(1);
        }
        queryParamValue = APP.utils.getURLParam(filter.key);
        if (queryParamValue) {
            filter.defaultValue = queryParamValue;
        }
    });

}(this.APP.modules.monitoring, this._));
