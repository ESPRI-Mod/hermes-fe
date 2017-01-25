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
        MOD.log("ui initialized");

        // Fire events.
        MOD.events.trigger("view:initialized");
        APP.events.trigger("module:initialized", MOD);
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq
));
