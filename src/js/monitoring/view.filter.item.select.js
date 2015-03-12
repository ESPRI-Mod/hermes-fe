(function (APP, MOD, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Filter select view.
    MOD.views.FilterItemSelectView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-select",

        // Backbone: view DOM element type.
        tagName: "select",

        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("ui:filter:refresh", this._refresh, this);
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

        // Builds view.
        _build: function () {
            var cvTerms;

            cvTerms = this.options.cvTerms.all;
            _.each(cvTerms, function (cvTerm) {
                APP.utils.render(MOD.views.FilterItemOptionView, _.defaults({
                    model: cvTerm
                }, this.options), this);
            }, this);
        },

        // Set filtered item.
        _filter: function (name) {
            var term;

            // Retrive associated cv term.
            term = _.find(this.options.cvTerms.all, function (term) {
                return term.name === name;
            });

            // Update state & fire event.
            if (term) {
                this.options.cvTerms.previous = this.options.cvTerms.current;
                this.options.cvTerms.current = term;
                MOD.events.trigger('ui:applyFilter');
            }
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));