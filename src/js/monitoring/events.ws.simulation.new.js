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

        // Cache new cv terms.
        if (eventData.cvTerms) {
            _.each(eventData.cvTerms, MOD.cv.insertTerm);
        }

        // Parse simulation.
        MOD.parseSimulation(eventData.simulation);

        // Update simulation collection.
        MOD.state.simulationList.push(eventData.simulation);

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
