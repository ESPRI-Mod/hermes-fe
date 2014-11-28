(function (APP, MOD, constants, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Helper vars.
    var state = MOD.state;

    // Setup data loaded event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("state:setupDataLoaded", function (data) {
        // Cache simulations.
        state.simulationList = data.simulationList;

        // Initialise filter data.
        _.each(MOD.filters, function (filter) {
            var collection, item;

            // Set collection.
            collection = data[filter.typeName + "List"];
            collection.unshift({
                id: 0,
                name: "*",
                isDefault: false
            });

            // Set active item.
            item = _.find(collection, function (i) {
                return _.has(i, "isDefault") ? i.isDefault : false;
            });
            if (_.isObject(item) === false) {
                item = collection[0];
            }

            // Update state.
            state[filter.typeName + "List"] = collection;
            state[filter.typeName] = item;
        });

        // Set filtered simulations.
        state.setFilteredSimulationList();

        // Set paging.
        state.setPagingState();

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
