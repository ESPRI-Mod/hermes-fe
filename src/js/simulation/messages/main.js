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
                "0000", "0100", "1000", "1100", "1900", "1999"
            ],

            // Set of message types related to post processing jobs.
            postProcessingMessageTypes: [
                "2000", "2100", "2900", "2999", "3000", "3100", "3900", "3999"
            ],

            // Map of message types to descriptions.
            messageTypeDescriptions: {
                "compute": "Compute",
                "post-processing": "Post Processing",
                "post-processing-from-checker": "Post Processing (from checker)"
            },


            // Returns flag indicating whether the messages is a compute message or not.
            isComputeMessage: function (msg) {
                return _.indexOf(MOD.computeMessageTypes, msg.typeID) !== -1;
            },

            // Returns flag indicating whether the messages is a post-processing message or not.
            isPostProcessingMessage: function (msg) {
                return _.indexOf(MOD.postProcessingMessageTypes, msg.typeID) !== -1;
            },

            // Set of urls used across module.
            urls: {
                // Fetch simulation messages endpoint.
                FETCH: 'simulation/monitoring/fetch_messages?uid={uid}',

                // Simulation detail page.
                SIMULATION_DETAIL_PAGE: 'simulation.detail.html?uid={uid}',
            }
        }),

        // Page setup data download event handler.
        onPageSetUpDataDownloaded = function (data) {
            // Map downloaded message history data.
            data.messageHistory = _.map(data.messageHistory, MOD.mapMessage);

            // Parse downloaded message history data.
            _.each(data.messageHistory, MOD.parseMessage);

            // Update module state.
            MOD.state.simulation = data.simulation;
            MOD.state.messageHistory = {
                all: data.messageHistory,
                compute: {
                    all: _.filter(data.messageHistory, function (m) {
                        return MOD.isComputeMessage(m) === true;
                    })
                },
                postProcessing: {
                    all: _.filter(data.messageHistory, function (m) {
                        return MOD.isPostProcessingMessage(m) === true;
                    })
                }
            };

            // Set initial message collection paging state.
            MOD.setMessageSetPagination(MOD.state.messageHistory.compute);
            MOD.setMessageSetPagination(MOD.state.messageHistory.postProcessing);

            // // Render main view.
            MOD.view = new MOD.views.MainView();
            MOD.view.render();
            $(".app-content").append(MOD.view.$el);

            // Fire events.
            APP.events.trigger("module:initialized", MOD);
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
