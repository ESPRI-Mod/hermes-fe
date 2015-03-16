(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Web socket notifications view.
    MOD.views.WebSocketNotifications = Backbone.View.extend({
        className : "alert monitoring-state-running",

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:newSimulation", this._onNewSimulation, this);
            MOD.events.on("state:simulationStatusUpdate", this._onSimulationStateUpdate, this);
        },

        // Backbone: view renderer.
        render : function () {
            this.$el.append(TEMPLATES.notifications());

            return this;
        },

        // Simulation state update event handler.
        // @ei      Event information.
        _onSimulationStateUpdate: function (ei) {
            var text;

            if (ei.s.executionState === ei.statePrevious) {
                return;
            }

            this._setClassName(ei.s.executionState);
            text = "STATUS CHANGE @ {0} :: {1} changed from {2} to {3}";
            text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
            text = text.replace("{1}", ei.s.name);
            text = text.replace("{2}", ei.statePrevious.toUpperCase());
            text = text.replace("{3}", ei.s.executionState.toUpperCase());
            this.$('strong').text(text);
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
            this.$('strong').text(text);
        },

        // Sets CSS class name based upon simulation execution state.
        // @executionStateSimulation execution state.
        _setClassName: function (state) {
            this.$el.attr("class", "alert " + MOD.statesCSS[state]);
        }
    });
}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this.Backbone
));
