// --------------------------------------------------------
// monitoring/view.filter.js
// View over the simulation monitoring search filter.
// --------------------------------------------------------
(function(APP, MOD, $, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View of a filter option item.
    var FilterOptionView = Backbone.View.extend({
        tagName: "option",

        className: function () {
            this.options.typeName
        },

        attributes: function () {
            return {
                id: this.options.typeName + '-' + this.model.id,
                value: this.model.id
            }
        },

        render: function () {
            this.$el.text(this.model.name);
            if (this.model.isDefault) {
                this.$el.attr('selected', 'true');
            }

            return this;
        }
    });

    // View of a filterable list.
    var FilterSelectView = Backbone.View.extend({
        className: "filter-select",

        tagName: "select",

        attributes: function () {
            return {
                id: this.options.typeName + "-list"
            };
        },

        initialize: function () {
            MOD.events.on("filter:refresh", this._refresh, this);
        },

        events : {
            'change' : function () {
                this._filter(parseInt(this.$el.val()));
            },
        },

        render: function () {
            var data = MOD.state[this.options.typeName + "List"];

            _.each(data, function (i) {
                var itemView = APP.utils.render(FilterOptionView, _.defaults({
                    model: i,
                }, this.options), this);
                if (i.id === MOD.state[this.options.typeName].id) {
                    itemView.$el.attr('selected', true);
                }
            }, this);
            this.$el.width('55%');

            return this;
        },

        _refresh: function (data) {
            // Escape if not dealing with same filters.
            if (this.options.typeName !== data.typeName) {
                return;
            }

            // Remove existing.
            this.$("option").remove();

            // Build anew.
            _.each(MOD.state[this.options.typeName + "List"], function (i) {
                var itemView = APP.utils.render(FilterOptionView, _.defaults({
                    model: i,
                }, this.options), this);
                if (i.id === MOD.state[this.options.typeName].id) {
                    itemView.$el.attr('selected', true);
                }
            }, this);
        },

        _filter: function (id) {
            var data, item;

            // Filter by item ID.
            data = MOD.state[this.options.typeName + "List"];
            item = _.find(data, function(i){
                return i.id === id;
            });

            // Update state & fire event.
            if (item) {
                MOD.state[this.options.typeName + "Previous"] = MOD.state[this.options.typeName];
                MOD.state[this.options.typeName] = item;
                MOD.events.trigger('ui:applyFilter');
            }
        }
    });

    // View over a filter label.
    var FilterLabelView = Backbone.View.extend({
        className: "filter-label",

        tagName: "label",

        render: function () {
            this.$el.text(this.options.displayName);
            this.$el.width('40%');

            return this;
        }
    });

    // View over a filter.
    var FilterView = Backbone.View.extend({
        className: "col-md-3",

        render: function () {
            var subViews = [
                FilterLabelView,
                FilterSelectView
            ];

            APP.utils.render(subViews, this.options, this);

            return this;
        }
    });

    // Inner view.
    var InnerView = Backbone.View.extend({
        className : "panel-body",

        render: function () {
            _.each(MOD.filters, function (filter) {
                APP.utils.render(FilterView, filter, this);
            }, this);

            return this;
        }
    });

    // Outer view.
    var OuterView = Backbone.View.extend({
        className : "panel panel-info bg-info",

        render : function () {
            APP.utils.render(InnerView, this.options, this);

            return this;
        }
    });

    // Extend module.
    MOD.views.FilterView = OuterView;

}(this.APP, this.APP.modules.monitoring, this.$jq, this._, this.Backbone));