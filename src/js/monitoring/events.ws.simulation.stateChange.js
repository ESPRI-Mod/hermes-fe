(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Simulation state change event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:simulationStateChange", function (data) {
        var simulation,
            previousSimulationState,
            eventData;

        // Escape if simulation not found.
        simulation = _.find(MOD.state.simulationList, function (s) {
            return s.uid === data.simulationUID;
        });
        if (_.isUndefined(simulation)) {
            return;
        }

        // Parse event data.
        _.each(data.simulationStateHistory, MOD.parseStateChange);

        // Update module state.
        MOD.state.simulationStateHistory[data.simulationUID] = data.simulationStateHistory;

        // Parse simulation state history.
        previousSimulationState = simulation.executionState;
        MOD.parseSimulationStateHistory(simulation);

        // Fire simulation state update event.
        eventData = {
            eventTimestamp: data.eventTimestamp,
            s: simulation,
            statePrevious: previousSimulationState,
        };
        MOD.log("state:simulationStatusUpdate: " + simulation.name + "::" + simulation.ext.state.description);
        MOD.events.trigger("state:simulationStatusUpdate", eventData);
    });

}(
    this.APP.modules.monitoring,
    this._
));
