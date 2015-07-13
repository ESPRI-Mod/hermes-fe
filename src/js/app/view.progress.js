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
            APP.events.on("module:initialized", this._onModuleInitialized, this);
            APP.events.on("module:processingStarts", this._onModuleProcessingStarts, this);
            APP.events.on("module:processingEnds", this._onModuleProcessingEnds, this);
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(APP.templates.progress, {
                APP: APP
            }, this);

            return this;
        },

        // On module processing starts event handler.
        _onModuleProcessingStarts: function (ei) {
            var module = ei.module;
            this.$('.feedback-module-title').text(module.title);
            this.$('.feedback-module-version').text(module.version);
            this.$('.feedback-text').text(ei.info);
            this.$el.modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        },

        // On module processing ends event handler.
        _onModuleProcessingEnds: function () {
            var self = this;

            // Avoid screen flicker by hiding the progress dialog after 1 second.
            setTimeout(function () {
                self.$el.modal('hide');
            }, 500);
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
        _onModuleInitialized: function () {
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
