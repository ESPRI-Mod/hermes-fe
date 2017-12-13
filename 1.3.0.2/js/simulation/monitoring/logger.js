(function (APP, MOD, STATE, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.events.on("cv:dataFetched", function () {
        MOD.log("CV: data fetched");
    });

    MOD.events.on("view:initialized", function () {
        MOD.log("UI: initialized");
    });
    MOD.events.on("view:permalinkUpdated", function () {
        MOD.log("UI: permalink updated");
    });

    MOD.events.on("ws:jobUpdating", function () {
        MOD.log("WS: job updating");
    });
    MOD.events.on("ws:jobPeriodUpdating", function () {
        MOD.log("WS: job period updating");
    });
    MOD.events.on("ws:simulationUpdating", function () {
        MOD.log("WS: simulation updating");
    });

    MOD.events.on("simulationTimesliceFetching", function () {
        MOD.log("STS: fetching begins");
    });
    MOD.events.on("simulationTimesliceFetched", function () {
        MOD.log("STS: fetched");
    });
    MOD.events.on("simulationTimesliceAssigned", function () {
        MOD.log("STS: assigned to module state");
    });

    MOD.events.on("simulationTimesliceParsing", function () {
        MOD.log("STS: parsing begins");
    });
    MOD.events.on("simulationTimesliceExtended", function () {
        MOD.log("STS: extended");
    });
    MOD.events.on("simulationTimesliceJobsParsed", function () {
        MOD.log("STS: jobs parsed");
    });
    MOD.events.on("simulationTimesliceEndDateAssigned", function () {
        MOD.log("STS: end dates assigned");
    });
    MOD.events.on("simulationTimesliceExecutionStateAssigned", function () {
        MOD.log("STS: execution states assigned");
    });
    MOD.events.on("simulationTimesliceParsed", function () {
        MOD.log("STS: parsed");
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state,
    this.$jq
));
