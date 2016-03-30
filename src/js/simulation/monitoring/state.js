(function (APP, MOD, _, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialise state backed by cookies.
    cookies.set('simulation-monitoring-page-size',
                cookies.get('simulation-monitoring-page-size') || 25);

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
                cvType: 'simulation_timeslice',
                defaultValue: '1W',
                key: 'timeslice',
                displayName: 'Start Date',
                isCustom: true
            },
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
                key: 'accounting_project',
                displayName: 'Acc. Project',
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

        // Current simulation being processed.
        simulation: null,

        // List of simulations being processed.
        simulationList: [],

        // List of filtered simulations.
        simulationListFiltered: [],

        // Map of simulation uid's to simulations.
        simulationSet: {},

        // Map of simulation hash id's to simulations.
        simulationHashSet: {},

        // Size of grid pages.
        pageSize: cookies.get('simulation-monitoring-page-size'),

        // Set of grid page size options.
        pageSizeOptions: [25, 50, 100],

        // Paging related state.
        paging: {
            current: undefined,
            count: undefined,
            pages: []
        }
    };

    // Set filter defaults.
    _.each(MOD.state.filters, function (filter) {
        var queryParamValue;

        _.defaults(filter, {
            cvTerms: {
                all: [],
                current: undefined
            },
            cvType: filter.key,
            defaultValue: null,
            displayName: filter.key.substring(0, 1).toUpperCase() + filter.key.substring(1),
            isCustom: false,
            supportsByAll: true
        });
        queryParamValue = APP.utils.getURLParam(filter.key);
        if (queryParamValue) {
            filter.defaultValue = queryParamValue;
        }
    });

    // Set filter map.
    MOD.state.filterSet = _.indexBy(MOD.state.filters, 'cvType');

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.Cookies
));
