(function (APP, MOD, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: setup complete.
    MOD.events.on("setup:complete", function () {

        // Render main view.
        MOD.view = new MOD.views.MainView();
        MOD.view.render();

        // Update DOM.
        $(".app-content").append(MOD.view.$el);

        // Fire events.
        MOD.events.trigger("ui:initialized");
        APP.events.trigger("module:initialized", MOD);
    });

    // Event handler: websocket initialized.
    MOD.events.on("ws:initialized", function () {
        var ep;

        // Load cv data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH_CV);
        $.getJSON(ep, function (data) {
            MOD.events.trigger("setup:cvTermsLoaded", data);
        });
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq
));
