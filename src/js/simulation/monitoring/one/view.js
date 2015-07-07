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
            APP.utils.render(MOD.views.HeaderView, {}, this);
            APP.utils.render(MOD.views.DetailsView, {}, this);
            if (MOD.state.simulation.jobs.compute.all.length) {
                APP.utils.render(MOD.views.JobHistoryView, {
                    jobHistory: MOD.state.simulation.jobs.compute,
                    jobType: 'compute'
                }, this);
            }
            if (MOD.state.simulation.jobs.postProcessing.all.length) {
                APP.utils.render(MOD.views.JobHistoryView, {
                    jobHistory: MOD.state.simulation.jobs.postProcessing,
                    jobType: 'post-processing'
                }, this);
            }
            if (MOD.state.simulation.jobs.postProcessingFromChecker.all.length) {
                APP.utils.render(MOD.views.JobHistoryView, {
                    jobHistory: MOD.state.simulation.jobs.postProcessingFromChecker,
                    jobType: 'post-processing-from-checker'
                }, this);
            }
            if (MOD.state.configCard.length) {
                APP.utils.render(MOD.views.ConfigCardView, {}, this);
            }
            APP.utils.render(MOD.views.FooterView, {}, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.Backbone
));
