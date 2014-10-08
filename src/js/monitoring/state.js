// --------------------------------------------------------
// momitoring/state.js
// Manages module level state.
// --------------------------------------------------------
(function(APP, MOD, constants) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    var state = MOD.state = {
        // Current activity.
        activity: undefined,

        // List of activities.
        activityList: [],

        // Current compute node.
        computeNode: undefined,

        // List of compute nodes.
        computeNodeList: [],

        // Current compute node login.
        computeNodeLogin: undefined,

        // List of compute node logins.
        computeNodeLoginList: [],

        // Current compute node machine.
        computeNodeMachine: undefined,

        // List of compute node machines.
        computeNodeMachineList: [],

        // Current experiment.
        experiment: undefined,

        // List of experiments.
        experimentList: [],

        // Current model.
        model: undefined,

        // List of models.
        modelList: [],

        // List of simulations.
        simulationList: [],

        // List of filtered simulations.
        simulationListFiltered: [],

        // Current execution state.
        executionState: undefined,

        // List of execution states.
        executionStateList: [],

        // Current space.
        space: undefined,

        // List of spaces.
        spaceList: [],

        // Paging related state.
        paging : {
            current : undefined,
            count : undefined,
            previous : undefined,
            pages : []
        }
    };

    // Sets the paging state.
    var setPagingState = function (currentPage) {
        var pages, page;

        // Reset pages.
        pages = APP.utils.getPages(state.simulationListFiltered);
        state.paging.pages = pages;
        state.paging.count = pages.length;
        state.paging.current = state.paging.count ? pages[0] : undefined;
        state.paging.previous = undefined;

        // Ensure current page is respected.
        if (currentPage) {
            page = _.find(pages, function(p) {
                return _.indexOf(p.data, currentPage.data[0]) !== -1;
            })
            if (page) {
                state.paging.current = page;
            }
        }
    };

    // Sets collection of filtered simulations.
    var setFilteredSimulationList = function () {
        var filtered;

        // Set filtered simulations.
        filtered = state.simulationList;
        _.each(MOD.filters, function(f) {
            if (state[f.typeName].id > 0) {
                filtered = _.filter(filtered, function (s) {
                    return s[f.typeName + "ID"] === state[f.typeName].id;
                });
            }
        });

        // Sort.
        filtered = _.sortBy(filtered, function(s) {
            return s.activity + s.name;
        });

        // Update state.
        state.simulationListFiltered = filtered;
    };

    // Setup data loaded event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("state:setupDataLoaded", function (data) {
        // Cache simulations.
        state.simulationList = data.simulationList;

        // Cache filters.
        _.each(_.keys(data), function(key) {
            if (key !== 'simulationList' && _.has(state, key)) {
                // Set filter collection.
                state[key] = [{
                    id: 0,
                    name: "*"
                }];
                state[key] = state[key].concat(data[key]);

                // Set filter current item.
                state[key.substr(0, key.length - 4)] = state[key][0];
            }
        });

        // Set login name property.
        _.each(state.computeNodeLoginList.slice(1), function (i) {
            i.name = i.login;
        });

        // Set filtered simulations.
        setFilteredSimulationList();

        // Set paging.
        setPagingState();

        // Fire event.
        MOD.events.trigger("state:initialized", this);
    });

    // Apply filter event handler.
    MOD.events.on("ui:applyFilter", function () {
        // Update state.
        setFilteredSimulationList();
        setPagingState();

        // Fire event.
        if (state.simulationListFiltered.length) {
            MOD.events.trigger("state:simulationListFiltered", this);
        } else {
            MOD.events.trigger("state:simulationListNull", this);
        }
    });

    // Simulation state change event handler.
    // @ei      Event information.
    MOD.events.on("ws:stateChange", function (ei) {
        var s, es;

        // Get existing simulation.
        s = _.find(state.simulationList, function (s) {
            return s.id === ei.id;
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

    MOD.events.on("ws:new", function (ei) {
        var s, current;

        // Escape if already received.
        s = _.find(state.simulationList, function (s) {
            return s.id === ei.simulation.id;
        });
        if (s) {
            return;
        }

        // Update event information.
        ei.simulation.state = ei.simulation.execution_state;

        // Update state.
        state.simulationList.push(ei.simulation);
        setFilteredSimulationList();
        setPagingState(state.paging.current);

        // Fire events.
        MOD.log("state:newSimulation :: " + ei.simulation.name)
        if (state.simulationListFiltered.length) {
            MOD.events.trigger("state:simulationListFiltered", this);
        } else {
            MOD.events.trigger("state:simulationListNull", this);
        }
        MOD.events.trigger("state:newSimulation", ei);
    });

}(this.APP, this.APP.modules.monitoring, this.APP.constants));
