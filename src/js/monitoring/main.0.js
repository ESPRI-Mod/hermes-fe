(function (APP) {

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
        }
    });

}(this.APP));
