(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Setup event handler.
    // @data    Page setup data loaded from remote server.
    MOD.events.on("setup:pageDataDownloaded", function (data) {
        // Parse event data.
        MOD.parseSimulations(data.simulation, data.jobHistory);

        // Update module state.
        MOD.state.simulation = data.simulation;
        MOD.state.jobHistory = data.simulation.jobs.global.all;
        MOD.state.configCard = data.configCard;

        // Fire event.
        MOD.events.trigger("setup:complete", this);
    });

}(
    this.APP.modules.monitoring
));
