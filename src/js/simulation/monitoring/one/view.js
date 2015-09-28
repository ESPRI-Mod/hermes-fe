(function (APP, MOD, _, Backbone, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName: 'article',

        // Backbone: view events.
        events: {
            // Open inter-monitoring page.
            'click .inter-monitoring' : function () {
                MOD.events.trigger("im:openMonitor", MOD.state.simulation);
            },

            // Open messages page.
            'click .simulation-messages' : function () {
                var url;

                url = APP.utils.getPageURL(MOD.urls.SIMULATION_MESSAGES_PAGE);
                url = url.replace("{uid}", MOD.state.simulation.uid);
                APP.utils.openURL(url, true);
            },

            // Open previous try page.
            'change #previous-try-select' : function (e) {
                var tryID = $(e.target).val(), url;
                if (tryID > 0) {
                    url = APP.utils.getPageURL(MOD.urls.SIMULATION_DETAIL_PAGE);
                    url = url.replace("{hashid}", MOD.state.simulation.hashid);
                    url = url.replace("{tryID}", tryID);
                    url = url.replace("{uid}", MOD.state.simulation.uid);
                    APP.utils.openURL(url, true);
                }
            },
        },

        // Backbone: view renderer.
        render : function () {
            // Render header.
            APP.utils.renderTemplate("template-simulation-detail-header", MOD.state, this);

            // Render overview.
            APP.utils.renderTemplate("template-simulation-detail-overview", MOD.state, this);

            // Render jobs.
            this._renderJobs('compute', MOD.state.simulation.jobs.compute);
            this._renderJobs('post-processing', MOD.state.simulation.jobs.postProcessing);
            this._renderJobs('post-processing-from-checker', MOD.state.simulation.jobs.postProcessingFromChecker);

            // Render config card.
            APP.utils.renderTemplate("template-simulation-detail-config-card", MOD.state, this);

            // Render footer.
            APP.utils.renderTemplate("template-simulation-detail-footer", MOD.state, this);

            return this;
        },

        // Renders a job collection.
        _renderJobs : function (jobType, jobs) {
            if (jobs.all.length) {
                APP.utils.renderTemplate("template-simulation-detail-job-history", {
                    jobHistory: jobs,
                    jobType: jobType,
                    jobTypeCaption: MOD.jobTypeCaptions[jobType],
                    MOD: MOD
                }, this);
            }
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.Backbone,
    this.$
));
