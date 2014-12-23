(function (APP, MOD, TEMPLATES, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module helper vars.
    var GridTableHeaderView,
        GridTableRowView,
        GridTableBodyView;

    // View over the grid table header.
    GridTableHeaderView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "thead",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.header, {}, this);

            return this;
        }
    });

    // View over a grid table row.
    GridTableRowView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tr",

        // Backbone: view CSS class.
        className : function () {
            return MOD.statesCSS[this.model.executionState];
        },

        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                id: 'simulation-' + this.model.uid
            };
        },

        // Backbone: view event handlers.
        events : {
            'click > td.linkToMonitoring' : function () {
                MOD.events.trigger("intermonitoring:open-monitoring", this.model);
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.row, this.model, this);

            return this;
        }
    });

    // View over the grid table body.
    GridTableBodyView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tbody",

        // Backbone: view initializer.
        initialize: function () {
            // MOD.events.on("state:newSimulation", this._onNewSimulation, this);
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
            APP.utils.render(GridTableRowView, {
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

        // New simulation event handler.
        // @ei      Event information.
        _onNewSimulation: function () {
            this._renderPage();
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

    // View over the grid table.
    MOD.views.GridView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "table table-hover table-bordered",

        // Backbone: view DOM element type.
        tagName : "table",

        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
        },

        // Backbone: view renderer.
        render : function () {
            var subViews = [
                GridTableHeaderView,
                GridTableBodyView
            ];

            APP.utils.render(subViews, {}, this);

            return this;
        },

        // Simulation list filtered event handler.
        _onSimulationListFiltered: function () {
            this.$el.show();
        },

        // Simulation list null event handler.
        _onSimulationListNull: function () {
            this.$el.show();
        }
    });

}(this.APP, this.APP.modules.monitoring, this.APP.modules.monitoring.templates.grid, this._, this.Backbone));
