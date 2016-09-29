(function (APP, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    var MOD = APP.registerModule("messages", {
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
            "c": "Compute",
            "pp": "Post Processing"
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
    });

}(
    this.APP,
    this._,
    this.$
));
