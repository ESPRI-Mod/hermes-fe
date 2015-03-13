(function (APP, MOD, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var getMonitorURL, getInterMonitorURL;

    // Helper function: returns simulation monitor URL.
    getMonitorURL = function (simulation) {
        var url = [];

        // Escape if simulation is not associated with a THREDDS server.
        if (_.isUndefined(simulation.ext.threddsServerUrl)) {
            return;
        }

        url.push(simulation.ext.threddsServerUrl);
        url.push(simulation.computeNodeLogin);
        if (simulation.ext.modelSynonyms.length) {
            url.push(simulation.ext.modelSynonyms[0].toUpperCase());
        } else {
            url.push(simulation.model.toUpperCase());
        }
        url.push(simulation.space.toUpperCase());
        url.push(simulation.ext.experiment);
        url.push(simulation.name);
        url.push("MONITORING/index.html");

        return url.join("/");
    };

    // Helper function: returns simulation inter-monitor URL.
    getInterMonitorURL = function (simulation) {
        var url = [];

        // Escape if simulation is not associated with a DODS server.
        if (_.isUndefined(simulation.ext.dodsServerUrl)) {
            return;
        }

        url.push(simulation.ext.dodsServerUrl);
        url.push(simulation.computeNodeLogin);
        if (simulation.ext.modelSynonyms.length) {
            url.push(simulation.ext.modelSynonyms[0].toUpperCase());
        } else {
            url.push(simulation.model.toUpperCase());
        }
        url.push(simulation.space.toUpperCase());
        url.push(simulation.ext.experiment);
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
