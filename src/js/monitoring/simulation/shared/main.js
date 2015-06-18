(function (APP) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    APP.registerModule("monitoring", {
        // Module title.
        title: "Simulation Monitoring",

        // Module short title.
        shortTitle: "Monitoring",

        // Module key aliases.
        keyAliases: [],

        // Map of execution states to css classes.
        statesCSS : {
            "queued" : 'monitoring-state-queued',
            "running" : 'monitoring-state-running',
            "complete" : 'monitoring-state-complete',
            "error" : 'monitoring-state-error',
        },

        // Case insensitive state CSS lookup.
        getStateCSS: function (state) {
            return APP.modules.monitoring.statesCSS[state.toLowerCase()];
        }
    });
}(
    this.APP
));
