(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Simulation state change event handler.
    // @eventData      Event data received from server.
    MOD.events.on("ws:simulationStateChange", function (eventData) {
        var simulation;

        // Eascape if simulation not found.
        simulation = _.find(MOD.state.simulationList, function (s) {
            return s.uid === eventData.uid;
        });
        if (_.isUndefined(simulation)) {
            return;
        }

        // Escape if state update not required.
        if (simulation.executionState === eventData.state) {
            return;
        }

        // Update event data.
        eventData.s = simulation;
        eventData.statePrevious = simulation.executionState;

        // Update simulation.
        simulation.executionState = eventData.state;

        // Fire event.
        MOD.log("state:simulationStatusUpdated: " + simulation.name + "::" + eventData.state);
        MOD.events.trigger("state:simulationStatusUpdated", eventData);
    });

}(this.APP, this.APP.modules.monitoring, this._));
