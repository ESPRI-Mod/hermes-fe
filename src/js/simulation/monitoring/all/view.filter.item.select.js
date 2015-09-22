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
                this._applyFilter(this.$el.val());
            },
        },

        // Backbone: view renderer.
        render: function () {
            this._reset();
            this.$el.width('55%');

            return this;
        },
        
        // Resets view.
        _reset : function () {
            _.each(this.options.cvTerms.all, function (cvTerm) {
                APP.utils.render(MOD.views.FilterItemOptionView, _.defaults({
                    model: cvTerm
                }, this.options), this);
            }, this);                        
        },

        // Refresh filter when server pushes new CV terms.
        _refresh: function (filter) {
            // Escape if not dealing with same filters.
            if (this.options.key !== filter.key) {
                return;
            }
            
            // TODO review            
            console.log("TODO: review what to do when refreshing filter after arrival of a new cv term");
            this.$('option').remove();
            this._reset();
        },

        // Set filtered item.
        _applyFilter: function (name) {
            var term;

            term = _.find(this.options.cvTerms.all, function (term) {
                return term.name === name;
            });
            if (term) {
                this.options.cvTerms.current = term;
                MOD.events.trigger('ui:filter');
            }
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));