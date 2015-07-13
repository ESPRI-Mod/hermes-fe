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

        // Initialise filter state.
        _.each(MOD.state.filters, MOD.initFilterState);

        // Fetch timeslice & fire event.
        MOD.fetchTimeSlice("state:timesliceLoaded");
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq,
    this._
));
