(function (APP, MOD, TEMPLATES, Backbone, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over open criteria dialog button.
    var OpenCriteriaDialogButtonView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "btn btn-warning criteria-open-dialog pull-right",

        // Backbone: view DOM tag name.
        tagName: 'button',

        // Backbone: view event handlers.
        events: {

        },

        // Backbone: view renderer.
        render: function () {
            this.$el.text("Filter");

            return this;
        },
    });

    // View over open criteria summary.
    var CriteriaSummaryView = Backbone.View.extend({
        // Backbone: view DOM tag name.
        tagName: 'span',

        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("state:simulationListFiltered", this._onSimulationListFiltered, this);
            MOD.events.on("state:simulationListNull", this._onSimulationListNull, this);
        },

        // Backbone: view renderer.
        render: function () {
            APP.utils.renderHTML(TEMPLATES.criteria.summary, {
                MOD: MOD,
                filterText: this._getText()
            }, this);

            return this;
        },

        _onSimulationListFiltered: function () {
            this.$('.criteria-text').text(this._getText());
        },

        _onSimulationListNull: function () {
            this.$('.criteria-text').text(this._getText());
        },

        // Returns text to display to user.
        _getText: function () {
            var text;

            text = _.map(MOD.state.getActiveFilters(), function (filter) {
                return filter.displayName + "=" + filter.cvTerms.current.displayName;
            });

            return text.join("; ") || "None";
        }
    });

    // Search criteria view.
    MOD.views.CriteriaView = Backbone.View.extend({
        className : "alert bg-primary",

        // Backbone: view renderer.
        render : function () {
            APP.utils.render(CriteriaSummaryView, this.options, this);
            APP.utils.render(OpenCriteriaDialogButtonView, this.options, this);

            return this;
        }
    });
}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this.Backbone,
    this._
));
