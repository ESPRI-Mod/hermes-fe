(function (APP, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    var MOD = APP.registerModule("monitoring", {
        // Module title.
        title: "Simulation Monitor",

        // Module short title.
        shortTitle: "Monitor",

        // Module version.
        version : "0.2.0",

        // Module key aliases.
        keyAliases: ["monitor"],

        // Monitoring relation URLs.
        urls: {
            SETUP: 'monitoring/fe/setup',
            WS: 'monitoring/fe/ws',
            IM: "http://webservices.ipsl.jussieu.fr/monitoring_fromprodiguer/index.php"
        },

        // Map of simulation states to css classes.
        statesCSS : {
            "queued" : 'info',
            "running" : 'info',
            "suspended" : 'warning',
            "complete" : 'success',
            "rollback" : 'warning',
            "error" : 'danger',
        },

        // Set of supported filters.
        filters: [
            {
                key: 'activity',
                defaultValue: 'ipsl'
            },
            {
                key: 'computeNode',
                displayName: 'Node'
            },
            {
                key: 'computeNodeMachine',
                displayName: 'Machine'
            },
            {
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
                cvType: 'simulationState',
                key: 'executionState',
                displayName: 'State'
            },
            {
                cvType: 'simulationSpace',
                key: 'space',
                displayName: 'Space'
            },
        ]
    });

    // Set filter defaults.
    _.each(MOD.filters, function (filter) {
        var queryParamValue;

        if (!_.has(filter, "cvType")) {
            filter.cvType = filter.key;
        }
        if (!_.has(filter, "displayName")) {
            filter.displayName = filter.key.substring(0, 1).toUpperCase() +
                                 filter.key.substring(1);
        }
        if (!_.contains(['experiment', 'computeNodeLogin'], filter.key)) {
            filter.displayFormatter = "toUpperCase";
        }
        queryParamValue = APP.utils.getURLParam(filter.key);
        if (queryParamValue) {
            filter.defaultValue = queryParamValue;
        }
    });

}(this.APP, this._));
