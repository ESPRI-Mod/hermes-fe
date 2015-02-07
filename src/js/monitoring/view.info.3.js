(function (APP, MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module helper vars.
    var PrimaryView,
        SecondaryView;

    // Primary view.
    PrimaryView = Backbone.View.extend({
        className : "alert alert-info",

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:newSimulation", this._onNewSimulation, this);
            MOD.events.on("state:simulationStatusUpdated", this._onSimulationStateChange, this);
            MOD.events.on("state:simulationTermination", this._onSimulationTermination, this);
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.InfoNotificationsView,
                MOD.views.InfoPagerView,
            ], {}, this);

            return this;
        },

        // Simulation state change event handler.
        // @eventData      Event data.
        _onSimulationStateChange: function (eventData) {
            this._setClassName(eventData.state);
        },

        // Simulation termination event handler.
        // @eventData      Event data.
        _onSimulationTermination: function (eventData) {
            this._setClassName(eventData.state);
        },

        // New simulation event handler.
        // @eventData      Event data.
        _onNewSimulation: function (eventData) {
            this._setClassName(eventData.simulation.executionState);
        },

        // Sets CSS class name based upon simulation execution state.
        // @executionStateSimulation execution state.
        _setClassName: function (state) {
            this.$el.attr("class", "alert alert-" + MOD.statesCSS[state]);
        }
    });

    // Secondary view.
    SecondaryView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "alert alert-warning",

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
        },

        // Backbone: view renderer.
        render : function () {
            this.$el.text("Filter returned no records - please refine");
            this.$el.hide();

            return this;
        },

        // Simulation list filtered event handler.
        _onSimulationListFiltered: function () {
            this.$el.hide();
        },

        // Simulation list null event handler.
        _onSimulationListNull: function () {
            this.$el.show();
        }
    });

    // Information panel view.
    MOD.views.InfoView2 = Backbone.View.extend({
        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                PrimaryView,
                SecondaryView
            ], {}, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.Backbone));
