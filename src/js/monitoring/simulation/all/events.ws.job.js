(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Job event handler.
    var processJobEvent = function (eventType, data) {
        var simulation;

        // Escape if simulation is not in memory.
        simulation = data.simulation = MOD.state.simulationSet[data.job.simulationUID];
        if (_.isUndefined(simulation)) {
            MOD.log(eventType + " event: WARNING: simulation not found: id=" + data.job.simulationUID);
            return;
        }

        // Parse.
        MOD.parseJob(data.job);

        // Update simulation job collection.
        simulation.jobs.global.all = _.filter(simulation.jobs.global.all, function (job) {
            return job.jobUID !== data.job.jobUID;
        });
        simulation.jobs.global.all.push(data.job);
        MOD.parseJobs(simulation, false);

        // Fire events.
        MOD.events.trigger("state:" + eventType, data);
    };

    // Job complete event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobComplete", function (data) {
        processJobEvent("jobComplete", data);
    });

    // Job error event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobError", function (data) {
        processJobEvent("jobError", data);
    });

    // Job start event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobStart", function (data) {
        processJobEvent("jobStart", data);
    });

}(
    this.APP.modules.monitoring,
    this._
));
