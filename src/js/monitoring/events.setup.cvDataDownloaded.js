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

        // Load main data & fire event.
        ep = APP.utils.getEndPoint(MOD.urls.SETUP);
        $.getJSON(ep, function (data) {
            MOD.events.trigger("setup:mainDataDownloaded", data);
        });
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq,
    this._
));
