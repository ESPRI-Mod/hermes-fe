(function (APP, MOD, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var getMonitorURL, getInterMonitorURL;

    // Helper function: returns simulation monitor URL.
    getMonitorURL = function (simulation) {
        var url = [];

        // Escape if simulation is not associated with a THREDDS server.
        if (_.isUndefined(simulation.ext.mURL)) {
            return;
        }

        url.push(simulation.ext.mURL);
        url.push(simulation.computeNodeLogin);
        if (simulation.ext.modelSynonyms.length) {
            url.push(simulation.ext.modelSynonyms[0]);
        } else {
            url.push(simulation.modelRaw || simulation.model);
        }
        url.push(simulation.spaceRaw || simulation.space);
        url.push(simulation.experimentRaw || simulation.ext.experiment);
        url.push(simulation.name);
        url.push("MONITORING/index.html");

        return url.join("/");
    };

    // Helper function: returns simulation inter-monitor URL.
    getInterMonitorURL = function (simulation) {
        var url = [];

        // Escape if simulation is not associated with an inter-monitoring server.
        if (_.isUndefined(simulation.ext.imURL)) {
            return;
        }

        url.push(simulation.ext.imURL);
        url.push(simulation.computeNodeLogin);
        if (simulation.ext.modelSynonyms.length) {
            url.push(simulation.ext.modelSynonyms[0]);
        } else {
            url.push(simulation.modelRaw || simulation.model);
        }
        url.push(simulation.spaceRaw || simulation.space);
        url.push(simulation.experimentRaw || simulation.ext.experiment);
        url.push(simulation.name);

        return url.join("/");
    };

    // Event handler: open monitor link.
    MOD.events.on("im:openMonitor", function (simulation) {
        APP.utils.openURL(getMonitorURL(simulation), true);
    });

    // Event handler: clear inter monitoring simulation selection.
    MOD.events.on("im:clearInterMonitor", function () {
        _.each(MOD.getSimulationListForIM(), function (simulation) {
            simulation.ext.isSelectedForIM = false;
        });
        $("td.interMonitoring > input").prop("checked", false);
    });

    // Event handler: open inter-monitoring link.
    MOD.events.on("im:openInterMonitor", function () {
        var simulationList, data;

        // Escape if there are no selected simulations.
        simulationList = MOD.getSimulationListForIM();
        if (simulationList.length <= 1) {
            return;
        }

        // Set data to be posted to inter-monitoring.
        data = _.sortBy(_.map(simulationList, getInterMonitorURL));

        // Trigger event.
        MOD.events.trigger("im:postInterMonitorForm", data);
    });

}(this.APP, this.APP.modules.monitoring, this._, this.$jq));
