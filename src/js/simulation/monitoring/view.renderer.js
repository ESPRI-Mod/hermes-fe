(function (APP, MOD, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: simulation list initialized.
    MOD.events.on("simulationTimesliceUpdated", function () {
        // Escape if already rendered.
        if (MOD.view) {
            return;
        }

        // Render main view.
        MOD.view = new MOD.views.MainView();
        MOD.view.render();

        // Update DOM.
        $(".app-content").append(MOD.view.$el);

        // Fire events.
        MOD.events.trigger("view:initialized");
        APP.events.trigger("module:initialized", MOD);
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq
));
