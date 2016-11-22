(function (APP, MOD, _) {

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

        // Select filters.
        filters: [
            {
                cookieKey: 'timeslice',
                cvType: 'simulation_timeslice',
                defaultValue: "1W",
                displayName: 'Start Date',
                key: 'timeslice',
                supportsByAll: true
            },
            {
                cookieKey: 'accounting-project',
                cvType: 'accounting_project',
                defaultValue: "*",
                displayName: 'Acc. Project',
                key: 'accountingProject',
                supportsByAll: true
            },
            {
                cookieKey: 'machine',
                cvType: 'compute_node_machine',
                defaultValue: "*",
                displayName: 'Machine',
                key: 'computeNodeMachine',
                supportsByAll: true
            },
            {
                cookieKey: 'login',
                cvType: 'compute_node_login',
                defaultValue: "*",
                displayName: 'Login',
                key: 'computeNodeLogin',
                supportsByAll: true
            },
            {
                cookieKey: 'model',
                cvType: 'model',
                defaultValue: "*",
                displayName: 'Tag / Model',
                key: 'model',
                supportsByAll: true
            },
            {
                cookieKey: 'experiment',
                cvType: 'experiment',
                defaultValue: "*",
                displayName: 'Experiment',
                key: 'experiment',
                supportsByAll: true
            },
            {
                cookieKey: 'space',
                cvType: 'simulation_space',
                defaultValue: "*",
                displayName: 'Space',
                key: 'space',
                supportsByAll: true
            },
            {
                cookieKey: 'state',
                cvType: 'simulation_state',
                defaultValue: "*",
                displayName: 'State',
                key: 'executionState',
                supportsByAll: true
            }
        ],

        // Current text filter value.
        textFilter: undefined,

        // Current simulation being processed.
        simulation: null,

        // List of simulations being processed.
        simulationList: [],

        // List of filtered simulations.
        simulationListFiltered: [],

        // Map of simulation id's to simulations.
        simulationSet: {},

        // Map of simulation hash id's to simulations.
        simulationHashSet: {},

        // Map of simulation uid's to simulations.
        simulationUIDSet: {},

        // Size of grid pages.
        pageSize: MOD.getCookie('page-size'),

        // Set of grid page size options.
        pageSizeOptions: [25, 50, 100],

        // Paging related state.
        paging: {
            current: undefined,
            count: undefined,
            pages: []
        },

        // Sorting related state.
        sorting: {
            allFields: ['name', 'computeNodeMachine', 'accountingProject', 'computeNodeLogin', 'model', 'space', 'experiment', 'executionStartDate', 'executionEndDate'],
            field: MOD.getCookie('sort-field'),
            direction: MOD.getCookie('sort-direction')
        }
    };

    // Override state pulled from url parameters.
    if (APP.utils.getURLParam("sortField")) {
        MOD.state.sorting.field = APP.utils.getURLParam("sortField");
    }
    if (APP.utils.getURLParam("sortDirection")) {
        MOD.state.sorting.direction = APP.utils.getURLParam("sortDirection");
    }

    // Set filter defaults.
    hasURLParams = false;
    _.each(MOD.state.filters, function (filter) {
        _.defaults(filter, {
            cvTerms: {
                active: [],
                all: [],
                current: undefined
            },
            cookieValue: MOD.getCookie('filter-' + filter.cookieKey),
            urlValue: APP.utils.getURLParam(filter.cookieKey),
            $view: undefined
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
            filter.initialValue = filter.cookieValue || filter.defaultValue;
        }
    });

    // Set filter map.
    MOD.state.filterSet = _.indexBy(MOD.state.filters, 'cvType');
}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
