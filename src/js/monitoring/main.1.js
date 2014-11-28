(function (APP, MOD, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Websocket initialized event handler.
    MOD.events.on("ws:initialized", function () {
        var ep;

        // Load setup data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.MONITORING_SETUP);
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

}(this.APP, this.APP.modules.monitoring, this.$jq));
