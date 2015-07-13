(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Timeslice loaded event handler.
    // @data    Data loaded from remote server.
    MOD.events.on("state:timesliceUpdated", function (data) {
        // Initialise module state.
        MOD.state.simulationList = data.simulationList;
        MOD.state.simulationSet = _.indexBy(data.simulationList, "uid");

        // Parse event data.
        MOD.parseSimulations(MOD.state.simulationList, data.jobHistory, MOD.state.simulationSet);

        // Fire event.
        MOD.events.trigger("ui:filter", this);
    });

}(
    this.APP.modules.monitoring,
    this._
));
