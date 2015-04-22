(function (APP, MOD, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over the grid table body.
    MOD.views.GridTableBodyView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tbody",

        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);

            MOD.events.on("state:simulationStart", this._onSimulationStart, this);
            MOD.events.on("state:simulationComplete", this._onSimulationComplete, this);
            MOD.events.on("state:simulationError", this._onSimulationError, this);
            MOD.events.on("state:jobStart", this._onJobStart, this);
            MOD.events.on("state:jobComplete", this._onJobComplete, this);
            MOD.events.on("state:jobError", this._onJobError, this);

            MOD.events.on("state:simulationStatusUpdate", this._onSimulationStateUpdate, this);
            MOD.events.on("ui:pagination", this._renderPage, this);
        },

        // Backbone: view renderer.
        render : function () {
            this._renderPage();

            return this;
        },

        // Renders current page.
        _renderPage : function () {
            var paging;

            // Remove previous.
            this.$('tr').remove();

            // Render new.
            paging = MOD.state.paging;
            if (paging.current) {
                _.each(paging.current.data, this._renderRow, this);
            }
        },

        // Renders a row.
        _renderRow : function (simulation) {
            APP.utils.render(MOD.views.GridTableRowView, {
                model : simulation
            }, this);
        },

        // Simulation state update event handler.
        // @eventData      Event data.
        _onSimulationStateUpdate: function (eventData) {
            // Get row.
            var $s = this.$('#simulation-' + eventData.s.uid);

            // Update row css.
            $s.removeClass(MOD.statesCSS[eventData.statePrevious]);
            $s.addClass(MOD.statesCSS[eventData.s.ext.executionState]);

            // Update row fields.
            $s.find(".executionEndDate").text(eventData.s.executionEndDate);
            $s.find(".jobCount").text(eventData.s.ext.jobCount);
            if (eventData.s.ext.hasLateJob) {
                $s.find(".jobCount").addClass('bg-danger');
            } else {
                $s.find(".jobCount").removeClass('bg-danger');
            }
        },

        // Simulation list filtered event handler.
        _onSimulationListFiltered: function () {
            this._renderPage();
        },

        // Simulation list null event handler.
        _onSimulationListNull: function () {
            this.$('tr').remove();
        },

        // Updates a row in response to a simulation related event.
        _updateRow: function (ei) {
            // Get row.
            var $s = this.$('#simulation-' + ei.simulation.uid);

            $s.find(".jobCount").text(ei.simulation.ext.jobCount);
        },

        // Simulation start event handler.
        // @ei      Event information.
        _onSimulationStart: function (ei) {
            this._updateRow(ei);
        },

        // Simulation complete event handler.
        // @ei      Event information.
        _onSimulationComplete: function (ei) {
            this._updateRow(ei);
        },

        // Simulation error event handler.
        // @ei      Event information.
        _onSimulationError: function (ei) {
            this._updateRow(ei);
        },

        // Job start event handler.
        // @ei      Event information.
        _onJobStart: function (ei) {
            this._updateRow(ei);
        },

        // Job complete event handler.
        // @ei      Event information.
        _onJobComplete: function (ei) {
            this._updateRow(ei);
        },

        // Job error event handler.
        // @ei      Event information.
        _onJobError: function (ei) {
            this._updateRow(ei);
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));
