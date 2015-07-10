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

            MOD.events.on("state:simulationStart", this._onMonitoringEvent, this);
            MOD.events.on("state:simulationComplete", this._onMonitoringEvent, this);
            MOD.events.on("state:simulationError", this._onMonitoringEvent, this);
            MOD.events.on("state:jobStart", this._onMonitoringEvent, this);
            MOD.events.on("state:jobComplete", this._onMonitoringEvent, this);
            MOD.events.on("state:jobError", this._onMonitoringEvent, this);

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
            // Remove previous.
            this.$('tr').remove();

            // Render new.
            if (MOD.state.paging.current) {
                _.each(MOD.state.paging.current.data, this._renderRow, this);
            }
        },

        // Renders a row.
        _renderRow : function (simulation) {
            APP.utils.render(MOD.views.GridTableRowView, {
                model : simulation
            }, this);
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
            var $s;

            $s = this.$('#simulation-' + ei.simulation.uid);
            if ($s) {
                console.log('INFO: updating table row');
                // Update row css.
                _.each(MOD.statesCSS, function (stateCSS)  {
                    $s.removeClass(stateCSS);
                });
                $s.addClass(MOD.getStateCSS(ei.simulation.executionState));

                // Update row fields.
                $s.find(".executionEndDate").text(ei.simulation.executionEndDate);
                $s.find(".jobCount").text(ei.simulation.jobs.global.all.length);
                if (ei.simulation.jobs.compute.hasLate) {
                    $s.find(".jobCount").addClass('bg-danger');
                } else {
                    $s.find(".jobCount").removeClass('bg-danger');
                }
            } else {
                console.log('WARNING: could not find table row');
            }
        },

        // Monitoring event handler.
        // @ei      Event information.
        _onMonitoringEvent: function (ei) {
            this._updateRow(ei);
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));
