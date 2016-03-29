(function (APP, MOD, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module initialisation event handler.
    MOD.events.on("module:initialization", function () {
        var ep;

        // Fetch page setup data.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH);
        ep  = ep.replace('{uid}', MOD.state.simulationUID);
        $.getJSON(ep, function (data) {
            MOD.log("page data fetched");
            MOD.events.trigger("setup:pageDataDownloaded", data);
        });
    });

}(
    this.APP,
    this.APP.modules.messages,
    this._,
    this.$
));
