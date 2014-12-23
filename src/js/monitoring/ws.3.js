(function (APP, MOD, constants, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Simulation termination event handler.
    // @eventData      Event data received from server.
    MOD.events.on("ws:simulationTermination", function (eventData) {
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
        simulation.executionEndDate = eventData.ended;

        // Fire events.
        MOD.log("state:simulationTermination: " + simulation.name);
        MOD.events.trigger("state:simulationStatusUpdated", eventData);
        MOD.events.trigger("state:simulationTermination", eventData);
    });

}(this.APP, this.APP.modules.monitoring, this.APP.constants, this._));
