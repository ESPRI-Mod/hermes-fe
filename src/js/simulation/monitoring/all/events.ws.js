(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var processSimulationEvent,
        processJobEvent;

    // Job event handler.
    // @ei    Event information received from remote server.
    processJobEvent = function (ei) {
        var simulation, jobHistory;

        // Escape if simulation is not in memory.
        if (_.has(MOD.state.simulationSet, ei.job.simulationUID) === false) {
            return;
        }

        // Update simulation.
        simulation = MOD.state.simulationSet[ei.job.simulationUID];
        jobHistory = _.filter(simulation.jobs.global.all, function (j) {
            return j.jobUID !== ei.job.jobUID;
        });
        jobHistory.push(ei.job);

        // Reparse simulation.
        MOD.parseSimulation(simulation, jobHistory);

        // Fire event.
        ei.simulation = simulation;
        MOD.events.trigger("state:jobUpdate", ei);
    };

    // Simulation event handler.
    // @ei    Event information received from remote server.
    processSimulationEvent = function (ei) {
        // Update cv terms.
        _.extend(MOD.state, {
            cvTerms: _.union(MOD.state.cvTerms, ei.cvTerms)
        });

        // Update module state.
        MOD.state.simulationList = _.filter(MOD.state.simulationList, function (s) {
            return s.hashid !== ei.simulation.hashid && s.uid !== ei.simulation.uid;
        });
        MOD.state.simulationList.push(ei.simulation);
        MOD.state.simulationSet = _.indexBy(MOD.state.simulationList, "uid");

        // Parse simulation.
        MOD.parseSimulation(ei.simulation, ei.jobHistory);

        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update pagination.
        MOD.updatePagination(MOD.state.paging.current);

        // Fire events.
        MOD.events.trigger("state:simulationUpdate", ei);
        MOD.events.trigger("state:simulationListUpdate");
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
