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

        // Map of job types to captions.
        jobTypeDescriptions: {
            "c": "Compute",
            "p": "Post Processing"
        },

        // Set of job types.
        jobTypes: [
            "c",
            "p"
        ],

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
        },

        // Default used across modules.
        defaults: {
            // Delay in seconds before a job is considered to be dead / delayed.
            jobWarningDelay: 86400,

            // Simulation filter timeslice.
            timeslice: "1W"
        },

        // URL's used across modules.
        urls: {
            // Fetch CV data endpoint.
            FETCH_CV: 'cv/fetch',

            // Fetch monitoring time slice endpoint.
            FETCH_TIMESLICE: 'simulation/monitoring/fetch_timeslice?timeslice={timeslice}',

            // Fetch monitoring detail simulation endpoint.
            FETCH_DETAIL: 'simulation/monitoring/fetch_detail?uid={uid}',

            // Simulation monitoring page.
            SIMULATION_MONITORING_PAGE: 'simulation.monitoring.html',

            // Simulation detail page.
            SIMULATION_DETAIL_PAGE: 'simulation.detail.html?uid={uid}',

            // Simulation message page.
            SIMULATION_MESSAGES_PAGE: 'simulation.messages.html?uid={uid}',

            // Web-socket endpoint.
            WS_ALL: 'simulation/monitoring/ws/all',

            // Web-socket endpoint.
            WS_ONE: 'simulation/monitoring/ws/one?uid={uid}',

            // Monitoring endpoints.
            M: {
                'idris': 'http://prodn.idris.fr/thredds/fileServer/ipsl_public',
                'ccrt': 'https://vesg.ipsl.upmc.fr/thredds/fileServer/work',
                'ipsl': 'https://vesg.ipsl.upmc.fr/thredds/fileServer/work',
                'tgcc': 'https://vesg.ipsl.upmc.fr/thredds/fileServer/work'
            },

            // Inter-monitoring endpoints.
            IM: {
                'httpPostTarget': 'http://webservices2017.ipsl.fr/interMonitoring_fromHermes/index.php',
                'idris': 'http://prodn.idris.fr/thredds/catalog/ipsl_public',
                'ccrt': 'https://vesg.ipsl.upmc.fr/thredds/catalog/work',
                'ipsl': 'https://vesg.ipsl.upmc.fr/thredds/catalog/work',
                'tgcc': 'https://vesg.ipsl.upmc.fr/thredds/catalog/work'
            }
        }
    });

}(
    this.APP
));

// https://vesg.ipsl.upmc.fr/thredds/fileServer/work_thredds/p86caub/IPSLCM6/DEVT/pdControl/CM6010.2-LR-pdCtrl-02/MONITORING/index.html
