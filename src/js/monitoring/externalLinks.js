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
        var url, parts = [];

        // Get server URL.
        url = getDodsServerURL(simulation);
        alert(url);
        if (_.isUndefined(url)) {
            // TODO - inform user.
            return;
        }

        // Construct monitoring link.
        parts.push(url);
        parts.push(simulation.computeNodeLogin[0]);
        parts.push(simulation.model);
        parts.push(simulation.space);
        parts.push(simulation.experiment);
        parts.push(simulation.name);
        parts.push("MONITORING");

        // Open link in new window.
        APP.utils.openURL(parts.join("/"), true);
    });

}(this.APP, this.APP.modules.monitoring, this._));
