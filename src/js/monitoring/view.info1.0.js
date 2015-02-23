(function (MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over notifications being received from server.
    MOD.views.InfoNotificationsView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName: "strong",

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:newSimulation", this._onNewSimulation, this);
            MOD.events.on("state:simulationStatusUpdated", this._onSimulationStateChange, this);
            MOD.events.on("state:simulationTermination", this._onSimulationTermination, this);
        },

        // Backbone: view renderer.
        render : function () {
            this.$el.text("Awaiting simulation events ...");

            return this;
        },

        // Simulation state change event handler.
        // @eventData      Event data.
        _onSimulationStateChange: function (eventData) {
            var text;

            text = "STATUS CHANGE @ {0} :: {1} changed from {2} to {3}";
            text = text.replace("{0}", eventData.eventTimestamp.slice(0, 19));
            text = text.replace("{1}", eventData.s.name);
            text = text.replace("{2}", eventData.statePrevious.toUpperCase());
            text = text.replace("{3}", eventData.state.toUpperCase());

            this.$el.text(text);
        },

        // Simulation termination event handler.
        // @ei      Event information.
        _onSimulationTermination: function (ei) {
            var text;

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

            text = "NEW SIMULATION @ {0} :: {1} is {2}";
            text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
            text = text.replace("{1}", ei.simulation.name);
            text = text.replace("{2}", ei.simulation.executionState.toUpperCase());

            this.$el.text(text);
        }
    });

}(this.APP.modules.monitoring, this.Backbone));
