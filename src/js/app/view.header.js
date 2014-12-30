// --------------------------------------------------------
// app/view.header.js
// Application header view.
// --------------------------------------------------------
(function(APP, $, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module helper vars.
    var templates = APP.templates.header;

    // View over application logo.
    var LogoView = Backbone.View.extend({
        className: "pull-left",

        tagName: "img",

        events: {
            "click": APP.utils.openInstituteHomePage
        },

        render : function () {
            this.$el.attr("lang", "EN");
            this.$el.attr("title", APP.institute.longName);
            this.$el.attr("alt", APP.institute.longName);
            this.$el.attr("src", APP.constants.images.logo);

            return this;
        },
    });

    // View over application title.
    var TitleView = Backbone.View.extend({
        className: "pull-left",

        tagName: "h1",

        render : function () {
            APP.utils.renderHTML(templates.title, APP, this);

            return this;
        }
    });

    // View over application menu item label.
    var MenuItemView = Backbone.View.extend({
        className: "btn btn-primary",
        tagName: "label",

        initialize: function () {
            this._module = this.options.model;
        },

        render: function () {
            APP.utils.renderHTML(templates.menuItem, this._module, this);
            if (this._module === APP.state.module) {
                this.$el.button('toggle');
            }

            return this;
        },

        events: {
            "change": function () {
                APP.events.trigger("module:loading", this._module);
            }
        }
    });

    // View over support button.
    var SupportButtonView = Backbone.View.extend({
        className: "btn btn-success btn-app-support",

        tagName: 'button',

        events: {
            "click": APP.utils.openSupportEmail
        },

        render: function () {
            this.$el.attr("type", "button");
            this.$el.text("Support");

            return this;
        },
    });

    // View over application menu.
    var MenuView = Backbone.View.extend({
        className: "pull-right btn-group",

        initialize: function () {
            APP.events.on("app:ready", this._renderMenu, this);
        },

        render: function () {
            this.$el.attr("data-toggle", "buttons");

            return this;
        },

        _renderMenu: function () {
            var activeModules;

            activeModules = APP.state.getActiveModules();
            if (activeModules.length > 1) {
                _.each(activeModules, function (module) {
                    APP.utils.render(MenuItemView, {
                        model: module
                    }, this);
                }, this);
            }
            APP.utils.render(SupportButtonView, {}, this);

            return this;
        }
    });

    var View = Backbone.View.extend({
        className: "container app-header",

        render : function () {
            var subViews = [
                LogoView,
                TitleView,
                MenuView
            ];

            APP.utils.render(subViews, {}, this)

            return this;
        }
    });

    // Extend app views.
    APP.views.HeaderView = View;

}(this.APP, this.$jq, this._, this.Backbone));