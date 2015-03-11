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
            MOD.events.on("state:simulationStatusUpdated", this._onSimulationStateChange, this);
            MOD.events.on("state:simulationTermination", this._onSimulationTermination, this);
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

        // Simulation state change event handler.
        // @eventData      Event data.
        _onSimulationStateChange: function (eventData) {
            // Get row.
            var $s = this.$('#simulation-' + eventData.uid);

            // Update row css.
            this._updateClassName($s, eventData.statePrevious, eventData.state);
        },

        // Simulation termination event handler.
        // @eventData      Event data.
        _onSimulationTermination: function (eventData) {
            // Get row.
            var $s = this.$('#simulation-' + eventData.uid);

            // Update row css.
            this._updateClassName($s, eventData.statePrevious, eventData.state);

            // Update row fields.
            $s.find(".executionEndDate").text(eventData.s.executionEndDate);
        },

        // Simulation list filtered event handler.
        _onSimulationListFiltered: function () {
            this._renderPage();
        },

        // Simulation list null event handler.
        _onSimulationListNull: function () {
            this.$('tr').remove();
        },

        // Updates row CSS class name in response to a simulation execution state change.
        _updateClassName: function ($s, previousState, newState) {
            $s.removeClass(MOD.statesCSS[previousState]);
            $s.addClass(MOD.statesCSS[newState]);
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));
