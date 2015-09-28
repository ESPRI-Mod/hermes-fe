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

    // Event handler: CV data downloaded.
    MOD.events.on("setup:cvDataDownloaded", function (data) {
        var ep;

        // Cache CV terms.
        _.extend(MOD.state, {
            cvTerms: data.cvTerms
        });

        // Load page data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH_ONE);
        ep = ep.replace("{hashid}", MOD.state.simulationHashID);
        ep = ep.replace("{tryID}", MOD.state.simulationTryID);
        $.getJSON(ep, function (data) {
            MOD.events.trigger("setup:pageDataDownloaded", data);
        });
    });

    // Event handler: page data downloaded.
    MOD.events.on("setup:pageDataDownloaded", function (data) {
        // Parse event data.
        MOD.parseSimulation(data.simulation, data.jobHistory);

        // Update module state.
        MOD.state.simulation = data.simulation;
        MOD.state.jobHistory = data.simulation.jobs.global.all;
        MOD.state.configCard = data.configCard;

        // Fire event.
        MOD.events.trigger("setup:complete", this);
    });

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
