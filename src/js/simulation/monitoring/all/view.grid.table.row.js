(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a grid table row.
    MOD.views.GridTableRowView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tr",

        // Backbone: view CSS class.
        className : function () {
            return MOD.getStateCSS(this.model.executionState);
        },

        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                id: 'simulation-' + this.model.uid
            };
        },

        // Backbone: view event handlers.
        events : {
            'click > td.row-link' : function () {
                var url;

                url = APP.utils.getPageURL(MOD.urls.SIMULATION_PAGE);
                url = url.replace("{uid}", this.model.uid);
                APP.utils.openURL(url, true);
            },
            'click > td.monitoring' : function () {
                MOD.events.trigger("im:openMonitor", this.model);
            },
            'change > td.interMonitoring > input' : function () {
                this.model.ext.isSelectedForIM = !this.model.ext.isSelectedForIM;
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.gridRow, this.model, this);
            if (this.model.ext.isSelectedForIM) {
                this.$('.interMonitoring > input').attr('checked', true);
            }
            if (this.model.jobs.compute.error.length) {
                this.$('.compute-job-count').addClass('bg-danger');
            }
            if (this.model.jobs.postProcessing.error.length) {
                this.$('.post-processing-job-count').addClass('bg-danger');
            }

            // if (this.model.jobs.compute.hasLate) {
            //     this.$('.jobCount').addClass('bg-danger');
            // }

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this.Backbone
));
