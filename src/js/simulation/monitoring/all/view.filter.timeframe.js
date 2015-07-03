(function (APP, MOD, TEMPLATES, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Name filter label view.
    var FilterTimeframeLabelView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-label",

        // Backbone: view DOM element type.
        tagName: "label",

        // Backbone: view renderer.
        render: function () {
            this.$el.text("Timeframe");
            this.$el.width('40%');

            return this;
        }
    });

    // Name filter select view.
    var FilterTimeframeSelectView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-select",

        // Backbone: view DOM element type.
        tagName: "select",

        // Backbone: view renderer.
        render: function () {
            APP.utils.renderHTML(TEMPLATES.filter.timeframe, {}, this);
            this.$el.width('55%');

            return this;
        }
    });

    // Timeframe filter view.
    MOD.views.FilterTimeframeView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "col-md-3",

        // Backbone: view renderer.
        render: function () {
            APP.utils.render(FilterTimeframeLabelView, this.options, this);
            APP.utils.render(FilterTimeframeSelectView, this.options, this);


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