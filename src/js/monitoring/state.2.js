(function (APP, MOD, constants, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Setup data loaded event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("state:setupDataLoaded", function (data) {
        // Cache simulation list.
        MOD.state.simulationList = data.simulationList;
        MOD.state.cvTerms = data.cvTerms;

        // Initialise filter data.
        _.each(MOD.filters, function (filter) {
            var values;

            // Set values.
            values = _.map(data.simulationList, function (s) {
                return s[filter.key];
            });
            if (filter.defaultValue) {
                values.push(filter.defaultValue);
            }
            values = _.uniq(values).sort();
            values.unshift("*");

            // Update module state.
            MOD.state[filter.key + "List"] = values;
            MOD.state[filter.key] = filter.defaultValue || values[0];
        });

        // Set filtered simulations.
        MOD.state.setFilteredSimulationList();

        // Set paging.
        MOD.state.setPagingState();

        // Fire event.
        MOD.events.trigger("state:initialized", this);
    });

    // Apply filter event handler.
    MOD.events.on("ui:applyFilter", function () {
        // Set filtered simulations.
        MOD.state.setFilteredSimulationList();

        // Set paging.
        MOD.state.setPagingState();

        // Fire event.
        MOD.state.triggerSimulationFilterEvent();
    });

}(this.APP, this.APP.modules.monitoring, this.APP.constants, this._));
