(function (MOD, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Filter option view.
    MOD.views.FilterItemOptionView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName: "option",

        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                value: this.model.name
            };
        },

        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("state:simulationListFiltered", this.updateView, this);
        },

        // Backbone: view renderer.
        render: function () {
            this.$el.text(this.model.displayName);
            this.updateView();
            if (this.model === this.options.cvTerms.current) {
                this.$el.attr('selected', 'true');
            }

            return this;
        },

        // Updates view according to current state.
        updateView: function () {
            if (this.model.name !== '*' &&
                _.indexOf(this.options.cvTerms.active, this.model.name) < 0) {
                this.$el.hide();
            } else {
                this.$el.show();
            }
        }
    });

}(
    this.APP.modules.monitoring,
    this._,
    this.Backbone
));