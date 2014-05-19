// --------------------------------------------------------
// monitoring/view.grid.js
// View over the simulation monitoring search results.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	// Module helper vars.
	var templates = MOD.templates.grid;

	// View over the grid table header.
	var GridTableHeaderView = Backbone.View.extend({
		tagName : "thead",

		render : function () {
			APP.utils.renderHTML(templates.header, {}, this);

			return this;
		}
	});

	// View over a grid table row.
	var GridTableRowView = Backbone.View.extend({
		tagName : "tr",
		
		id : function () { 
			return 'simulation-' + this.model.id;
		},

		className : function () {
			return MOD.statesCSS[this.model.executionState];
		},

		render : function () {
			APP.utils.renderHTML(templates.row, this.model, this);

			return this;
		}
	});

	// View over the grid table body.
	var GridTableBodyView = Backbone.View.extend({
		tagName : "tbody",

		initialize: function () {
			MOD.events.on("state:newSimulation", this._onNewSimulation, this);
			MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
			MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
			MOD.events.on("state:simulationStatusUpdated", this._onSimulationStateChange, this);
			MOD.events.on("ui:pagination", this._renderPage, this);
		},

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
		_renderRow : function (s) {
			APP.utils.render(GridTableRowView, {
				model : s
			}, this)			
		},

		// Simulation state change event handler.
		// @ei 		Event information.
		_onSimulationStateChange: function (ei) {
			// Get row.
			var $s = this.$('#simulation-' + ei.id);

			// Update row css.
			$s.removeClass(MOD.statesCSS[ei.statePrevious]);
			$s.addClass(MOD.statesCSS[ei.state]);
		},

		// New simulation event handler.
		// @ei 		Event information.
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
		}
	});

	// View over the grid table.
	var GridTableView = Backbone.View.extend({
		tagName : "table",

		className : "table table-hover table-bordered",

		initialize: function () {
			MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
			MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
		},

		render : function () {
			var subViews = [
				GridTableHeaderView,
				GridTableBodyView
			];
			
			APP.utils.render(subViews, {}, this)

			return this;
		},

		// Simulation list filtered event handler.
		_onSimulationListFiltered: function () {
			this.$el.show();
		},

		// Simulation list null event handler.
		_onSimulationListNull: function () {
			this.$el.hide();
		}		
	});

	var NullView = Backbone.View.extend({
		
	});		

	// Extend module.
	MOD.views.GridView = GridTableView;	

}(this.APP, this.APP.modules.monitoring, this.$jq, this._, this.Backbone));