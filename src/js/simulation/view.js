(function (APP, MOD, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: '',

        // Backbone: view HTML tag.
        tagName: 'article',

        // Backbone: view renderer.
        render : function () {
            var subViews = [
                MOD.views.HeaderView,
                MOD.views.DetailsView
            ];
            if (MOD.state.jobHistory.length) {
                subViews.push(MOD.views.JobHistoryView);
            }
            if (MOD.state.configCard.length) {
                subViews.push(MOD.views.ConfigCardView);
            }
            subViews.push(MOD.views.FooterView);
            APP.utils.render(subViews, {}, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.simulation,
    this.Backbone
));
