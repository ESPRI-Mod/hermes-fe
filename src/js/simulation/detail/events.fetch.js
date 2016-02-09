(function (APP, MOD, window, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Controlled vocabularies loaded event handler.
    // @data     Data loaded from remote server.
    MOD.events.on("setup:cvDataLoaded", function (data) {
        var ep;

        // Update module state.
        MOD.state.cvTerms = APP.utils.parseCVTerms(data.cvTerms);

        // Load page data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH_DETAIL);
        ep = ep.replace("{hashid}", MOD.state.simulationHashID);
        ep = ep.replace("{tryID}", MOD.state.simulationTryID);
        $.getJSON(ep, function (data) {
            MOD.log("page data fetched");
            MOD.events.trigger("setup:pageDataDownloaded", data);
        });
    });

    // Event handler: page data downloaded.
    MOD.events.on("setup:pageDataDownloaded", function (data) {
        // Map tuples to JSON objects.
        data.jobList = _.map(data.jobList, MOD.mapJob);

        // Parse data.
        MOD.parseSimulation(data.simulation, data.jobList);

        // Update module state.
        MOD.state.simulation = data.simulation;
        MOD.state.hasMessages = data.hasMessages;
        MOD.state.configCard = data.configCard ? window.atob(data.configCard) : null;

        // Fire event.
        MOD.events.trigger("setup:complete", this);
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.window,
    this._,
    this.$
));
