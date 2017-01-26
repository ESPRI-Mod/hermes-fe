(function (APP, MOD, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: websocket initialized.
    var onInitializationEvent = function () {
        $.getJSON(APP.utils.getEndPoint(MOD.urls.FETCH_CV), function (data) {
            MOD.events.trigger("cv:dataFetched", data);
        });
    };

    // Job event handler.
    // @data    Event information received from server.
    var processJobEvent = function (data) {
        var jobList;

        // Map event data.
        data.job = MOD.mapJob(data.job);

        // Escape if simulation is not in memory.
        if (MOD.state.simulation.uid !== data.job.simulationUID) {
            return;
        }

        // Update simulation job list.
        jobList = _.filter(MOD.state.simulation.jobs.all, function (j) {
            return j.jobUID !== data.job.jobUID;
        });
        jobList.push(data.job);

        // Reparse simulation.
        MOD.parseSimulation(MOD.state.simulation, jobList);

        // Fire event.
        MOD.events.trigger("state:jobListUpdate", _.extend(data, {
            simulation: MOD.state.simulation
        }));
    };

    // Simulation event handler.
    // @data    Event information received from server.
    var processSimulationEvent = function (data) {
        // Map tuples to JSON objects.
        data.jobList = _.map(data.jobList, MOD.mapJob);

        // Update cv terms.
        MOD.state.cvTerms = _.union(MOD.state.cvTerms, data.cvTerms);

        // Reparse simulation.
        MOD.parseSimulation(data.simulation, data.jobList);

        // Update module state.
        MOD.state.simulation = data.simulation;

        // Fire events.
        MOD.events.trigger("ws:simulationUpdate", data);
    };

    // Wire upto events streaming over the web-socket channel.
    MOD.events.on("ws:initialized", onInitializationEvent);
    // MOD.events.on("ws:jobComplete", processJobEvent);
    // MOD.events.on("ws:jobError", processJobEvent);
    // MOD.events.on("ws:jobStart", processJobEvent);
    // MOD.events.on("ws:simulationComplete", processSimulationEvent);
    // MOD.events.on("ws:simulationError", processSimulationEvent);
    // MOD.events.on("ws:simulationStart", processSimulationEvent);

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$,
    this._
));
