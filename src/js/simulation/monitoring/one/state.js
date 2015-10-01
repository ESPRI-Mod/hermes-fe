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

        // Simulation hash identifier.
        simulationHashID: APP.utils.getURLParam('hashid'),

        // Simulation try identifier.
        simulationTryID: APP.utils.getURLParam('tryID'),

        // Simulation try identifier.
        simulationUID: APP.utils.getURLParam('uid'),

        // Simulation.
        simulation: undefined,

        // Simulation job history.
        jobHistory: []
    };

}(
    this.APP,
    this.APP.modules.monitoring
));
