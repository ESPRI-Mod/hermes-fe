(function (APP, MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

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

        eventTimestamp: null,

        eventTypeDescription: null,

        // Simulation hash identifier.
        simulationHashID: APP.utils.getURLParam('hashid'),

        // Simulation try identifier.
        simulationTryID: APP.utils.getURLParam('tryID'),

        // Simulation try identifier.
        simulationUID: APP.utils.getURLParam('uid'),

        // Simulation.
        simulation: undefined,

        // Job list.
        jobList: [],

        // Message count.
        messageCount: 0,

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
    this.APP.modules.monitoring
));
