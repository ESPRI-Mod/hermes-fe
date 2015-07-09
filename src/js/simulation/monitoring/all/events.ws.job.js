(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Job event handler.
    var processJobEvent = function (data) {
        var simulation, existing;

        // Escape if simulation is not in memory.
        simulation = data.simulation = MOD.state.simulationSet[data.job.simulationUID];
        if (_.isUndefined(simulation)) {
            MOD.log(data.eventType + " event: WARNING: simulation not found: id=" + data.job.simulationUID);
            return;
        }

        // Extend.
        MOD.extendJob(data.job);

        // Update simulation job sets.
        // existing = _.find(simulation.jobs.global.all, function (job) {
        //     return job.jobUID !== data.job.jobUID;
        // });
        // simulation.jobs.global.all

        simulation.jobs.global.all = _.filter(simulation.jobs.global.all, function (job) {
            return job.jobUID !== data.job.jobUID;
        });
        simulation.jobs.global.all.push(data.job);
        MOD.parseJobs(simulation);

        // Fire events.
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
