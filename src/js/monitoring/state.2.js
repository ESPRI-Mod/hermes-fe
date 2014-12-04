(function (APP, MOD, constants, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Helper vars.
    var state = MOD.state;

    // Setup data loaded event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("state:setupDataLoaded", function (data) {
        // Cache setup data.
        state.simulationList = data.simulationList;
        state.cvTerms = data.cvTerms;

        // Initialise filter data from cv terms.
        _.each(MOD.filters, function (filter) {
            var collection, item;

            // Set collection.
            collection = _.filter(data.cvTerms, function (term) {
                return term.cvType === filter.cvType;
            });
            collection.unshift({
                cvType: filter.cvType,
                id: 0,
                isDefault: false,
                name: "*"
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
