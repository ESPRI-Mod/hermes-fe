(function (APP, MOD, STATE, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Fetches simulation data from server.
    MOD.fetchSimulationTimeSlice = function (triggerBackgroundEvents) {
        var ep;

        // Signal that background processing is starting.
        if (triggerBackgroundEvents === true) {
            APP.events.trigger("module:processingStarts", {
                module: MOD,
                info: 'Fetching data'
            });
        }

        // Set fetch endpoint.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH_TIMESLICE);
        ep  = ep.replace('{timeslice}', STATE.filters[0].cvTerms.current.name);
        ep  = ep.replace('{sortField}', STATE.sorting.field);
        ep  = ep.replace('{sortDirection}', STATE.sorting.direction);

        // Fetch data from web-service.
        MOD.log("simulations fetching begins");
        $.getJSON(ep, function (data) {
            // Signal that timeslice has been fetched.
            MOD.log("simulations fetched");
            MOD.events.trigger("state:simulationTimesliceLoaded", data);

            // Signal that background processing has ended.
            if (triggerBackgroundEvents === true) {
                setTimeout(function () {
                    APP.events.trigger("module:processingEnds");
                }, 250);
            }

            // Fetch full job timeslice (if necessary).
            if (data.simulationList.length > 300) {
                MOD.fetchJobTimeSlice(false);
            }
        });
    };

    // Fetches job data from server.
    MOD.fetchJobTimeSlice = function (triggerBackgroundEvents) {
        var ep;

        // Signal that background processing is starting.
        if (triggerBackgroundEvents === true) {
            APP.events.trigger("module:processingStarts", {
                module: MOD,
                info: 'Fetching data'
            });
        }

        // Set fetch endpoint.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH_TIMESLICE_JOBS);
        ep  = ep.replace('{timeslice}', STATE.filters[0].cvTerms.current.name);

        // Fetch data from web-service.
        MOD.log("jobs fetching begins");
        $.getJSON(ep, function (data) {
            // Signal that timeslice has been fetched.
            MOD.log("jobs fetched");
            MOD.events.trigger("state:jobTimesliceLoaded", data);

            // Signal that background processing has ended.
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
    this.APP.modules.monitoring.state,
    this.$jq
));
