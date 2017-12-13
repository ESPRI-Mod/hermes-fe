(function (APP, MOD, window, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: page data downloaded.
    MOD.events.on("setup:pageDataDownloaded", function (data) {
        // Map tuples to JSON objects.
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
    });

}(
    this.APP,
    this.APP.modules.messages,
    this.window,
    this._,
    this.$
));
