(function (APP, MOD, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: websocket initialized.
    MOD.events.on("ws:initialized", function () {
        var ep;

        // Load setup data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.SETUP);
        $.getJSON(ep, function (data) {
            MOD.events.trigger("setup:dataDownloaded", data);
        });
    });

}(this.APP, this.APP.modules.monitoring, this.$jq));
