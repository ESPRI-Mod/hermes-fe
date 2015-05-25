(function (APP, MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: 'table-responsive',

        // Backbone: view HTML tag.
        tagName: 'article',

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.HeaderView,
                MOD.views.DetailsView,
                MOD.views.JobHistoryView,
                MOD.views.ConfigCardView,
                MOD.views.FooterView
            ], {}, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.simulation,
    this.Backbone
));
