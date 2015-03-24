(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // New simulation event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:newSimulation", function (data) {
        var simulation;

        // Escape if event already received.
        simulation = _.find(MOD.state.simulationList, function (s) {
            return s.uid === data.simulation.uid;
        });
        if (simulation) {
            return;
        }

        // Update module state.
        MOD.state.cvTerms = MOD.state.cvTerms.concat(data.cvTerms);
        _.each(MOD.state.filters, MOD.updateFilterState);
        data.dead = MOD.deleteDeadSimulations(data.simulation.hashid);
        MOD.state.simulationList.push(data.simulation);
        MOD.state.simulationStateHistory[data.simulation.uid] = data.simulationStateHistory;

        // Parse event data.
        _.each(data.simulationStateHistory, MOD.parseStateChange);
        MOD.parseSimulation(data.simulation);

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
        MOD.events.trigger("state:newSimulation", data);
    });

}(
    this.APP.modules.monitoring,
    this._
));
