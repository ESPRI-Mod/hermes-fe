(function (APP, MOD, TEMPLATES, $, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Closure vars.
    var LabelView,
        SelectView;

    // Name filter label view.
    LabelView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-label",

        // Backbone: view DOM element type.
        tagName: "label",

        // Backbone: view renderer.
        render: function () {
            this.$el.text("Start Date");
            this.$el.width('40%');

            return this;
        }
    });

    // Name filter select view.
    SelectView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-select",

        // Backbone: view DOM element type.
        tagName: "select",

        // Backbone: view event handlers.
        events : {
            'change' : function () {
                MOD.state.filterTimeSlice = this.$el.val();
                MOD.fetchTimeSlice("state:timesliceUpdated", true);
            }
        },

        // Backbone: view renderer.
        render: function () {
            APP.utils.renderHTML(TEMPLATES.timeframeFilterOptions, {}, this);
            this.$el.width('55%');

            return this;
        }
    });

    // Timeslice filter view.
    MOD.views.FilterTimesliceView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "col-md-3",

        // Backbone: view renderer.
        render: function () {
            APP.utils.render(LabelView, this.options, this);
            APP.utils.render(SelectView, this.options, this);

            return this;
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this.$jq,
    this._,
    this.Backbone
));