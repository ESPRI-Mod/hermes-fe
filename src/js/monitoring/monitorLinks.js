(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Helper function: returns simulation monitor URL.
    var getMonitorURL = function (simulation) {
        var url = [];

        // Escape if simulation is not associated with a DODS server.
        if (_.isUndefined(simulation.dodsServerUrl)) {
            return;
        }

        url.push(simulation.dodsServerUrl);
        url.push(simulation.computeNodeLogin);
        if (simulation.modelSynonyms.length > 0) {
            url.push(simulation.modelSynonyms[0].toUpperCase());
        } else {
            url.push(simulation.model.toUpperCase());
        }
        url.push(simulation.space.toUpperCase());
        url.push(simulation.experiment);
        url.push(simulation.name);
        url.push("MONITORING/index.html");

        return url.join("/");
    };

    // Event handler: open monitor link.
    MOD.events.on("im:openMonitor", function (simulation) {
        var url;

        url = getMonitorURL(simulation);
        if (url) {
            APP.utils.openURL(url, true);
        }
    });

    // Event handler: open inter-monitoring link.
    MOD.events.on("im:openInterMonitor", function () {
        var simulationList;

        // Escape if there are no selected simulations.
        simulationList = _.filter(MOD.state.simulationList, function (simulation) {
            return simulation.isSelectedForIM;
        });
        if (simulationList.length <= 1) {
            return;
        }

        alert("TODO :: intermonitoring link");

        MOD.log("UI :: open inter-monitoring hyperlink " + simulationList.length);
    });

}(this.APP, this.APP.modules.monitoring, this._));
