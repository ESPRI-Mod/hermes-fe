(function (APP, MOD, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Fetches a timeslice of data from server & fire relevant event.
    MOD.fetchTimeSlice = function (triggerBackgroundEvents) {
        var ep, timeslice;

        // Display user information.
        if (triggerBackgroundEvents === true) {
            APP.events.trigger("module:processingStarts", {
                module: MOD,
                info: 'Fetching data'
            });
        }

        // Get current timeslice.
        timeslice = MOD.state.filters[0].cvTerms.current.name;

        // Set fetch endpoint.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH_TIMESLICE);
        ep  = ep.replace('{timeslice}', timeslice);

        // Fetch data from web-service.
        MOD.log("timeslice fetching begins");
        $.getJSON(ep, function (data) {
            MOD.log("timeslice fetched");
            MOD.events.trigger("state:timesliceLoaded", data);
            if (triggerBackgroundEvents === true) {
                setTimeout(function () {
                    APP.events.trigger("module:processingEnds");
                }, 250);
            }
        });
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$jq
));
