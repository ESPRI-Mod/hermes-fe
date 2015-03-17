(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // New simulation event handler.
    // @eventData      Event data received from server.
    MOD.events.on("ws:newSimulation", function (eventData) {
        var simulation;

        // Escape if event already received.
        simulation = _.find(MOD.state.simulationList, function (s) {
            return s.uid === eventData.simulation.uid;
        });
        if (simulation) {
            return;
        }

        // Parse event data.
        MOD.parseStateChangeHistory(eventData.simulationStateHistory);

        // Cache new cv terms.
        if (eventData.cvTerms) {
            _.each(eventData.cvTerms, MOD.cv.insertTerm);
        }

        // Update module state.
        MOD.state.simulationList.push(eventData.simulation);
        MOD.state.simulationStateHistory[eventData.simulation.uid] = eventData.simulationStateHistory;

        // Parse simulation.
        MOD.parseSimulation(eventData.simulation);

        // Update simulations.
        MOD.setFilteredSimulationList();

        // Update filters.
        if (eventData.cvTerms) {
            _.each(eventData.cvTerms, function (cvTerm) {
                var filter;

                filter = _.find(MOD.state.filters, function (filter) {
                    return filter.cvType === cvTerm.typeof;
                });
                if (filter) {
                    MOD.updateFilterState(filter);
                    MOD.events.trigger("ui:filter:refresh", filter);
                }
            });
        }

        // Update paging.
        MOD.setPagingState(MOD.state.paging.current);

        // Fire events.
        MOD.triggerSimulationFilterEvent();
        MOD.events.trigger("state:newSimulation", eventData);
    });

}(
    this.APP.modules.monitoring,
    this._
));
