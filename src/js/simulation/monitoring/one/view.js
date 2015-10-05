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
            'click .glyphicon-envelope' : function () {
                var url;

                url = APP.utils.getPageURL(MOD.urls.SIMULATION_MESSAGES_PAGE);
                url = url.replace("{uid}", MOD.state.simulation.uid);
                APP.utils.openURL(url, true);
            },

            // Open previous try page.
            'change #previous-try-select' : function (e) {
                var tryID, url;

                tryID = $(e.target).val();
                if (tryID > 0) {
                    url = APP.utils.getPageURL(MOD.urls.SIMULATION_DETAIL_PAGE);
                    url = url.replace("{hashid}", MOD.state.simulation.hashid);
                    url = url.replace("{tryID}", tryID);
                    url = url.replace("{uid}", MOD.state.simulation.uid);
                    APP.utils.openURL(url, true);
                }
            },

            // Reopen page when web socket closed.
            'click #ws-close-dialog-refresh-page-button' : function () {
                APP.utils.openURL();
            }
        },

        // Backbone: view initializer.
        initialize : function () {
            // Simulation update events.
            MOD.events.on("state:simulationUpdate", this._updateSimulationOverview, this);
            MOD.events.on("state:simulationUpdate", this._updateJobHistories, this);

            // Job update events.
            MOD.events.on("state:jobHistoryUpdate", this._updateJobHistory, this);

            // Web socket closed event.
            MOD.events.on("ws:socketClosed", this._displayWebSocketClosedDialog, this);
        },

        // Backbone: view renderer.
        render : function () {
            _.each([
                "template-simulation-detail-header",
                "template-simulation-detail-overview",
                "template-simulation-detail-job-histories",
                "template-simulation-detail-config-card",
                "template-simulation-detail-footer",
                "ws-close-dialog-template"
                ], function (template) {
                APP.utils.renderTemplate(template, MOD.state, this);
            }, this);

            return this;
        },

        _updateSimulationOverview: function () {
            this._replaceNode("#" + MOD.state.simulation.uid, "template-simulation-detail-overview", MOD.state);
        },

        _updateJobHistories: function () {
            _.each(MOD.jobTypes, this._updateJobHistory, this);
        },

        // Updates a job collection.
        _updateJobHistory : function (jobType) {
            this._replaceNode("#simulation-detail-job-history-" + jobType, "template-simulation-detail-job-history", {
                APP: APP,
                jobHistory: MOD.state.getJobs(jobType),
                jobType: jobType,
                jobTypeCaption: MOD.jobTypeCaptions[jobType],
                MOD: MOD
            });
        },

        _displayWebSocketClosedDialog: function () {
            this.$('#ws-close-dialog').modal('show');
        },

        _replaceNode: function (nodeSelector, template, templateData) {
            this.$(nodeSelector).replaceWith(APP.utils.renderTemplate(template, templateData));
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.Backbone,
    this.$
));
