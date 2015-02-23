(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over simulation statistics.
    MOD.views.Info2StatsView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName: "strong",

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
        },

        // Backbone: view renderer.
        render : function () {
            this._setSimulationStatInfo();

            return this;
        },

        // Simulation list filtered event handler.
        _onSimulationListFiltered: function () {
            this._setSimulationStatInfo();
        },

        // Simulation list null event handler.
        _onSimulationListNull: function () {
            this._setSimulationStatInfo();
        },

        _setSimulationStatInfo: function () {
            var msg = "";

            msg += "Displaying ";
            msg += MOD.state.simulationListFiltered.length;
            msg += " of ";
            msg += MOD.state.simulationList.length;
            msg += " simulations.";
            this.$el.text(msg);
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this.Backbone
));
