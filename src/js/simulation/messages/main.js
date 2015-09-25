(function (APP) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare module.
    APP.registerModule("messages", {
        // Module title.
        title: "Simulation Messages",

        // Module short title.
        shortTitle: "Messages",

        // Module key aliases.
        keyAliases: [],

        // Set of message types related to compute jobs.
        computeMessageTypes: [
            "0000", "0100", "1000", "1100", "9999"
        ],

        // Set of message types related to post processing jobs.
        postProcessingMessageTypes: [
            "2000", "2100", "2900", "3000", "3100", "3900"
        ]
    });
}(
    this.APP
));

(function (APP, MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.urls = {
        // Fetch simulation messages endpoint.
        FETCH: 'simulation/monitoring/fetch_messages?uid={uid}',

        // Simulation detail page.
        SIMULATION_DETAIL_PAGE: 'simulation.monitoring.one.html?hashid={hashid}&tryID={tryID}&uid={uid}',
    };

    // Module state.
    MOD.state = {
        // Simulation.
        simulation: null,

        // Simulation hash identifier.
        simulationUID: APP.utils.getURLParam('uid'),

        // Simulation message history.
        messageHistory: {
            all: [],
            compute: [],
            postProcessing: []
        }
    };

}(
    this.APP,
    this.APP.modules.messages
));
