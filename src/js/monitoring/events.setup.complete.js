(function (MOD, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: setup complete.
    MOD.events.on("setup:complete", function () {
        // Render view.
        MOD.view = new MOD.views.MainView();
        MOD.view.render();

        // Update DOM.
        $(".app-content").append(MOD.view.$el);

        // Fire event.
        MOD.events.trigger("ui:initialized");
    });

}(
    this.APP.modules.monitoring,
    this.$jq
));
