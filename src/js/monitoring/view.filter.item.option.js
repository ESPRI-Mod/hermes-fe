(function (MOD, Backbone) {

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
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
        },

        // Backbone: view renderer.
        render: function () {
            this.$el.text(this.model.displayName);
            this._setDisplayState();
            if (this.model === this.options.cvTerms.current) {
                this.$el.attr('selected', 'true');
            }

            return this;
        },

        // Simulation list filtered event handler.
        _onSimulationListFiltered: function () {
            this._setDisplayState();
        },

        // Either hides or displays view.
        _setDisplayState: function () {
            if (this.model.name !== '*' &&
                _.indexOf(this.options.cvTerms.active, this.model.name) < 0) {
                this.$el.hide();
            } else {
                this.$el.show();
            }
        }
    });

}(this.APP.modules.monitoring, this.Backbone));