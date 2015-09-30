(function (APP, MOD, _, $) {

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

        // Simulation.
        simulation: undefined,

        // Simulation job history.
        jobHistory: []
    };

    // Module initialisation event handler.
    MOD.events.on("module:initialization", function () {
        MOD.title = "Simulation Details";
        MOD.events.trigger("ws:initialized");
    });

    // APP.events.trigger("module:initialized", MOD);
}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.$
));
