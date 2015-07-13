(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Timeslice loaded event handler.
    // @data    Data loaded from remote server.
    MOD.events.on("state:timesliceLoaded", function (data) {
        // Initialise module state.
        MOD.state.simulationList = data.simulationList;
        MOD.state.simulationSet = _.indexBy(data.simulationList, "uid");

        // Parse event data.
        MOD.parseSimulations(MOD.state.simulationList, data.jobHistory, MOD.state.simulationSet);

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
