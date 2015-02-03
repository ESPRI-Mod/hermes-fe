(function (APP, MOD, constants, _) {

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
                    MOD.state.setFilter(filter);
                    MOD.events.trigger("filter:refresh", filter);
                }
            });
        }

        // Update simulations.
        MOD.state.setFilteredSimulationList();

        // Update paging.
        MOD.state.setPagingState(MOD.state.paging.current);

        // Fire events.
        MOD.state.triggerSimulationFilterEvent();
        MOD.events.trigger("state:newSimulation", eventData);
    });

}(this.APP, this.APP.modules.monitoring, this.APP.constants, this._));
