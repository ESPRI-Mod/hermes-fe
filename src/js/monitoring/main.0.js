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
            WS: 'monitoring/fe/ws'
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
        ],

        // Parses a simulation in readiness for processing.
        parseSimulation: function (simulation) {
            _.each(['experiment'], function (field) {
                var term;

                term = _.find(MOD.state.cvTerms[field], function (t) {
                    return t.meta.name === simulation[field];
                });
                simulation[field] = term ? term.name : simulation[field];
            });
            simulation.executionEndDate = simulation.executionEndDate || "";
        }
    });

    // Set filter defaults.
    _.each(MOD.filters, function (filter) {
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
    });

}(this.APP, this._));
