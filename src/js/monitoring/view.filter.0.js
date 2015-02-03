(function (MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Filter option view.
    MOD.views.FilterOptionView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName: "option",

        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                value: this.model.name
            };
        },

        // Backbone: view renderer.
        render: function () {
            // Set display text.
            this.$el.text(this.model.displayName);

            // Set selected attribute.
            if (this.model === this.options.cvTerms.current) {
                this.$el.attr('selected', 'true');
            }

            return this;
        }
    });

}(this.APP.modules.monitoring, this.Backbone));