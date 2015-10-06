(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var processSimulationEvent, processJobEvent;

    // Job event handler.
    // @ei    Event information received from remote server.
    processJobEvent = function (ei) {
        // Update module state.
        MOD.state.jobHistory = _.filter(MOD.state.simulation.jobs.global.all, function (j) {
            return j.jobUID !== ei.job.jobUID;
        });
        MOD.state.jobHistory.push(ei.job);

        // Reparse simulation.
        MOD.parseSimulation(MOD.state.simulation, MOD.state.jobHistory);

        // Fire event.
        ei.simulation = MOD.state.simulation;
        MOD.events.trigger("state:jobHistoryUpdate", ei);
    };

    // Simulation event handler.
    // @ei    Event information received from remote server.
    processSimulationEvent = function (ei) {
        // Update cv terms.
        _.extend(MOD.state, {
            cvTerms: _.union(MOD.state.cvTerms, ei.cvTerms)
        });

        // Parse event data.
        MOD.parseSimulation(ei.simulation, ei.jobHistory);

        // Update module state.
        MOD.state.simulation = ei.simulation;
        MOD.state.jobHistory = ei.simulation.jobs.global.all;

        // Fire events.
        MOD.events.trigger("state:simulationUpdate", ei);
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
