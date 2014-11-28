(function (APP) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    APP.registerModule("monitoring", {
        // Module title.
        title: "Simulation Monitor",

        // Module short title.
        shortTitle: "Monitor",

        // Module version.
        version : "0.1.0",

        // Module key aliases.
        keyAliases: ["monitor"],

        // Monitoring relation URLs.
        urls: {
            MONITORING_SETUP: 'monitoring/fe/setup',
            MONITORING_WS: 'monitoring/fe/ws'
        },

        // Map of simulation states to css classes.
        statesCSS : {
            "QUEUED" : 'info',
            "RUNNING" : 'info',
            "SUSPENDED" : 'warning',
            "COMPLETE" : 'success',
            "ROLLBACK" : 'warning',
            "ERROR" : 'danger',
        },

        // Set of supported filters.
        filters: [
            {
                typeName: 'activity',
                displayName: 'Activity'
            },
            {
                typeName: 'computeNode',
                displayName: 'Node'
            },
            {
                typeName: 'computeNodeMachine',
                displayName: 'Machine'
            },
            {
                typeName: 'computeNodeLogin',
                displayName: 'Login',
            },
            {
                typeName: 'experiment',
                displayName: 'Experiment'
            },
            {
                typeName: 'model',
                displayName: 'Tag / Model'
            },
            {
                typeName: 'executionState',
                displayName: 'State'
            },
            {
                typeName: 'space',
                displayName: 'Space'
            },
        ]
    });

}(this.APP));
