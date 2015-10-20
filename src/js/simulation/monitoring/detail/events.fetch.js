(function (APP, MOD, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var
        // Returns a mapped job.
        mapJob = function (i) {
            return {
                accountingProject: i[0],
                executionEndDate: i[1],
                executionStartDate: i[2],
                isError: i[3],
                isComputeEnd: i[4],
                isComputeStartup: i[5],
                jobUID: i[6],
                postProcessingComponent: i[7],
                postProcessingDate: i[8],
                postProcessingDimension: i[9],
                postProcessingFile: i[10],
                postProcessingName: i[11],
                simulationUID: i[12],
                schedulerID: i[13],
                submissionPath: i[14],
                typeof: i[15],
                warningDelay: i[16]
            };
        };

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
        // Map tuples to JSON objects.
        ei.jobList = _.map(ei.jobList, mapJob);

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
