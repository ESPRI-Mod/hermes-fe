(function (APP, MOD, _, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var getMonitorURL, getInterMonitorURL, getSimulationListForIM;

    // Gets list of simulations for inter-monitoring.
    getSimulationListForIM = function () {
        return _.filter(MOD.state.simulationList, function (s) {
            return s.ext.isSelectedForIM;
        });
    };

    // Helper function: returns simulation monitor URL.
    getMonitorURL = function (s) {
        var url;

        // Escape if simulation's compute node is not associated with a THREDDS server.
        if (_.has(MOD.urls.M, s.computeNode) === false) {
            return;
        }

        url = [MOD.urls.M[s.computeNode]];
        // CMIP6 is served at work_thredds not work.
        if (s.accountingProject.endsWith('cmip6')) {
            url[0] += '_thredds';
        }
        url.push(s.computeNodeLogin);
        if (s.modelRaw) {
            url.push(s.modelRaw);
        } else if (s.ext.modelSynonyms.length) {
            url.push(s.ext.modelSynonyms[0]);
        } else {
            url.push(s.model);
        }
        url.push(s.spaceRaw || s.space);
        url.push(s.experimentRaw || s.ext.experiment);
        url.push(s.name);
        url.push("MONITORING/index.html");
        url = url.join("/");

        return url;
    };

    // Helper function: returns simulation inter-monitor URL.
    getInterMonitorURL = function (s) {
        var url;

        // Escape if simulation is not associated with an inter-monitoring server.
        if (_.has(MOD.urls.IM, s.computeNode) === false) {
            return;
        }

        url = [MOD.urls.IM[s.computeNode]];
        url.push(s.computeNodeLogin);
        if (s.modelRaw) {
            url.push(s.modelRaw);
        } else if (s.ext.modelSynonyms.length) {
            url.push(s.ext.modelSynonyms[0]);
        } else {
            url.push(s.model);
        }
        url.push(s.spaceRaw || s.space);
        url.push(s.experimentRaw || s.ext.experiment);
        url.push(s.name);
        url = url.join("/");

        return url;
    };

    // Event handler: open monitor link.
    MOD.events.on("im:openMonitor", function (simulation) {
        APP.utils.openURL(getMonitorURL(simulation), true);
    });

    // Event handler: clear inter monitoring simulation selection.
    MOD.events.on("im:clearInterMonitor", function () {
        _.each(getSimulationListForIM(), function (simulation) {
            simulation.ext.isSelectedForIM = false;
        });
        $("td.inter-monitoring > input").prop("checked", false);
    });

    // Event handler: open inter-monitoring link.
    MOD.events.on("im:openInterMonitor", function () {
        var urls;

        urls = _.sortBy(_.map(getSimulationListForIM(), getInterMonitorURL));
        if (urls.length) {
            MOD.events.trigger("im:postInterMonitorForm", urls);
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.$jq));
