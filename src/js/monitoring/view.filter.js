(function (APP, MOD, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module vars.
    var FilterOptionView,
        FilterSelectView,
        FilterLabelView,
        FilterView,
        InnerView;

    // Filter option view.
    FilterOptionView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName: "option",

        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                value: this.model
            };
        },

        // Backbone: view renderer.
        render: function () {
            var displayText, displayFormatter;

            // Set display text.
            displayText = this.model;
            displayFormatter = this.options.displayFormatter;
            if (displayFormatter) {
                displayText = displayText[displayFormatter]();
            }
            this.$el.text(displayText);

            // Set selected attribute.
            if (this.model === MOD.state[this.options.key]) {
                this.$el.attr('selected', 'true');
            }

            return this;
        }
    });

    // Filter select view.
    FilterSelectView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-select",

        // Backbone: view DOM element type.
        tagName: "select",

        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("filter:refresh", this._refresh, this);
        },

        // Backbone: view event handlers.
        events : {
            'change' : function () {
                this._filter(this.$el.val());
            },
        },

        // Backbone: view renderer.
        render: function () {
            this._build();
            this.$el.width('55%');

            return this;
        },

        // Refresh filter when server pushes new CV terms.
        _refresh: function (filter) {
            // Escape if not dealing with same filters.
            if (this.options.key !== filter.key) {
                return;
            }

            // Remove existing.
            this.$("option").remove();

            // Build anew.
            this._build();
        },

        // Buils view.
        _build: function () {
            var data;

            data = MOD.state[this.options.key + "List"];
            _.each(data, function (i) {
                APP.utils.render(FilterOptionView, _.defaults({
                    model: i,
                }, this.options), this);
            }, this);
        },

        // Set filtered item.
        _filter: function (name) {
            var data, item;

            // Filter by item ID.
            data = MOD.state[this.options.key + "List"];
            item = _.find(data, function (value) {
                return value === name;
            });

            // Update state & fire event.
            if (item) {
                MOD.state[this.options.key + "Previous"] = MOD.state[this.options.key];
                MOD.state[this.options.key] = item;
                MOD.events.trigger('ui:applyFilter');
            }
        }
    });

    // Filter label view.
    FilterLabelView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-label",

        // Backbone: view DOM element type.
        tagName: "label",

        // Backbone: view renderer.
        render: function () {
            this.$el.text(this.options.displayName);
            this.$el.width('40%');

            return this;
        }
    });

    // Filter view.
    FilterView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "col-md-3",

        // Backbone: view renderer.
        render: function () {
            APP.utils.render([
                FilterLabelView,
                FilterSelectView
            ], this.options, this);

            return this;
        }
    });

    // Inner view.
    InnerView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "panel-body",

        // Backbone: view renderer.
        render: function () {
            _.each(MOD.filters, function (filter) {
                APP.utils.render(FilterView, filter, this);
            }, this);

            return this;
        }
    });

    // Outer view.
    MOD.views.FilterView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "panel panel-info bg-info",

        // Backbone: view renderer.
        render : function () {
            APP.utils.render(InnerView, this.options, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));