(function (MOD, TEMPLATES, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over inter-monitoring form.
    MOD.views.InterMonitoringFormView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "form",

        // Backbone: view DOM attributes.
        attributes: function () {
            return {
                action: MOD.urls.IM,
                id: "imForm",
                method: 'POST',
                target: '_blank'
            };
        },

        // Backbone: view initializer.
        initialize: function () {
            MOD.events.on("im:postInterMonitorForm", this._post, this);
        },

        // Posts form to IM.
        _post: function (urls) {
            // Inject urls as hidden input fields.
            _.each(urls, function (url, index) {
                this.$el.append(TEMPLATES.imInput({
                    key: "simul" + (index + 1),
                    value: url
                }));
            }, this);

            // Submit form (will open new browser tab).
            this.$el.submit();

            // Reset form.
            this.$('input').remove();
        }
    });

}(
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.templates,
    this._,
    this.Backbone
));
