// --------------------------------------------------------
// monitoring/view.info.js
// View over the simulation monitoring search information/paging.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

	// ECMAScript 5 Strict Mode
	"use strict";

	// Module helper vars.
	var paging = MOD.state.paging,
		templates = MOD.templates.info;

	// View over notifications being received from server.
	var NotificationsView = Backbone.View.extend({
		tagName: "b",

		initialize : function () {
			MOD.events.on("state:simulationStatusUpdated", this._onSimulationStateChange, this);
			MOD.events.on("state:newSimulation", this._onNewSimulation, this);
		},

		render : function () {
			this.$el.text("Awaiting simulation events ...");

			return this;
		},

		// Simulation state change event handler.
		// @ei 		Event information.
		_onSimulationStateChange: function (ei) {
			var text;

			text = "STATUS CHANGE @ {0} :: {1} changed from {2} to {3}";
			text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
			text = text.replace("{1}", ei.s.name);
			text = text.replace("{2}", ei.statePrevious);
			text = text.replace("{3}", ei.state);
			
			this.$el.text(text);
		},

		// New simulation event handler.
		// @ei 		Event information.
		_onNewSimulation: function (ei) {
			var text;

			text = "NEW SIMULATION @ {0} :: {1} is {2}";
			text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
			text = text.replace("{1}", ei.simulation.name);
			text = text.replace("{2}", ei.simulation.executionState);

			this.$el.text(text);
		}
	});

	// View over a pager item.
    var PagerItemView = Backbone.View.extend({
        tagName : 'li',

        className: function () {
        	return 'page-' + this.model.id;
        },

        events : {
            'click a' : "_onPaging"
        },

        render : function () {        	
            this.$el.append(templates.pagerItem(this.model));
            if (paging.current &&
            	paging.current.id === this.model.id) {
                this.$el.addClass('active');
            }

            return this;
        },

        // On paging event handler.
        _onPaging : function () {
            if (paging.current.id !== this.model.id) {
                paging.previous = paging.current;
                paging.current = this.model;
                MOD.events.trigger('ui:pagination');
            }
        },
    });

	// View over the pager.
	var PagerView = Backbone.View.extend({
        tagName : 'ul',

        className : 'pagination pull-right',

		initialize : function () {
			MOD.events.on("state:newSimulation", this._onNewSimulation, this);
			MOD.events.on("state:simulationListFiltered", this._onFiltered, this);
			MOD.events.on("state:simulationListNull", this._onNullFilter, this);
			MOD.events.on("ui:pagination", this._onPagination, this);
		},        

		render : function () {
			this._onFiltered();

			return this;
		},

		// Null filter event handler.
		_onNullFilter: function () {
            this.$('li').remove();
		},

        // Filtered event handler.
        _onFiltered : function () {
            // Delete previous.
            this.$('li').remove();

            // Escape if not required.
            if (paging.count < 2) return;

            // Append pages.
            _.each(paging.pages, function (page) {
            	APP.utils.render(PagerItemView, _.defaults({
                    model : page
                }, this.options), this);
            }, this);
        },

        // Pagination event handler.
        _onPagination : function () {
            if (paging.previous) {
                this.$('li.page-' + paging.previous.id).removeClass('active');
            }
            this.$('li.page-' + paging.current.id).addClass('active');
        },

		// New simulation event handler.
		// @ei 		Event information.
		_onNewSimulation: function () {
			this._onFiltered();
		}
	});

	// Primary view.
	var PrimaryView = Backbone.View.extend({
		className : "alert alert-info",

		initialize : function () {
			MOD.events.on("state:simulationStatusUpdated", this._onSimulationStateChange, this);
			MOD.events.on("state:newSimulation", this._onNewSimulation, this);
		},

		render : function () {
			var subViews = [
				NotificationsView,
				PagerView,
			];
			
			APP.utils.render(subViews, {}, this)

			return this;
		},

		// Simulation state change event handler.
		// @ei 		Event information.
		_onSimulationStateChange: function (ei) {
			this.$el.attr("class", "alert alert-" + MOD.statesCSS[ei.state]);
		},

		// New simulation event handler.
		// @ei 		Event information.
		_onNewSimulation: function (ei) {
			this.$el.attr("class", "alert alert-info");
		}
	});

	// Secondary view.
	var SecondaryView = Backbone.View.extend({
		className : "alert alert-warning",

		initialize : function () {
			MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
			MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
		},

		render : function () {
			this.$el.text("Filter returned no records - please refine");
			this.$el.hide();			

			return this;
		},

		// Simulation list filtered event handler.
		_onSimulationListFiltered: function () {
			this.$el.hide();
		},

		// Simulation list null event handler.
		_onSimulationListNull: function () {
			this.$el.show();
		}
	});

	var View = Backbone.View.extend({
		render : function () {
			var subViews = [
				PrimaryView,
				SecondaryView
			];
			
			APP.utils.render(subViews, {}, this)

			return this;
		}
	});	

	// Extend module.
	MOD.views.InfoView = View;

}(this.APP, this.APP.modules.monitoring, this.$jq, this._, this.Backbone));