(function (APP, MOD, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Controlled vocabularies loaded event handler.
    // @data     Data loaded from remote server.
    MOD.events.on("setup:cvDataLoaded", function (data) {
        var ep;

        // Update module state.
        MOD.state.cvTerms = APP.utils.parseCVTerms(data.cvTerms);

        // Load page data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH_ONE);
        ep = ep.replace("{hashid}", MOD.state.simulationHashID);
        ep = ep.replace("{tryID}", MOD.state.simulationTryID);
        $.getJSON(ep, function (data) {
            MOD.log("page data fetched");
            MOD.events.trigger("setup:pageDataDownloaded", data);
        });
    });

    // Event handler: page data downloaded.
    MOD.events.on("setup:pageDataDownloaded", function (ei) {
        // Parse data.
        MOD.parseSimulation(ei.simulation, ei.jobList);

        // Update module state.
        MOD.state.simulation = ei.simulation;
        MOD.state.messageCount = ei.messageCount;
        MOD.state.configCard = ei.configCard;

        // Fire event.
        MOD.events.trigger("setup:complete", this);
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.$
));
