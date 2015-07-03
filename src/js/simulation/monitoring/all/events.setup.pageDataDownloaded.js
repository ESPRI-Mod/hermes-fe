(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Setup event handler.
    // @data    Page setup data loaded from remote server.
    MOD.events.on("setup:pageDataDownloaded", function (data) {
        // Initialise module state.
        MOD.state.simulationList = data.simulationList;
        MOD.state.simulationSet = _.indexBy(data.simulationList, "uid");

        // Parse event data.
        _.each(data.simulationList, function (simulation) {
            MOD.parseSimulation(simulation, _.filter(data.jobHistory, function (job) {
                return job.simulationUID === simulation.uid;
            }));
        });

        // Initialise filter state.
        _.each(MOD.state.filters, MOD.initFilterState);

        // Initialise filtered list.
        MOD.setFilteredSimulationList();

        // Initialise active filter values.
        _.each(MOD.state.filters, MOD.setActiveFilterValues);

        // Initialise paging.
        MOD.setPagingState();

        // Fire event.
        MOD.events.trigger("setup:complete", this);
    });

}(
    this.APP.modules.monitoring,
    this._
));
