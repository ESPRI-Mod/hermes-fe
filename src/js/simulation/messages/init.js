(function (APP, MOD, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Page setup data download event handler.
    var onPageSetUpDataDownloaded = function (data) {
        // Update module state.
        MOD.state.messageHistory.all = data.messageHistory;
        MOD.state.messageHistory.compute = _.filter(data.messageHistory, function (m) {
            return _.indexOf(MOD.computeMessageTypes, m.typeID) !== -1;
        });
        MOD.state.messageHistory.postProcessing = _.filter(data.messageHistory, function (m) {
            return _.indexOf(MOD.postProcessingMessageTypes, m.typeID) !== -1;
        });
        MOD.state.simulation = data.simulation;

        // // Render main view.
        MOD.view = new MOD.views.MainView();
        MOD.view.render();

        // // Update DOM.
        $(".app-content").append(MOD.view.$el);

        // Fire events.
        MOD.events.trigger("ui:initialized");
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
    this.APP.modules.messages,
    this._,
    this.$
));


