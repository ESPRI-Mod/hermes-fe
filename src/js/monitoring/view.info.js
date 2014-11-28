(function (APP, MOD, $, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module helper vars.
    var paging = MOD.state.paging,
        NotificationsView,
        PagerItemView,
        PagerView,
        PrimaryView,
        SecondaryView;

    // View over notifications being received from server.
    NotificationsView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName: "b",

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
        // @ei      Event information.
        _onSimulationStateChange: function (ei) {
            var text;

            text = "STATUS CHANGE @ {0} :: {1} changed from {2} to {3}";
            text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
            text = text.replace("{1}", ei.s.name);
            text = text.replace("{2}", ei.statePrevious);
            text = text.replace("{3}", ei.state);

            this.$el.text(text);
        },

        // Simulation termination event handler.
        // @ei      Event information.
        _onSimulationTermination: function (ei) {
            var text;

            text = "SIMULATION TERMINATED @ {0} :: {1} changed from {2} to {3}";
            text = text.replace("{0}", ei.eventTimestamp.slice(0, 19));
            text = text.replace("{1}", ei.s.name);
            text = text.replace("{2}", ei.statePrevious);
            text = text.replace("{3}", ei.state);

            this.$el.text(text);
        },

        // New simulation event handler.
        // @ei      Event information.
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
    PagerItemView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : 'li',

        // Backbone: view CSS class.
        className: function () {
            return 'page-' + this.model.id;
        },

        // Backbone: view event handlers.
        events : {
            'click a' : "_onPaging"
        },

        // Backbone: view renderer.
        render : function () {
            this.$el.append(MOD.templates.info.pagerItem(this.model));
            if (paging.current && paging.current.id === this.model.id) {
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
    PagerView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : 'ul',

        // Backbone: view CSS class.
        className : 'pagination pull-right',

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:newSimulation", this._onNewSimulation, this);
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
            MOD.events.on("ui:pagination", this._onPagination, this);
        },

        // Backbone: view renderer.
        render : function () {
            this._onSimulationListFiltered();

            return this;
        },

        // Null filter event handler.
        _onSimulationListNull: function () {
            this.$('li').remove();
        },

        // Filtered event handler.
        _onSimulationListFiltered : function () {
            // Delete previous.
            this.$('li').remove();

            // Escape if not required.
            if (paging.count < 2) {
                return;
            }

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
        // @ei      Event information.
        _onNewSimulation: function () {
            this._onSimulationListFiltered();
        }
    });

    // Primary view.
    PrimaryView = Backbone.View.extend({
        className : "alert alert-info",

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:newSimulation", this._onNewSimulation, this);
            MOD.events.on("state:simulationStatusUpdated", this._onSimulationStateChange, this);
            MOD.events.on("state:simulationTermination", this._onSimulationTermination, this);
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                NotificationsView,
                PagerView,
            ], {}, this);

            return this;
        },

        // Simulation state change event handler.
        // @ei      Event information.
        _onSimulationStateChange: function (ei) {
            this.$el.attr("class", "alert alert-" + MOD.statesCSS[ei.state]);
        },

        // Simulation termination event handler.
        // @ei      Event information.
        _onSimulationTermination: function (ei) {
            this.$el.attr("class", "alert alert-" + MOD.statesCSS[ei.state]);
        },

        // New simulation event handler.
        // @ei      Event information.
        _onNewSimulation: function (ei) {
            this.$el.attr("class", "alert alert-info");
        }
    });

    // Secondary view.
    SecondaryView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "alert alert-warning",

        // Backbone: view initializer.
        initialize : function () {
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
        },

        // Backbone: view renderer.
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

    // Information panel view.
    MOD.views.InfoView = Backbone.View.extend({
        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                PrimaryView,
                SecondaryView
            ], {}, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.$jq, this._, this.Backbone));
