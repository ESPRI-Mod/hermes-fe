(function (APP, MOD, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: websocket initialized.
    MOD.events.on("ws:initialized", function () {
        var ep;

        // Load cv data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.CV);
        // ep = APP.utils.getTestServerEndPoint(MOD.urls.CV);
        $.getJSON(ep, function (data) {
            MOD.events.trigger("setup:cvDataDownloaded", data);
        });
    });

}(
    this.APP,
    this.APP.modules.simulation,
    this.$jq
));