(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var hasURLParams, key;

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
                globalFilterPosition: 'last'
            },
            {
                cookieKey: 'accounting-project',
                cvType: 'accounting_project',
                defaultValue: "*",
                displayName: 'Acc. Project',
                key: 'accountingProject'
            },
            {
                cookieKey: 'machine',
                cvType: 'compute_node_machine',
                defaultValue: "*",
                displayName: 'Machine',
                key: 'computeNodeMachine'
            },
            {
                cookieKey: 'login',
                cvType: 'compute_node_login',
                defaultValue: "*",
                displayName: 'Login',
                key: 'computeNodeLogin'
            },
            {
                cookieKey: 'model',
                cvType: 'model',
                defaultValue: "*",
                displayName: 'Tag / Model',
                key: 'model'
            },
            {
                cookieKey: 'experiment',
                cvType: 'experiment',
                defaultValue: "*",
                displayName: 'Experiment',
                key: 'experiment'
            },
            {
                cookieKey: 'space',
                cvType: 'simulation_space',
                defaultValue: "*",
                displayName: 'Space',
                key: 'space'
            },
            {
                cookieKey: 'state',
                cvType: 'simulation_state',
                defaultValue: "*",
                displayName: 'State',
                key: 'executionState'
            }
        ],

        // Current text filter value.
        textFilter: undefined,

        // Job counts grouped by simulation, job type, job state.
        jobCounts: [],

        // Latest compute jobs.
        latestComputeJobs: [],

        // Current simulation being processed.
        simulation: null,

        // List of simulations being processed.
        simulationList: [],

        // List of filtered simulations.
        simulationListFiltered: [],

        // List of simulations selected for inter-monitoring.
        simulationListForIM: [],

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
        sorting : {
            directions: [
                {
                    cookieKey: 'asc',
                    displayName: 'Asc',
                    key: 'asc'
                },
                {
                    cookieKey: 'desc',
                    displayName: 'Desc',
                    key: 'desc'
                }
            ],
            fields: [
                {
                    cookieKey: 'accounting-project',
                    displayName: 'Acc. Project',
                    key: 'accountingProject'
                },
                {
                    cookieKey: 'name',
                    displayName: 'Name',
                    key: 'name'
                },
                {
                    cookieKey: 'machine',
                    displayName: 'Machine',
                    key: 'computeNodeMachine'
                },
                {
                    cookieKey: 'login',
                    displayName: 'Login',
                    key: 'computeNodeLogin'
                },
                {
                    cookieKey: 'model',
                    displayName: 'Tag / Model',
                    key: 'model'
                },
                {
                    cookieKey: 'experiment',
                    displayName: 'Experiment',
                    key: 'experiment'
                },
                {
                    cookieKey: 'space',
                    displayName: 'Space',
                    key: 'space'
                },
                {
                    cookieKey: 'execution-start-date',
                    displayName: 'Start Date',
                    key: 'executionStartDate'
                }
            ],
            field: APP.utils.getURLParam("sortField") || MOD.getCookie('sort-field'),
            direction: APP.utils.getURLParam("sortDirection") || MOD.getCookie('sort-direction')
        },
    };

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
            $view: undefined,
            globalFilterPosition: "first"
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

    // Set sort initial value.
    MOD.state.sorting.field = _.find(MOD.state.sorting.fields, function (i) {
        return i.key === MOD.state.sorting.field;
    });
    MOD.state.sorting.direction = _.find(MOD.state.sorting.directions, function (i) {
        return i.key === MOD.state.sorting.direction;
    });

    // Set filter map.
    MOD.state.filterSet = _.indexBy(MOD.state.filters, 'cvType');
}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
