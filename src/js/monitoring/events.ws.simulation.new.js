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

        // Update cv terms.
        if (eventData.cvTerms) {
            MOD.state.appendCVTermset(eventData.cvTerms);
        }

        // Parse simulation & update collection.
        MOD.parseSimulation(eventData.simulation);
        MOD.state.simulationList.push(eventData.simulation);

        // Update filters.
        if (eventData.cvTerms) {
            _.each(eventData.cvTerms, function (cvTerm) {
                var filter = _.find(MOD.state.filters, function (filter) {
                    return filter.cvType === cvTerm.typeof;
                });
                if (filter) {
                    MOD.initFilter(filter);
                    MOD.events.trigger("ui:filter:refresh", filter);
                }
            });
        }

        // Update simulations.
        MOD.setFilteredSimulationList();

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
