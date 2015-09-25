(function (APP, MOD, _, Backbone) {

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
            this._renderJobs('compute', MOD.state.simulation.jobs.compute);
            this._renderJobs('post-processing', MOD.state.simulation.jobs.postProcessing);
            this._renderJobs('post-processing-from-checker', MOD.state.simulation.jobs.postProcessingFromChecker);
            if (MOD.state.configCard.length) {
                APP.utils.render(MOD.views.ConfigCardView, {}, this);
            }
            APP.utils.render(MOD.views.FooterView, {}, this);

            return this;
        },

        // Renders a job collection.
        _renderJobs : function (jobType, jobs) {
            if (jobs.all.length) {
                APP.utils.render(MOD.views.JobHistoryView, {
                    jobHistory: jobs,
                    jobType: jobType
                }, this);
            }
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.Backbone
));
