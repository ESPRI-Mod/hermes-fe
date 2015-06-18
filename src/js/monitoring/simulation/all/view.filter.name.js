(function (APP, MOD, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Name filter label view.
    var FilterNameLabelView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-label",

        // Backbone: view DOM element type.
        tagName: "label",

        // Backbone: view renderer.
        render: function () {
            this.$el.text("Name");
            this.$el.width('19%');

            return this;
        }
    });

    // Name filter input view.
    var FilterNameInputView = Backbone.View.extend({
        // Backbone: view CSS class.
        className: "filter-text",

        // Backbone: view DOM element type.
        tagName: "input",

        // Backbone: view renderer.
        render: function () {
            this.$el.attr("type", "text");
            this.$el.width('75%');

            return this;
        }
    });

    // Name filter view.
    MOD.views.FilterNameView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "col-md-6",

        // Backbone: view renderer.
        render: function () {
            APP.utils.render(FilterNameLabelView, this.options, this);
            APP.utils.render(FilterNameInputView, this.options, this);

            return this;
        }
    });

}(this.APP, this.APP.modules.monitoring, this._, this.Backbone));