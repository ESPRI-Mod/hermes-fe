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
        version : "0.3.0",

        // Module key aliases.
        keyAliases: ["monitor"],

        // URL's used across module.
        urls: {
            // Setup data endpoint.
            SETUP: 'monitoring/fe/setup',

            // Web-socket endpoint.
            WS: 'monitoring/fe/ws',

            // Monitoring endpoints.
            M: {
                'ccrt': 'https://esgf.extra.cea.fr/thredds/fileServer/work',
                'tgcc': 'https://esgf.extra.cea.fr/thredds/fileServer/work'
            },

            // Inter-monitoring endpoints.
            IM: {
                'httpPostTarget': 'http://webservices.ipsl.jussieu.fr/monitoring_fromprodiguer/index.php',
                'ccrt': 'http://esgf.extra.cea.fr/thredds/dodsC/work',
                'tgcc': 'http://esgf.extra.cea.fr/thredds/dodsC/work'
            }
        },

        // Map of simulation states to css classes.
        statesCSS : {
            "queued" : 'monitoring-state-queued',
            "running" : 'monitoring-state-running',
            "complete" : 'monitoring-state-complete',
            "error" : 'monitoring-state-error',
        }
    });

}(
    this.APP
));
