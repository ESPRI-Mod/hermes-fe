(function (APP, MOD, STATE, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Fetches simulation data from server.
    MOD.fetchSimulationTimeSlice = function (triggerBackgroundEvents) {
        var ep;

        // Signal (web-socket event buffering).
        MOD.events.trigger("ws:buffering");

        // Signal (background processing).
        if (triggerBackgroundEvents === true) {
            APP.events.trigger("module:processingStarts", {
                module: MOD,
                info: 'Fetching data'
            });
        }

        // Fetch data from web-service.
        MOD.events.trigger("simulationTimesliceFetching");
        ep = APP.utils.getEndPoint(MOD.urls.FETCH_TIMESLICE);
        ep  = ep.replace('{timeslice}', STATE.filters[0].cvTerms.current.name);
        $.getJSON(ep, function (data) {
            // Signal.
            MOD.events.trigger("simulationTimesliceFetched", data);

            // Signal (background processing end).
            if (triggerBackgroundEvents === true) {
                setTimeout(function () {
                    APP.events.trigger("module:processingEnds");
                }, 250);
            }

            // Signal (web-socket event reactivation).
            MOD.events.trigger("ws:activating", this);
        });
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
    this.$jq
));
