(function (APP, MOD, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialise state backed by cookies.
    if (_.isUndefined(cookies.get('simulation-detail-page-size'))) {
        cookies.set('simulation-detail-page-size', 25);
    }

    // Module state.
    MOD.state = {
        // Application pointer.
        APP: APP,

        // Module pointer.
        MOD: MOD,

        // Copyright year.
        year: new Date().getFullYear(),

        // Simulation configuration card.
        configCard: undefined,

        // CV terms.
        cvTerms: [],

        // Timestamp of most recent web-socket event.
        eventTimestamp: null,

        // Description of most recent web-socket event.
        eventTypeDescription: null,

        // Simulation try identifier.
        simulationUID: APP.utils.getURLParam('uid'),

        // Simulation.
        simulation: undefined,

        // Set of previous tries.
        previousTries: {},

        // Has associated messages.
        hasMessages: false,

        // Size of grid pages.
        pageSize: cookies.get('simulation-detail-page-size'),

        // Set of grid page size options.
        pageSizeOptions: [25, 50, 100],

        // Returns job history collection by job type.
        getJobs: function (jobType) {
            switch (jobType) {
            case "computing":
                return MOD.state.simulation.jobs.compute;
            case "post-processing":
                return MOD.state.simulation.jobs.postProcessing;
            case "post-processing-from-checker":
                return MOD.state.simulation.jobs.postProcessingFromChecker;
            default:
                return [];
            }
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this.Cookies
));
