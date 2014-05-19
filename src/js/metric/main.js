// --------------------------------------------------------
// metric/main.js
// Module entry point.
// --------------------------------------------------------
(function (APP, utils, constants, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    var MOD = APP.registerModule("metric", {
        // Module title.
        title: "Simulation Metrics",

        // Module short title.
        shortTitle: "Metrics",

        // Module version.
        version : "0.1.0",

        // Module key aliases.
        keyAliases: ["metrics"],
    });

    // Module ready event handler.
    MOD.events.on("module:ready", function () {
        var ep;

        // Load setup data & fire event.
        ep = utils.getEndPoint(constants.urls.METRIC_SETUP);
        $.getJSON(ep, function (data) {
            MOD.events.trigger("state:setupDataLoaded", data);
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
