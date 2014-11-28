(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    MOD.state = {
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

}(this.APP.modules.monitoring));
