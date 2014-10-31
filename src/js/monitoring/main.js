// --------------------------------------------------------
// momitoring/main.js
// Module entry point.
// --------------------------------------------------------
(function(APP, utils, constants, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    var MOD = APP.registerModule("monitoring", {
        // Module title.
        title: "Simulation Monitor",

        // Module short title.
        shortTitle: "Monitor",

        // Module version.
        version : "0.1.0",

        // Module key aliases.
        keyAliases: ["monitor"],

        // Map of simulation states to bootstrap css classes.
        statesCSS : {
            "QUEUED" : 'info',
            "RUNNING" : 'info',
            "SUSPENDED" : 'warning',
            "COMPLETE" : 'success',
            "ROLLBACK" : 'warning',
            "ERROR" : 'danger',
        },

        // Set of supported filters.
        filters: [
            {
                typeName: 'activity',
                displayName: 'Activity'
            },
            {
                typeName: 'computeNode',
                displayName: 'Node'
            },
            {
                typeName: 'computeNodeMachine',
                displayName: 'Machine'
            },
            {
                typeName: 'computeNodeLogin',
                displayName: 'Login',
            },
            {
                typeName: 'experiment',
                displayName: 'Experiment'
            },
            {
                typeName: 'model',
                displayName: 'Tag / Model'
            },
            {
                typeName: 'executionState',
                displayName: 'State'
            },
            {
                typeName: 'space',
                displayName: 'Space'
            },
        ]
    });

    // Websocket initialized event handler.
    MOD.events.on("ws:initialized", function () {
        var ep;

        // Load setup data & fire event.
        ep = utils.getEndPoint(constants.urls.MONITORING_SETUP);
        $.getJSON(ep, function (setupData) {
            MOD.events.trigger("state:setupDataLoaded", setupData);
        });
    });

    // State initialization event handler.
    MOD.events.on("state:initialized", function () {
        // Render view.
        MOD.view = new MOD.views.MainView();
        MOD.view.render();

        // Update DOM.
        $(".app-content").append(MOD.view.$el);

        // Fire event.
        MOD.events.trigger("ui:initialized");
    });

}(this.APP, this.APP.utils, this.APP.constants, this.$jq));
