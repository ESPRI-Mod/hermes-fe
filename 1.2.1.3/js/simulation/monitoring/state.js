(function (APP, MOD, STATE, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Application pointer.
    STATE.APP = APP;

    // Module pointer.
    STATE.MOD = MOD;

    // Copyright year.
    STATE.year = new Date().getFullYear();

    // CV terms.
    STATE.cvTerms = [];

    // Select filters.
    STATE.filters = [
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
    ];

    // Current text filter value.
    STATE.textFilter = undefined;

    // Job counts grouped by simulation, job type, job state.
    STATE.jobCounts = [];

    // Latest compute jobs.
    STATE.latestComputeJobs = [];

    // Current simulation being processed.
    STATE.simulation = null;

    // List of simulations being processed.
    STATE.simulationList = [];

    // List of filtered simulations.
    STATE.simulationListFiltered = [];

    // List of simulations selected for inter-monitoring.
    STATE.simulationListForIM = [];

    // List of simulations selectable for inter-monitoring.
    STATE.simulationListForIMTargets = [];

    // Map of simulation id's to simulations.
    STATE.simulationSet = {};

    // Map of simulation hash id's to simulations.
    STATE.simulationHashSet = {};

    // Map of simulation uid's to simulations.
    STATE.simulationUIDSet = {};

    // Flag indcating whether only monitored simulations are to be displayed.
    STATE.monitoredSimulationsOnly = false;

    // Size of grid pages.
    STATE.pageSize = MOD.getCookie('page-size');

    // Set of grid page size options.
    STATE.pageSizeOptions = [25, 50, 100];

    // Paging related state.
    STATE.paging = {
        current: undefined,
        count: undefined,
        pages: []
    };

    // Sorting related state.
    STATE.sorting = {
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
    };

    // Set filter defaults.
    var hasURLParams = false;
    _.each(STATE.filters, function (filter) {
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
    _.each(STATE.filters, function (filter) {
        if (hasURLParams) {
            filter.initialValue = filter.urlValue || filter.defaultValue;
        } else {
            filter.initialValue = filter.cookieValue || filter.defaultValue;
        }
    });

    // Set sort initial value.
    STATE.sorting.field = _.find(STATE.sorting.fields, function (i) {
        return i.key === STATE.sorting.field;
    });
    STATE.sorting.direction = _.find(STATE.sorting.directions, function (i) {
        return i.key === STATE.sorting.direction;
    });

    // Set filter map.
    STATE.filterSet = _.indexBy(STATE.filters, 'cvType');

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
    this._
));
