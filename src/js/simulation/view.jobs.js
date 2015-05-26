(function (APP, MOD, TEMPLATES, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a grid table row.
    MOD.views.JobHistoryTableRowView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : function () {
            return MOD.jobStatesCSS[this.model.ext.executionState];
        },

        // Backbone: view DOM element type.
        tagName : "tr",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.jobHistory.row, this.model, this);

            return this;
        }
    });

    // View over the grid table header.
    MOD.views.JobHistoryTableHeaderView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "thead",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.jobHistory.header, {}, this);

            return this;
        }
    });

    // View over the grid table footer.
    MOD.views.JobHistoryTableFooterView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "thead",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.jobHistory.footer, {}, this);

            return this;
        }
    });

    // View over the grid table body.
    MOD.views.JobHistoryTableBodyView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tbody",

        // Backbone: view renderer.
        render : function () {
            _.each(MOD.state.jobHistory, this._renderRow, this);

            return this;
        },

        // Renders a row.
        _renderRow : function (job) {
            APP.utils.render(MOD.views.JobHistoryTableRowView, {
                model : job
            }, this);
        }
    });

    // View over the grid table.
    MOD.views.JobHistoryTableView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "table table-hover table-bordered table-condensed job-history-table",

        // Backbone: view DOM element type.
        tagName : "table",

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.JobHistoryTableHeaderView,
                MOD.views.JobHistoryTableBodyView
            ], {}, this);

            return this;
        }
    });

    // View over the set of jobs run during the lifetime of a simulation.
    MOD.views.JobHistoryView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "section",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.jobHistory.caption, {}, this);
            APP.utils.render([
                MOD.views.JobHistoryTableView
            ], {}, this);
            APP.utils.renderHTML(TEMPLATES.jobHistory.footer, {
                simulation: MOD.state.simulation
            }, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.simulation,
    this.APP.modules.simulation.templates,
    this.Backbone
));
