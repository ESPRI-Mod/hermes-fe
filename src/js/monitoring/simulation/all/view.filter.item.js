(function (APP, MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Filter view.
    MOD.views.FilterItemView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "col-md-3",

        // Backbone: view renderer.
        render: function () {
            APP.utils.render([
                MOD.views.FilterItemLabelView,
                MOD.views.FilterItemSelectView
            ], this.options, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.Backbone));
