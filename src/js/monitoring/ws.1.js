(function (APP, MOD, constants, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // New simulation event handler.
    // @eventData      Event data received from server.
    MOD.events.on("ws:newSimulation", function (eventData) {
        var simulation;

        // Escape if event already received.
        simulation = _.find(MOD.state.simulationList, function (s) {
            return s.uid === eventData.simulation.uid;
        });
        if (simulation) {
            return;
        }

        // Update filters.
        console.log("TODO - update filters when new simulation recieved");

        // Update simulations.
        MOD.state.simulationList.push(eventData.simulation);
        MOD.state.setFilteredSimulationList();

        // Update paging.
        MOD.state.setPagingState(MOD.state.paging.current);

        // Fire events.
        MOD.state.triggerSimulationFilterEvent();
        MOD.events.trigger("state:newSimulation", eventData);
    });

}(this.APP, this.APP.modules.monitoring, this.APP.constants, this._));
