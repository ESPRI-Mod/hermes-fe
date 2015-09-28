(function (APP, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    var
        MOD = APP.registerModule("messages", {
            // Module title.
            title: "Simulation Messages",

            // Module short title.
            shortTitle: "Messages",

            // Set of message types related to compute jobs.
            computeMessageTypes: [
                "0000", "0100", "1000", "1100", "9999"
            ],

            // Set of message types related to post processing jobs.
            postProcessingMessageTypes: [
                "2000", "2100", "2900", "3000", "3100", "3900"
            ],

            // Set of urls used across module.
            urls: {
                // Fetch simulation messages endpoint.
                FETCH: 'simulation/monitoring/fetch_messages?uid={uid}',

                // Simulation detail page.
                SIMULATION_DETAIL_PAGE: 'simulation.monitoring.one.html?hashid={hashid}&tryID={tryID}&uid={uid}',
            }
        }),

        // Page setup data download event handler.
        onPageSetUpDataDownloaded = function (data) {
            // Update module state.
            MOD.state.simulation = data.simulation;
            MOD.state.messageHistory = {
                all: data.messageHistory,
                compute: _.filter(data.messageHistory, function (m) {
                    return _.indexOf(MOD.computeMessageTypes, m.typeID) !== -1;
                }),
                postProcessing: _.filter(data.messageHistory, function (m) {
                    return _.indexOf(MOD.postProcessingMessageTypes, m.typeID) !== -1;
                })
            };

            // // Render main view.
            MOD.view = new MOD.views.MainView();
            MOD.view.render();

            // // Update DOM.
            $(".app-content").append(MOD.view.$el);

            // Fire events.
            APP.events.trigger("module:initialized", MOD);
        };

    // Module view state.
    MOD.state = {
        // Application pointer.
        APP: APP,

        // Module pointer.
        MOD: MOD,

        // Copyright year.
        year: new Date().getFullYear(),

        // Simulation.
        simulation: null,

        // Simulation hash identifier.
        simulationUID: APP.utils.getURLParam('simulationUID'),

        // Simulation message history.
        messageHistory: {
            all: [],
            compute: [],
            postProcessing: []
        }
    };

    // Module initialisation event handler.
    MOD.events.on("module:initialization", function () {
        var ep;

        // Fetch page setup data.
        ep = APP.utils.getEndPoint(MOD.urls.FETCH);
        ep  = ep.replace('{uid}', MOD.state.simulationUID);
        $.getJSON(ep, onPageSetUpDataDownloaded);
    });

}(
    this.APP,
    this._,
    this.$
));



