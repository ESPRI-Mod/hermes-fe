(function (APP, MOD, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: websocket initialized.
    MOD.events.on("ws:initialized", function () {
        var ep;

        // Load cv data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH_CV);
        $.getJSON(ep, function (data) {
            MOD.log("cv fetched");
            MOD.events.trigger("setup:cvDataLoaded", data);
        });
    });

    // Event handler: setup complete.
    MOD.events.on("setup:complete", function () {

        // Render main view.
        MOD.view = new MOD.views.MainView();
        MOD.view.render();

        // Update DOM.
        $(".app-content").append(MOD.view.$el);
        MOD.log("ui initialized");

        // Fire events.
        MOD.events.trigger("ui:initialized");
        APP.events.trigger("module:initialized", MOD);
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq
));
