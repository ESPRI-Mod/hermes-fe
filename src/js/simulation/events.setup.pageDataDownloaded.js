(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Setup event handler.
    // @data    Page setup data loaded from remote server.
    MOD.events.on("setup:pageDataDownloaded", function (data) {
        // Parse event data.
        MOD.parseSimulation(data.simulation, data.jobHistory);

        // Update module state.
        MOD.state.simulation = data.simulation;
        MOD.state.jobHistory = data.simulation.ext.jobs;
        MOD.state.configCard = data.configCard;

        // Fire event.
        MOD.events.trigger("setup:complete", this);
    });

}(
    this.APP.modules.simulation
));
