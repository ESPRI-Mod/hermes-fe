(function (APP, MOD, constants, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: clear inter monitoring simulation selection.
    MOD.events.on("im:clear", function () {
        _.each(MOD.state.simulationList, function (simulation) {
            simulation.isSelectedForIM = false;
        });
        MOD.log("dsdsdsd");
    });

}(this.APP, this.APP.modules.monitoring, this.APP.constants, this._));
