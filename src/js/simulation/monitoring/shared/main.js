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
        jobTypeCaptions: {
            "computing": "Compute",
            "post-processing": "Post Processing",
            "post-processing-from-checker": "Post Processing (from checker)"
        },

        // Set of job types.
        jobTypes: [
            "computing",
            "post-processing",
            "post-processing-from-checker"
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
            // timeslice: "1W"
            timeslice: "3M"
        },

        // URL's used across modules.
        urls: {
            // Fetch CV data endpoint.
            FETCH_CV: 'cv/fetch',

            // Fetch monitoring time slice endpoint.
            FETCH_TIMESLICE: 'simulation/monitoring/fetch_timeslice?timeslice={timeslice}',

            // Fetch monitoring one simulation endpoint.
            FETCH_ONE: 'simulation/monitoring/fetch_one?hashid={hashid}&tryID={tryID}',

            // Simulation detail page.
            SIMULATION_DETAIL_PAGE: 'simulation.monitoring.one.html?hashid={hashid}&tryID={tryID}&uid={uid}',

            // Simulation message page.
            SIMULATION_MESSAGES_PAGE: 'messages.html?simulationUID={uid}',

            // Web-socket endpoint.
            WS_ALL: 'simulation/monitoring/ws/all',

            // Web-socket endpoint.
            WS_ONE: 'simulation/monitoring/ws/one?uid={uid}',

            // Monitoring endpoints.
            M: {
                'ccrt': 'https://esgf.extra.cea.fr/thredds/fileServer/work',
                'idris': 'http://prodn.idris.fr/thredds/fileServer/ipsl_public',
                'ipsl': 'http://esgf-local.ipsl.fr/thredds/fileServer/ipsl_public',
                'tgcc': 'https://esgf.extra.cea.fr/thredds/fileServer/work'
            },

            // Inter-monitoring endpoints.
            IM: {
                'httpPostTarget': 'http://webservices.ipsl.jussieu.fr/monitoring_fromprodiguer/index.php',
                'ccrt': 'http://esgf.extra.cea.fr/thredds/dodsC/work',
                'idris': 'http://prodn.idris.fr/thredds/dodsC/ipsl_public',
                'ipsl': 'http://esgf-local.ipsl.fr/thredds/dodsC/ipsl_public',
                'tgcc': 'http://esgf.extra.cea.fr/thredds/dodsC/work'
            }
        },

        // Returns description of a simulation related event.
        getEventDescription: function (ei) {
            switch (ei.eventType) {
            case 'simulationComplete':
                return "SIMULATION COMPLETED";
            case 'simulationError':
                return "SIMULATION ERROR";
            case 'simulationStart':
                if (ei.simulation.ext.isRestart) {
                    return "SIMULATION STARTED";
                }
                return "SIMULATION RESTARTED";
            case 'jobComplete':
                return "JOB COMPLETED";
            case 'jobError':
                return "JOB ERROR";
            case 'jobStart':
                return "JOB STARTED";
            default:
                break;
            }
        }
    });
}(
    this.APP
));
