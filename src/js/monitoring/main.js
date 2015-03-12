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
        version : "0.2.0",

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
                'ccrt': 'https://esgf.extra.cea.fr/thredds/fileServer/WORK',
                'tgcc': 'https://esgf.extra.cea.fr/thredds/fileServer/WORK'
            },

            // Inter-monitoring endpoints.
            IM: {
                'httpPostTarget': 'http://webservices.ipsl.jussieu.fr/monitoring_fromprodiguer/index.php',
                'ccrt': 'http://esgf.extra.cea.fr/thredds/dodsC/WORK',
                'tgcc': 'http://esgf.extra.cea.fr/thredds/dodsC/WORK'
            }
        },

        // Map of simulation states to css classes.
        statesCSS : {
            "queued" : 'info',
            "running" : 'primary',
            "suspended" : 'warning',
            "complete" : 'success',
            "rollback" : 'warning',
            "error" : 'danger',
        }
    });

}(
    this.APP
));
