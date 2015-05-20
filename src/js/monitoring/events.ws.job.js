(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Job event handler.
    var processJobEvent = function (eventType, data) {
        // Set matching simulation.
        data.simulation = MOD.state.simulationSet[data.job.simulationUID];
        if (_.isUndefined(data.simulation)) {
            return;
        }

        // Parse job.
        MOD.parseJob(data.job);

        // Update simulation jobs.
        data.simulation.ext.jobs = _.filter(data.simulation.ext.jobs, function (job) {
            return job.jobUID !== data.job.jobUID;
        });
        data.simulation.ext.jobs.push(data.job);

        // Parse simulation jobs.
        MOD.parseSimulationJobs(data.simulation, false);

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
