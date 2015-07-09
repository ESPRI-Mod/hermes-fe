(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Job event handler.
    var processJobEvent = function (data) {
        var simulation, jobHistory;

        // Escape if simulation is not in memory.
        if (_.has(MOD.state.simulationSet, data.job.simulationUID) === false) {
            MOD.log(data.eventType + " event: WARNING: simulation not found: id=" + data.job.simulationUID);
            return;
        }

        // Update existing job history.
        simulation = MOD.state.simulationSet[data.job.simulationUID];
        jobHistory = _.reject(simulation.jobs.global.all, function (j) {
            return j.jobUID === data.job.jobUID;
        });
        jobHistory.push(data.job);

        // Reparse simulation.
        MOD.parseSimulation(data.simulation, jobHistory);

        // Fire events.
        data.simulation = simulation;
        MOD.events.trigger("state:" + data.eventType, data);
    };

    // Wire upto job events streaming over the web-socket channel.
    MOD.events.on("ws:jobComplete", processJobEvent);
    MOD.events.on("ws:jobError", processJobEvent);
    MOD.events.on("ws:jobStart", processJobEvent);
}(
    this.APP.modules.monitoring,
    this._
));
