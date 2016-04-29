(function (APP, MOD, _, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var hasURLParams;

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
                cookieKey: 'timeslice',
                cvType: 'simulation_timeslice',
                defaultValue: "1W",
                displayName: 'Start Date',
                isCustom: true,
                key: 'timeslice',
                supportsByAll: true
            },
            {
                cookieKey: 'activity',
                cvType: 'activity',
                defaultValue: "ipsl",
                displayName: 'Activity',
                forcedValue: 'ipsl',
                isCustom: false,
                key: 'activity',
                supportsByAll: false
            },
            {
                cookieKey: 'machine',
                cvType: 'compute_node_machine',
                defaultValue: "*",
                displayName: 'Machine',
                isCustom: false,
                key: 'computeNodeMachine',
                supportsByAll: true
            },
            {
                cookieKey: 'accounting-project',
                cvType: 'accounting_project',
                defaultValue: "*",
                displayName: 'Acc. Project',
                isCustom: false,
                key: 'accountingProject',
                supportsByAll: true
            },
            {
                cookieKey: 'login',
                cvType: 'compute_node_login',
                defaultValue: "*",
                displayName: 'Login',
                isCustom: false,
                key: 'computeNodeLogin',
                supportsByAll: true
            },
            {
                cookieKey: 'model',
                cvType: 'model',
                defaultValue: "*",
                displayName: 'Tag / Model',
                isCustom: false,
                key: 'model',
                supportsByAll: true
            },
            {
                cookieKey: 'experiment',
                cvType: 'experiment',
                defaultValue: "*",
                displayName: 'Experiment',
                isCustom: false,
                key: 'experiment',
                supportsByAll: true
            },
            {
                cookieKey: 'space',
                cvType: 'simulation_space',
                defaultValue: "*",
                displayName: 'Space',
                isCustom: false,
                key: 'space',
                supportsByAll: true
            },
            {
                cookieKey: 'state',
                cvType: 'simulation_state',
                defaultValue: "*",
                displayName: 'State',
                isCustom: false,
                key: 'executionState',
                supportsByAll: true
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
        },

        // Column of grid to act as sort target.
        sorting: {
            allFields: ['name', 'computeNodeMachine', 'accountingProject', 'computeNodeLogin', 'model', 'space', 'experiment', 'executionStartDate', 'executionEndDate'],
            field: 'executionStartDate',
            direction: 'desc'
        }
    };

    // Set filter defaults.
    hasURLParams = false;
    _.each(MOD.state.filters, function (filter) {
        _.defaults(filter, {
            cvTerms: {
                all: [],
                current: undefined
            },
            cookieValue: cookies.get('simulation-monitoring-filter-' + (filter.cookieKey || filter.key)),
            urlValue: APP.utils.getURLParam(filter.cookieKey || filter.key)
        });
        if (filter.urlValue) {
            hasURLParams = true;
        }
    });

    // Set filter initial value.
    _.each(MOD.state.filters, function (filter) {
        if (hasURLParams) {
            filter.initialValue = filter.urlValue || filter.defaultValue;
        } else {
            filter.initialValue = filter.cookieValue;
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
