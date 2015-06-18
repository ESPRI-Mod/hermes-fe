(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Simulation event handler.
    var processSimulationEvent = function (eventType, data) {
        // Update cv terms.
        _.extend(MOD.state, {
            cvTerms: _.union(MOD.state.cvTerms, data.cvTerms)
        });

        // Parse event data.
        MOD.parseSimulation(data.simulation, data.jobHistory);

        // Update module state.
        MOD.state.simulationSet[data.simulation.uid] = data.simulation;
        MOD.state.simulationList = _.values(MOD.state.simulationSet);

        // Update filtered simulations.
        MOD.setFilteredSimulationList();

        // Update filters.
        _.each(MOD.state.filters, function (filter) {
            if (_.indexOf(filter.cvTerms.active, data.simulation[filter.key]) === -1) {
                filter.cvTerms.active.push(data.simulation[filter.key]);
                MOD.events.trigger("ui:filter:refresh", filter);
            }
        });

        // Update paging.
        MOD.setPagingState(MOD.state.paging.current);

        // Fire events.
        MOD.triggerSimulationFilterEvent();
        MOD.events.trigger("state:" + eventType, data);
    };

    // Simulation complete event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:simulationComplete", function (data) {
        processSimulationEvent("simulationComplete", data);
    });

    // Simulation error event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:simulationError", function (data) {
        processSimulationEvent("simulationError", data);
    });

    // Simulation start event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:simulationStart", function (data) {
        processSimulationEvent("simulationStart", data);
    });

}(
    this.APP.modules.monitoring,
    this._
));
