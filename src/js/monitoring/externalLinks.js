// --------------------------------------------------------
// monitoring/externalLinks.js
// Manages external linking from monitoring page.
// --------------------------------------------------------
(function(APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Helper function: returns DODS server URL used for IPSL monitoring purposes.
    var getDodsServerURL = function (simulation) {
        var cnode;

        cnode = _.find(MOD.state.computeNodeList, function (cnode) {
            return cnode.id === simulation.computeNodeID;
        });

        return cnode && cnode.dodsServerUrl ? cnode.dodsServerUrl : undefined;
    };

    // Event handler: open inter-monitoring link.
    MOD.events.on("intermonitoring:open-monitoring", function (simulation) {
        var serverURL, url = [];

        // Escape if server URL is unspecified.
        serverURL = getDodsServerURL(simulation);
        if (_.isUndefined(serverURL)) {
            return;
        }

        // Construct monitoring link.
        url.push(serverURL);
        url.push(simulation.computeNodeLogin[0]);
        url.push(simulation.model);
        url.push(simulation.space);
        url.push(simulation.experiment);
        url.push(simulation.name);
        url.push("MONITORING/index.html");
        url = url.join("/");
        MOD.log("UI :: open monitoring hyperlink: " + url);

        // Open link in new window.
        APP.utils.openURL(url, true);
    });

}(this.APP, this.APP.modules.monitoring, this._));
