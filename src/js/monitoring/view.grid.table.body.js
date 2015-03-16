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
            $s.addClass(MOD.statesCSS[eventData.s.executionState]);

            // Update row fields.
            $s.find(".executionEndDate").text(eventData.s.executionEndDate);
            console.log("SSS " + eventData.s.ext.jobCount);
            $s.find(".jobCount").text(eventData.s.ext.jobCount);
        },

        // Simulation list filtered event handler.
        _onSimulationListFiltered: function () {
            this._renderPage();
        },

        // Simulation list null event handler.
        _onSimulationListNull: function () {
            this.$('tr').remove();
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));
