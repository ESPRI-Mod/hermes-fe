(function (APP, $, _, Backbone) {

    var GroupItemView = Backbone.View.extend({
        tagName: "option",

        attributes: function () {
            return {
                value: this.model
            };
        },

        render : function () {
            this.$el.text(this.model);
            if (!this.model) {
                this.$el.attr('selected', true);
            }

            return this;
        }
    });

    APP.views.GroupListView = Backbone.View.extend({
        events : {
            'change' : function () {
                APP.state.group = this.$el.val();
                APP.events.trigger("group:selected");
            },
        },

        render : function () {
            _.each(APP.state.groups, function (group) {
                APP.utils.render(GroupItemView, { model: group }, this);
            }, this);

            return this;
        }
    });

    var EndpointItemView = Backbone.View.extend({
        tagName: "option",

        attributes: function () {
            return {
                value: this.model.name
            };
        },

        render : function () {
            this.$el.text(this.model.uiName);
            if (!this.model.uiName) {
                this.$el.attr('selected', true);
            }

            return this;
        }
    });

    APP.views.EndpointListView = Backbone.View.extend({
        events : {
            'change' : function () {
                var itemID, item;

                // Find selected item.
                itemID = this.$el.val();
                item = _.find(APP.state.endpoints, function (ep) {
                    return ep.name === itemID;
                });

                // Select item.
                if (item) {
                    APP.state.endpoint = item;
                    APP.events.trigger("endpoint:selected");
                }
            },
        },

        render : function () {
            _.each(APP.state.endpoints, function (endpoint) {
                APP.utils.render(EndpointItemView, { model: endpoint }, this);
            }, this);

            return this;
        }
    });

}(this.APP, this.$, this._, this.Backbone));
