(function (APP, TEMPLATES, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over application logo.
    var LogoView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "pull-left",

        // Backbone: view DOM tag name.
        tagName: "img",

        // Backbone: view event handlers.
        events: {
            "click": APP.utils.openInstituteHomePage
        },

        // Backbone: view renderer.
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
        // Backbone: view CSS class.
        className: "pull-left",

        // Backbone: view DOM tag name.
        tagName: "h1",

        events: {
            "click": function () {
                APP.utils.openURL(APP.institute.githubPage, true);
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.header.title, APP, this);

            return this;
        }
    });

    // View over application menu item label.
    var MenuItemView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "btn btn-primary",

        // Backbone: view DOM tag name.
        tagName: "label",

        // Backbone: view event handlers.
        events: {
            "change": function () {
                APP.events.trigger("module:activating", this._module);
            }
        },

        // Backbone: view initializer.
        initialize: function () {
            this._module = this.options.model;
        },

        // Backbone: view renderer.
        render: function () {
            APP.utils.renderHTML(TEMPLATES.header.menuItem, this._module, this);
            if (this._module === APP.state.module) {
                this.$el.button('toggle');
            }

            return this;
        }
    });

    // View over support button.
    var SupportButtonView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "btn btn-success btn-app-support",

        // Backbone: view DOM tag name.
        tagName: 'button',

        // Backbone: view event handlers.
        events: {
            "click": APP.utils.openSupportEmail
        },

        // Backbone: view renderer.
        render: function () {
            this.$el.attr("type", "button");
            this.$el.text("Support");

            return this;
        },
    });

    // View over application menu.
    var MenuView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "pull-right btn-group",

        // Backbone: view renderer.
        render: function () {
            var activeModules;

            this.$el.attr("data-toggle", "buttons");
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

    // Header view.
    APP.views.HeaderView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "container app-header",

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                LogoView,
                TitleView,
                MenuView
            ], {}, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.templates,
    this._,
    this.Backbone
));