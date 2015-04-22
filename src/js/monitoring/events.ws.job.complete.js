(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Job complete event handler.
    // @data      Event data received from server.
    MOD.events.on("ws:jobComplete", function (data) {
        // Update cv terms.
        _.extend(MOD.state, {
            cvTerms: _.union(MOD.state.cvTerms, data.cvTerms)
        });

        // Parse event data.
        MOD.parseSimulation(data.simulation, data.jobHistory);

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
        MOD.events.trigger("state:jobComplete", data);
    });

}(
    this.APP.modules.monitoring,
    this._
));
