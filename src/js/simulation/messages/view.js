(function (APP, MOD, TEMPLATES, _, Backbone, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // View over the set of messages received during the lifetime of a simulation.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "article",

        // Backbone: view events.
        events: {
            // Open simulation detail page.
            'click .simulation-details' : function () {
                var url;

                url = APP.utils.getPageURL(MOD.urls.SIMULATION_DETAIL_PAGE);
                url = url.replace("{hashid}", MOD.state.simulation.hashid);
                url = url.replace("{tryID}", MOD.state.simulation.tryID);
                url = url.replace("{uid}", MOD.state.simulation.uid);
                APP.utils.openURL(url, true);
            },

            // Display message content.
            'click td.message-content' : function (e) {
                this._renderMessageContent($(e.target).parent().parent().attr("id"));
            }
        },

        // Backbone: view renderer.
        render : function () {
            // Render header.
            APP.utils.renderTemplate("template-messages-header", {
                simulation: MOD.state.simulation
            }, this);

            // Render compute messages.
            this._renderCollection("Compute", MOD.state.messageHistory.compute);

            // Render post-processing messages.
            this._renderCollection("Post Processing", MOD.state.messageHistory.postProcessing);

            // Render footer.
            APP.utils.renderTemplate("template-messages-footer", {
                APP: APP,
                MOD: MOD,
                simulation: MOD.state.simulation,
                year: new Date().getFullYear()
            }, this);

            return this;
        },

        // Renders a message collection.
        _renderCollection: function (jobType, collection) {
            if (collection.length) {
                APP.utils.renderTemplate("template-messages-collection", {
                    jobType: jobType,
                    messages: collection
                }, this);
            }
        },

        // Renders an inividual message content.
        _renderMessageContent: function (uid) {
            var view, viewModel;

            // Set view model.
            viewModel = _.find(MOD.state.messageHistory.all, function (m) {
                return m.uid === uid;
            });
            viewModel = $.parseJSON(viewModel.content);
            // viewModel = _.omit(viewModel, ['configuration']);
            viewModel = _.map(_.keys(viewModel).sort(), function (key) {
                var value;

                value = viewModel[key] || '--';
                return [key, value.slice(0, 50) + (value.length > 50 ? ' ...' : '')];
            });

            // Display view.
            view = APP.utils.renderTemplate("template-message-content", {
                fields: viewModel
            });
            $(view).modal();
        }
    });

}(
    this.APP,
    this.APP.modules.messages,
    this.APP.modules.messages.templates,
    this._,
    this.Backbone,
    this.$
));
