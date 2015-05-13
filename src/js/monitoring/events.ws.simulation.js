(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Simulation complete event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:simulationComplete", function (data) {
        MOD.processSimulationEvent("simulationComplete", data);
    });

    // Simulation error event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:simulationError", function (data) {
        MOD.processSimulationEvent("simulationError", data);
    });

    // Simulation start event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:simulationStart", function (data) {
        MOD.processSimulationEvent("simulationStart", data);
    });

}(
    this.APP.modules.monitoring,
    this._
));
