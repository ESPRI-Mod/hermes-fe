(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var processSimulationEvent, processJobEvent;

    // Job event handler.
    // @ei    Event information received from remote server.
    processJobEvent = function (ei) {
        console.log("WS job event :: " + ei.job.uid);
    };

    // Simulation event handler.
    // @ei    Event information received from remote server.
    processSimulationEvent = function (ei) {
        console.log("WS simulation event :: " + ei.simulation.name);
    };

    // Wire upto events streaming over the web-socket channel.
    MOD.events.on("ws:jobComplete", processJobEvent);
    MOD.events.on("ws:jobError", processJobEvent);
    MOD.events.on("ws:jobStart", processJobEvent);
    MOD.events.on("ws:simulationComplete", processSimulationEvent);
    MOD.events.on("ws:simulationError", processSimulationEvent);
    MOD.events.on("ws:simulationStart", processSimulationEvent);

}(
    this.APP.modules.monitoring,
    this._
));
