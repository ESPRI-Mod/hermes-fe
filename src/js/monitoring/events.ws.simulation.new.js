(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // New simulation event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:newSimulation", function (data) {
        var simulation, dead;

        // Escape if event already received.
        simulation = _.find(MOD.state.simulationList, function (s) {
            return s.uid === data.simulation.uid;
        });
        if (simulation) {
            return;
        }

        // Cache new cv terms.
        _.each(data.cvTerms, MOD.cv.insertTerm);

        // Remove dead simulations.
        data.dead = dead = _.find(MOD.state.simulationList, function (s) {
            return s.hashid === data.simulation.hashid;
        });
        if (dead) {
            MOD.state.simulationList = _.without(MOD.state.simulationList, dead);
            MOD.state.simulationListFiltered = _.without(MOD.state.simulationListFiltered, dead);
            if (_.has(MOD.state.simulationStateHistory, dead.uid)) {
                delete MOD.state.simulationStateHistory[dead.uid];
            }
        }

        // Update module state.
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
