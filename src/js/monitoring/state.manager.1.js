// --------------------------------------------------------
// momitoring/state.js
// Manages module level state.
// --------------------------------------------------------
(function(APP, MOD, constants, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Helper vars.
    var state = MOD.state;

    // Setup data loaded event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("state:setupDataLoaded", function (data) {
        // Cache simulations.
        state.simulationList = data.simulationList;
        delete data.simulationList;

        // Cache filters.
        _.each(_.keys(data), function(key) {
            var collection,
                item,
                itemKey = key.substr(0, key.length - 4);

            if (_.has(state, key)) {
                // Set collection.
                collection = [{
                    id: 0,
                    name: "*",
                    isDefault: false
                }];
                collection = collection.concat(data[key]);

                // Set current item.
                item = _.find(collection, function (instance) {
                    if (_.has(instance, "isDefault")) {
                        return instance.isDefault;
                    } else {
                        return false;
                    }
                });
                if (_.isObject(item) === false) {
                    item = collection[0];
                }

                // Update state.
                state[key] = collection;
                state[itemKey] = item;
            }
        });

        // Set login name property.
        _.each(state.computeNodeLoginList.slice(1), function (i) {
            i.name = i.login;
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
        // Update state.
        state.setFilteredSimulationList();
        state.setPagingState();

        // Fire event.
        if (state.simulationListFiltered.length) {
            MOD.events.trigger("state:simulationListFiltered", this);
        } else {
            MOD.events.trigger("state:simulationListNull", this);
        }
    });

}(this.APP, this.APP.modules.monitoring, this.APP.constants, this._));
