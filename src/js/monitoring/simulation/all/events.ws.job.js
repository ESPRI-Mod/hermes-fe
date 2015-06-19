(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Job event handler.
    var processJobEvent = function (eventType, data) {
        var simulation;

        // Escape if simulation is not in memory.
        simulation = data.simulation = MOD.state.simulationSet[data.job.simulationUID];
        if (_.isUndefined(simulation)) {
            return;
        }

        // Parse job.
        MOD.parseJob(data.job);

        // Update jobs.
        simulation.ext.jobs = _.filter(simulation.ext.jobs, function (job) {
            return job.jobUID !== data.job.jobUID;
        });
        simulation.ext.jobs.push(data.job);

        // Reparse jobs.
        MOD.parseJobs(simulation, false);

        // Fire events.
        MOD.events.trigger("state:" + eventType, data);
    };

    // Job complete event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobComplete", function (data) {
        console.log("jobComplete event recieved: job id=" + data.job.jobUID);
        processJobEvent("jobComplete", data);
    });

    // Job error event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobError", function (data) {
        console.log("jobError event recieved: job id=" + data.job.jobUID);
        processJobEvent("jobError", data);
    });

    // Job start event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobStart", function (data) {
        console.log("jobStart event recieved: job id=" + data.job.jobUID);
        processJobEvent("jobStart", data);
    });

}(
    this.APP.modules.monitoring,
    this._
));
