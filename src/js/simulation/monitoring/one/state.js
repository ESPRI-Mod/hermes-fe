(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    MOD.state = {
        // Simulation configuration card.
        configCard: undefined,

        // CV terms.
        cvTerms: [],

        // Simulation hash identifier.
        simulationHashID: APP.utils.getURLParam('hashid'),

        // Simulation try identifier.
        simulationTryID: APP.utils.getURLParam('tryID'),

        // Simulation.
        simulation: undefined,

        // Simulation job history.
        jobHistory: []
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
