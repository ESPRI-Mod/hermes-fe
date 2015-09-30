(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    MOD.state = {
        // Application pointer.
        APP: APP,

        // Module pointer.
        MOD: MOD,

        // Copyright year.
        year: new Date().getFullYear(),

        // CV terms.
        cvTerms: [],

        // Filters.
        filters: [
            {
                key: 'activity',
                defaultValue: 'ipsl',
                supportsByAll: false
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
                key: 'model',
                displayName: 'Tag / Model'
            },
            {
                key: 'experiment'
            },
            {
                cvType: 'simulation_space',
                key: 'space',
                displayName: 'Space'
            },
            {
                cvType: 'simulation_state',
                key: 'executionState',
                displayName: 'State'
            }
        ],

        filterName: undefined,

        // Timeslaice filter value.
        filterTimeSlice: "ALL",

        // Current simulation being processed.
        simulation: null,

        // List of simulations being processed.
        simulationList: [],

        // List of filtered simulations.
        simulationListFiltered: [],

        // Map of simulation uid's to simulations.
        simulationSet: {},

        // Paging related state.
        paging: {
            current: undefined,
            count: undefined,
            pages: []
        },

        // Set of grid row views.
        gridRowViews: []
    };

    // Set filter defaults.
    _.each(MOD.state.filters, function (filter) {
        var queryParamValue;

        MOD.state[filter.key + "Filter"] = filter;
        filter.cvTerms = {
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

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
