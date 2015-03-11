(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Grid header view.
    MOD.views.GridHeaderView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "alert bg-primary",

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.GridHeaderStatsView,
                MOD.views.GridHeaderPagerView
            ], {}, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this.APP.modules.monitoring.templates, this.Backbone));
