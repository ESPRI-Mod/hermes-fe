(function (APP, MOD, _, Backbone, $) {

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
                url = url.replace("{uid}", MOD.state.simulation.uid);
                APP.utils.openURL(url, true);
            },

            // Display message content.
            'click td.message-content' : function (e) {
                var messageUID;

                messageUID = $(e.target).parent().parent().parent().attr("id");
                this._renderMessageContent(messageUID);
            },

            // Pager: navigate to manually chosen page.
            'change .pagination-info' : function (e) {
                var messageType = $(e.target).parent().attr("id").slice(11),
                    messageCollection = MOD.state.getMessageCollection(messageType),
                    paging = messageCollection.paging,
                    pageNumber = parseInt($(e.target).val(), 10);

                if (_.isNaN(pageNumber) === false &&
                    pageNumber > 0 &&
                    pageNumber <= paging.pages.length &&
                    paging.current !== paging.pages[pageNumber - 1]) {
                    paging.current = paging.pages[pageNumber - 1];
                    this._updateMessageCollection(messageType, messageCollection);
                } else {
                    $(e.target).val("");
                }
            },

            // Pager: navigate to first page.
            'click .pagination-first' : function (e) {
                var messageType = ($(e.target).parent().attr("id") ||
                                   $(e.target).parent().parent().attr("id")).slice(11),
                    messageCollection = MOD.state.getMessageCollection(messageType),
                    paging = messageCollection.paging;

                if (paging.pages.length && paging.current !== _.first(paging.pages)) {
                    paging.current = _.first(paging.pages);
                    this._updateMessageCollection(messageType, messageCollection);
                }
            },

            // Pager: navigate to previous page.
            'click .pagination-previous' : function (e) {
                var messageType = ($(e.target).parent().attr("id") ||
                                   $(e.target).parent().parent().attr("id")).slice(11),
                    messageCollection = MOD.state.getMessageCollection(messageType),
                    paging = messageCollection.paging;

                if (paging.pages.length && paging.current !== _.first(paging.pages)) {
                    paging.current = paging.pages[paging.current.id - 2];
                    this._updateMessageCollection(messageType, messageCollection);
                }
            },

            // Pager: navigate to next page.
            'click .pagination-next' : function (e) {
                var messageType = ($(e.target).parent().attr("id") ||
                                   $(e.target).parent().parent().attr("id")).slice(11),
                    messageCollection = MOD.state.getMessageCollection(messageType),
                    paging = messageCollection.paging;

                if (paging.pages.length && paging.current !== _.last(paging.pages)) {
                    paging.current = paging.pages[paging.current.id];
                    this._updateMessageCollection(messageType, messageCollection);
                }
            },

            // Pager: navigate to last page.
            'click .pagination-last' : function (e) {
                var messageType = ($(e.target).parent().attr("id") ||
                                   $(e.target).parent().parent().attr("id")).slice(11),
                    messageCollection = MOD.state.getMessageCollection(messageType),
                    paging = messageCollection.paging;

                if (paging.pages.length && paging.current !== _.last(paging.pages)) {
                    paging.current = _.last(paging.pages);
                    this._updateMessageCollection(messageType, messageCollection);
                }
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderTemplate("template-messages-header", MOD.state, this);
            APP.utils.renderTemplate("template-tabs", MOD.state, this);

            return this;
        },

        // Renders an inividual message content.
        _renderMessageContent: function (uid) {
            var view, viewModel;

            // Set view model.
            viewModel = _.find(MOD.state.messageHistory.all, function (m) {
                return m.uid === uid;
            });
            viewModel = $.parseJSON(viewModel.content);
            viewModel = _.map(_.keys(viewModel).sort(), function (key) {
                var value;

                value = viewModel[key] || '--';
                if (_.isString(value)) {
                    value = value.slice(0, 45) + (value.length > 45 ? ' ...' : '');
                }

                return [key, value];
            });

            // Display view.
            view = APP.utils.renderTemplate("template-message-content", {
                fields: viewModel
            });
            $(view).modal();
        },

        _updateMessageCollection : function (messageType, messageCollection) {
            this._replaceNode("#message-collection-" + messageType, "template-message-collection", {
                MOD: MOD,
                messages: messageCollection,
                messageType: messageType,
                messageTypeDescription: MOD.messageTypeDescriptions[messageType],
                displayPostProcessingJobInfo: messageType !== "compute",
                pageSize: MOD.state.messageCollectionPageSize
            });
        },

        _replaceNode: function (nodeSelector, template, templateData) {
            this.$(nodeSelector).replaceWith(APP.utils.renderTemplate(template, templateData));
        }
    });

}(
    this.APP,
    this.APP.modules.messages,
    this._,
    this.Backbone,
    this.$
));
