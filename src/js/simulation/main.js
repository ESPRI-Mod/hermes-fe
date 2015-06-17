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

        // Map of job states to css classes.
        jobStatesCSS : {
            "running" : 'job-state-running',
            "complete" : 'job-state-complete',
            "error" : 'job-state-error',
        },

        // Set of supported job state types.
        jobStates: ["running", "complete", "error"]
    });

}(
    this.APP
));
