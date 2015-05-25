(function (APP) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    APP.registerModule("simulation", {
        // Module title.
        title: "Simulation Monitor",

        // Module short title.
        shortTitle: "Simulation Monitor",

        // Module key aliases.
        keyAliases: [],

        // URL's used across module.
        urls: {
            // CV setup data endpoint.
            CV: 'simulation/fe/cv',

            // Monitoring endpoints.
            M: {
                'ccrt': 'https://esgf.extra.cea.fr/thredds/fileServer/work',
                'tgcc': 'https://esgf.extra.cea.fr/thredds/fileServer/work'
            },

            // Page setup data endpoint.
            SETUP: 'simulation/fe/setup?uid={uid}',

            // Web-socket endpoint.
            WS: 'simulation/fe/ws/uid={uid}'
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
