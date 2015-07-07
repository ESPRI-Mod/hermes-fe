(function (APP, MOD, TEMPLATES, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a grid table row.
    var TableRowView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : function () {
            return MOD.getStateCSS(this.options.job.executionState);
        },

        // Backbone: view DOM element type.
        tagName : "tr",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.jobHistory.row, this.options, this);

            return this;
        }
    });

    // View over the grid table header.
    var TableHeaderView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "thead",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.jobHistory.header, {}, this);

            return this;
        }
    });

    // View over the grid table footer.
    var TableFooterView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "thead",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.jobHistory.footer, {}, this);

            return this;
        }
    });

    // View over the grid table body.
    var TableBodyView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tbody",

        // Backbone: view renderer.
        render : function () {
            _.each(this.options.jobHistory.all, this._renderRow, this);

            return this;
        },

        // Renders a row.
        _renderRow : function (job, index) {
            APP.utils.render(TableRowView, {
                job: job,
                jobIndex: index + 1
            }, this);
        }
    });

    // View over the grid table.
    var TableView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "table table-hover table-bordered table-condensed job-history-table",

        // Backbone: view DOM element type.
        tagName : "table",

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                TableHeaderView,
                TableBodyView
            ], this.options, this);

            return this;
        }
    });

    // View over the set of jobs run during the lifetime of a simulation.
    MOD.views.JobHistoryView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "section",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.jobHistory.caption, {
                jobHistory: this.options.jobHistory,
                jobTypeCaption: MOD.jobTypeCaptions[this.options.jobType]
            }, this);

            APP.utils.render([
                TableView
            ], {
                jobHistory: this.options.jobHistory
            }, this);

            APP.utils.renderHTML(TEMPLATES.jobHistory.footer, {
                jobHistory: this.options.jobHistory,
                jobTypeCaption: MOD.jobTypeCaptions[this.options.jobType]
            }, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this._,
    this.Backbone
));
