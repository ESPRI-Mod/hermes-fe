(function (APP, MOD, _, $) {

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
        APP.utils.openURL(getMonitorURL(simulation), true);
    });

    // Event handler: clear inter monitoring simulation selection.
    MOD.events.on("im:clearInterMonitor", function () {
        _.each(MOD.state.simulationListForIM(), function (simulation) {
            simulation.isSelectedForIM = false;
        });
        $("td.interMonitoring > input").prop("checked", false);
    });

    // Event handler: open inter-monitoring link.
    MOD.events.on("im:openInterMonitor", function () {
        var simulationList, data;

        // Escape if there are no selected simulations.
        simulationList = MOD.state.simulationListForIM();
        if (simulationList.length <= 1) {
            return;
        }

        // Set data to be posted to inter-monitoring.
        data = _.map(simulationList, getMonitorURL);

        // Trigger event.
        MOD.events.trigger("im:postInterMonitorForm", data);
    });

}(this.APP, this.APP.modules.monitoring, this._, this.$jq));
