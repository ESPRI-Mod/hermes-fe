(function (APP, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var ep;

    // Load cv data & fire event.
    ep = APP.utils.getEndPoint('cv/fetch');
    $.getJSON(ep, function (data) {
        console.log("cv fetched");
        APP.events.trigger("fetch:cvDataLoaded", data);
    });

    // Controlled vocabularies loaded event handler.
    // @data    Data loaded from remote server.
    APP.events.on("fetch:cvDataLoaded", function (data) {
        // Update module state.
        APP.state.cvTerms = APP.utils.parseCVTerms(data.cvTerms);

        // Initialise filter cv terms sets.
        APP.initFilterCvTermsets();

        APP.events.trigger("fetch:cvDataParsed", data);
    });

}(
    this.APP,
    this.$,
    this._
));
