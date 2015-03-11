(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Web socket notifications view.
    MOD.views.WebSocketNotifications = Backbone.View.extend({
        className : "alert alert-info",

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:newSimulation", this._onNewSimulation, this);
            MOD.events.on("state:simulationStatusUpdated", this._onSimulationStateChange, this);
            MOD.events.on("state:simulationTermination", this._onSimulationTermination, this);
        },

        // Backbone: view renderer.
        render : function () {
            this.$el.append(TEMPLATES.notifications());

            return this;
        },

        // Simulation state change event handler.
        // @ei      Event information.
        _onSimulationStateChange: function (ei) {
            var text;

            this._setClassName(ei.state);

            text = "STATUS CHANGE @ {0} :: {1} changed from {2} to {3}";
            text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
            text = text.replace("{1}", ei.s.name);
            text = text.replace("{2}", ei.statePrevious.toUpperCase());
            text = text.replace("{3}", ei.state.toUpperCase());
            this.$el.text(text);
        },

        // Simulation termination event handler.
        // @ei      Event information.
        _onSimulationTermination: function (ei) {
            var text;

            this._setClassName(ei.state);

            text = "SIMULATION TERMINATED @ {0} :: {1} changed from {2} to {3}";
            text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
            text = text.replace("{1}", ei.s.name);
            text = text.replace("{2}", ei.statePrevious.toUpperCase());
            text = text.replace("{3}", ei.state.toUpperCase());
            this.$el.text(text);
        },

        // New simulation event handler.
        // @ei      Event information.
        _onNewSimulation: function (ei) {
            var text;

            this._setClassName(ei.simulation.executionState);

            text = "NEW SIMULATION @ {0} :: {1} is {2}";
            text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
            text = text.replace("{1}", ei.simulation.name);
            text = text.replace("{2}", ei.simulation.executionState.toUpperCase());
            this.$el.text(text);
        },

        // Sets CSS class name based upon simulation execution state.
        // @executionStateSimulation execution state.
        _setClassName: function (state) {
            this.$el.attr("class", "alert alert-" + MOD.statesCSS[state]);
        }
    });
}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this.Backbone
));
