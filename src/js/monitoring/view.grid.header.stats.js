(function (MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Grid header stats view.
    MOD.views.GridHeaderStatsView = Backbone.View.extend({
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
    this.APP.modules.monitoring,
    this.Backbone
));
