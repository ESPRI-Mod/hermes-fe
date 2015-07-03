(function (APP, MOD, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: CV data downloaded.
    MOD.events.on("setup:cvDataDownloaded", function (data) {
        var ep;

        // Cache CV terms.
        _.extend(MOD.state, {
            cvTerms: data.cvTerms
        });

        // Load page data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.SETUP_ONE);
        ep = ep.replace("{uid}", MOD.state.simulationUID);
        $.getJSON(ep, function (data) {
            MOD.events.trigger("setup:pageDataDownloaded", data);
        });
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq,
    this._
));
