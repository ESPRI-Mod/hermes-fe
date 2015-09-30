(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var processSimulationEvent, processJobEvent;

    // Job event handler.
    processJobEvent = function (data) {
        var simulation, jobHistory;

        // Escape if simulation is not in memory.
        if (_.has(MOD.state.simulationSet, data.job.simulationUID) === false) {
            MOD.log(data.eventType + " event: WARNING: simulation not found: id=" + data.job.simulationUID);
            return;
        }

        // Update existing job history.
        simulation = MOD.state.simulationSet[data.job.simulationUID];
        jobHistory = _.filter(simulation.jobs.global.all, function (j) {
            return j.jobUID !== data.job.jobUID;
        });
        jobHistory.push(data.job);

        // Reparse simulation.
        MOD.parseSimulation(simulation, jobHistory);

        // Fire events.
        data.simulation = simulation;
        MOD.events.trigger("state:" + data.eventType, data);
    };

    // Simulation event handler.
    processSimulationEvent = function (data) {
        // Update cv terms.
        _.extend(MOD.state, {
            cvTerms: _.union(MOD.state.cvTerms, data.cvTerms)
        });

        // Update module state.
        MOD.state.simulationList = _.filter(MOD.state.simulationList, function (s) {
            return s.hashid !== data.simulation.hashid && s.uid !== data.simulation.uid;
        });
        MOD.state.simulationList.push(data.simulation);
        MOD.state.simulationSet = _.indexBy(MOD.state.simulationList, "uid");

        // Parse simulation.
        MOD.parseSimulation(data.simulation, data.jobHistory);

        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update filters.
        // TODO review
        alert("TODO - update active filter on a new simulation");
        // _.each(MOD.state.filters, function (filter) {
        //     if (_.indexOf(filter.cvTerms.active, data.simulation[filter.key]) === -1) {
        //         filter.cvTerms.active.push(data.simulation[filter.key]);
        //         MOD.events.trigger("ui:filter:refresh", filter);
        //     }
        // });

        // Update paging.
        MOD.updatePagination(MOD.state.paging.current);

        // Fire events.
        MOD.events.trigger("state:simulationListFiltered");
        MOD.events.trigger("state:" + data.eventType, data);
    };

    // Wire upto events streaming over the web-socket channel.
    MOD.events.on("ws:simulationComplete", processSimulationEvent);
    MOD.events.on("ws:simulationError", processSimulationEvent);
    MOD.events.on("ws:simulationStart", processSimulationEvent);
    MOD.events.on("ws:jobComplete", processJobEvent);
    MOD.events.on("ws:jobError", processJobEvent);
    MOD.events.on("ws:jobStart", processJobEvent);

}(
    this.APP.modules.monitoring,
    this._
));
