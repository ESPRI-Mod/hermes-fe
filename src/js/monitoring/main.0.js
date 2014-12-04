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
                cvType: 'activity',
                typeName: 'activity',
                displayName: 'Activity'
            },
            {
                cvType: 'compute_node',
                typeName: 'computeNode',
                displayName: 'Node'
            },
            {
                cvType: 'compute_node_machine',
                typeName: 'computeNodeMachine',
                displayName: 'Machine'
            },
            {
                cvType: 'compute_node_login',
                typeName: 'computeNodeLogin',
                displayName: 'Login',
            },
            {
                cvType: 'experiment',
                typeName: 'experiment',
                displayName: 'Experiment'
            },
            {
                cvType: 'model',
                typeName: 'model',
                displayName: 'Tag / Model'
            },
            {
                cvType: 'simulation_state',
                typeName: 'executionState',
                displayName: 'State'
            },
            {
                cvType: 'simulation_space',
                typeName: 'space',
                displayName: 'Space'
            },
        ]
    });

}(this.APP));
