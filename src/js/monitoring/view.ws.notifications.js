(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Web socket notifications view.
    MOD.views.WebSocketNotifications = Backbone.View.extend({
        className : "alert monitoring-state-running",

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:simulationStart", this._onSimulationStart, this);
            MOD.events.on("state:simulationComplete", this._onSimulationComplete, this);
            MOD.events.on("state:simulationError", this._onSimulationError, this);
            MOD.events.on("state:jobStart", this._onJobStart, this);
            MOD.events.on("state:jobComplete", this._onJobComplete, this);
            MOD.events.on("state:jobError", this._onJobError, this);
        },

        // Backbone: view renderer.
        render : function () {
            this.$el.append(TEMPLATES.notifications());

            return this;
        },

        // Updates view.
        _update: function (ei, prefix) {
            var text;

            this.$el.attr("class", "alert " + MOD.statesCSS[ei.simulation.ext.executionState]);
            text = prefix + " @ {0} :: Simulation {1} is {2}";
            text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
            text = text.replace("{1}", ei.simulation.name);
            text = text.replace("{2}", ei.simulation.ext.executionState.toUpperCase());
            this.$('strong').text(text);
        },

        // Simulation start event handler.
        // @ei      Event information.
        _onSimulationStart: function (ei) {
            if (ei.simulation.isRestart) {
                this._update(ei, "SIMULATED RESTARTED");
            } else {
                this._update(ei, "SIMULATED STARTED");
            }
        },

        // Simulation complete event handler.
        // @ei      Event information.
        _onSimulationComplete: function (ei) {
            this._update(ei, "SIMULATED COMPLETED");
        },

        // Simulation error event handler.
        // @ei      Event information.
        _onSimulationError: function (ei) {
            this._update(ei, "SIMULATED TERMINATED IN ERROR !!!");
        },

        // Job start event handler.
        // @ei      Event information.
        _onJobStart: function (ei) {
            this._update(ei, "JOB STARTED");
        },

        // Job complete event handler.
        // @ei      Event information.
        _onJobComplete: function (ei) {
            this._update(ei, "JOB COMPLETE");
        },

        // Job error event handler.
        // @ei      Event information.
        _onJobError: function (ei) {
            this._update(ei, "JOB TERMINATED IN ERROR !!!");
        }
    });
}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this.Backbone
));
