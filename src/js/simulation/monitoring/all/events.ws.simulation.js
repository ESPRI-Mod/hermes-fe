(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Simulation event handler.
    var processSimulationEvent = function (data) {
        // Update cv terms.
        _.extend(MOD.state, {
            cvTerms: _.union(MOD.state.cvTerms, data.cvTerms)
        });

        // Update module state.
        MOD.state.simulationList = _.reject(MOD.state.simulationList, function (s) {
            return s.hashid === data.simulation.hashid || s.uid === data.simulation.uid;
        });
        MOD.state.simulationList.push(data.simulation);
        MOD.state.simulationSet = _.indexBy(MOD.state.simulationList, "uid");

        // Parse simulation.
        MOD.parseSimulation(data.simulation, data.jobHistory);

        // Update filtered simulations.
        MOD.setFilteredSimulationList();

        // Update filters.
        // TODO review
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
        MOD.events.trigger("state:" + data.eventType, data);
    };

    // Wire upto simulation events streaming over the web-socket channel.
    MOD.events.on("ws:simulationComplete", processSimulationEvent);
    MOD.events.on("ws:simulationError", processSimulationEvent);
    MOD.events.on("ws:simulationStart", processSimulationEvent);

}(
    this.APP.modules.monitoring,
    this._
));
