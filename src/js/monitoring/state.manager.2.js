// --------------------------------------------------------
// momitoring/state.js
// Manages module level state.
// --------------------------------------------------------
(function(APP, MOD, constants, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Helper vars.
    var state = MOD.state;

    // New simulation event handler.
    // @ei      Event information.
    MOD.events.on("ws:new", function (ei) {
        var s, current;

        // Escape if already received.
        s = _.find(state.simulationList, function (s) {
            return s.id === ei.simulation.id;
        });
        if (s) {
            return;
        }

        // Update filters.
        if (ei.refreshFilters) {
            _.each(MOD.filters, function (filter) {
                var existing, refreshed, diff, updated;

                existing = state[filter.typeName + "List"];
                refreshed = ei[filter.typeName + "List"];
                diff = _.difference(_.pluck(refreshed, 'id'),
                                    _.pluck(existing.slice(1), 'id'));
                if (diff.length) {
                    updated = existing.slice(0, 1);
                    updated = updated.concat(refreshed);
                    state[filter.typeName + "List"] = updated;
                    MOD.events.trigger("filter:refresh", filter);
                }
            });
        }

        // Update event information.
        ei.simulation.state = ei.simulation.execution_state;

        // Update state.
        state.simulationList.push(ei.simulation);
        state.setFilteredSimulationList();
        state.setPagingState(state.paging.current);

        // Fire events.
        MOD.log("state:newSimulation :: " + ei.simulation.name);
        if (state.simulationListFiltered.length) {
            MOD.events.trigger("state:simulationListFiltered", this);
        } else {
            MOD.events.trigger("state:simulationListNull", this);
        }
        MOD.events.trigger("state:newSimulation", ei);
    });

    // Simulation state change event handler.
    // @ei      Event information.
    MOD.events.on("ws:stateChange", function (ei) {
        var s, es;

        // Get existing simulation.
        s = _.find(state.simulationList, function (s) {
            return s.uid === ei.uid;
        });
        if (_.isUndefined(s) || s.executionState === ei.state) {
            return;
        }

        // Get existing execution state.
        es = _.find(state.executionStateList, function (es) {
            return es.name === ei.state;
        });
        if (_.isUndefined(es)) {
            throw new APP.Exception("Unknown simulation status");
        }

        // Update event information.
        ei.s = s;
        ei.stateID = es.id;
        ei.statePrevious = s.executionState;
        ei.statePreviousID = s.executionStateID;

        // Update simulation.
        s.executionState = es.name;
        s.executionStateID = es.id;

        // Fire event.
        MOD.log("state:simulationStatusUpdated: " + es.id + "::" + es.name);
        MOD.events.trigger("state:simulationStatusUpdated", ei);
    });

    // Simulation termination event handler.
    // @ei      Event information.
    MOD.events.on("ws:simulationTermination", function (ei) {
        var s, es;

        // Get existing simulation.
        s = _.find(state.simulationList, function (s) {
            return s.uid === ei.uid;
        });
        if (_.isUndefined(s) || s.executionState === ei.state) {
            return;
        }

        // Get existing execution state.
        es = _.find(state.executionStateList, function (es) {
            return es.name === ei.state;
        });
        if (_.isUndefined(es)) {
            throw new APP.Exception("Unknown simulation status");
        }

        // Update event information.
        ei.s = s;
        ei.stateID = es.id;
        ei.statePrevious = s.executionState;
        ei.statePreviousID = s.executionStateID;

        // Update simulation.
        s.executionState = es.name;
        s.executionStateID = es.id;
        s.executionEndDate = ei.ended;

        // Fire events.
        MOD.log("state:simulationTermination: " + s.name);
        MOD.events.trigger("state:simulationStatusUpdated", ei);
        MOD.events.trigger("state:simulationTermination", ei);
    });

}(this.APP, this.APP.modules.monitoring, this.APP.constants, this._));
