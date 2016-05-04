(function (APP, _, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var hasURLParams;

    // Module state.
    APP.state = {
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

        // Sorting related state.
        sorting: {
            field: cookies.get('simulation-monitoring-sort-field'),
            direction: cookies.get('simulation-monitoring-sort-direction')
        }
    };

    // Override state pulled from url parameters.
    if (APP.utils.getURLParam("sortField")) {
        APP.state.sorting.field = APP.utils.getURLParam("sortField");
    }
    if (APP.utils.getURLParam("sortDirection")) {
        APP.state.sorting.direction = APP.utils.getURLParam("sortDirection");
    }

    // Set filter defaults.
    hasURLParams = false;
    _.each(APP.state.filters, function (filter) {
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
    _.each(APP.state.filters, function (filter) {
        if (hasURLParams) {
            filter.initialValue = filter.urlValue || filter.defaultValue;
        } else {
            filter.initialValue = filter.cookieValue;
        }
    });

    // Set filter map.
    APP.state.filterSet = _.indexBy(APP.state.filters, 'cvType');
}(
    this.APP,
    this._,
    this.Cookies
));
