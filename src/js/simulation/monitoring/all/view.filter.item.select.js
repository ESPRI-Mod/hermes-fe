(function (APP, MOD, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Filter select view.
    MOD.views.FilterItemSelectView = Backbone.View.extend({
        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("ui:filter:refresh", this._refresh, this);
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
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));