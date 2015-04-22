(function (APP, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Progress view.
    APP.views.ProgressView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "app-progress modal fade feedback-container",

        // Backbone: view initializer.
        initialize: function () {
            APP.events.on("module:initializing", this._onModuleInitializing, this);
            APP.events.on("module:initialized", this._onModuleLoaded, this);
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(APP.templates.progress, {
                APP: APP
            }, this);

            return this;
        },

        // On module initializing event handler.
        _onModuleInitializing: function (module) {
            this.$('.feedback-module-title').text(module.title);
            this.$('.feedback-module-version').text(module.version);
            this.$el.modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        },

        // On module loaded event handler.
        _onModuleLoaded: function () {
            var self = this;

            // Avoid screen flicker by hiding the progress dialog after 1 second.
            setTimeout(function () {
                self.$el.modal('hide');
            }, 500);
        }
    });

}(
    this.APP,
    this.Backbone
));
