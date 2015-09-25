(function (APP, MOD, TEMPLATES, _, Backbone, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module header view.
    var ModuleHeaderView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "header",

        // Backbone: view CSS class.
        className: "bg-primary",

        // Backbone: view events.
        events: {
            'click .simulation-details' : function () {
                var url;

                url = APP.utils.getPageURL(MOD.urls.SIMULATION_DETAIL_PAGE);
                url = url.replace("{hashid}", MOD.state.simulation.hashid);
                url = url.replace("{tryID}", MOD.state.simulation.tryID);
                url = url.replace("{uid}", MOD.state.simulation.uid);
                APP.utils.openURL(url, true);
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.header, {
                simulation: MOD.state.simulation
            }, this);

            return this;
        }
    });

    // Module footer view.
    var ModuleFooterView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "module-footer",

        // Backbone: view HTML tag.
        tagName : "footer",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.footer, {
                APP: APP,
                MOD: MOD,
                simulation: MOD.state.simulation,
                year: new Date().getFullYear()
            }, this);

            return this;
        }
    });

    // View over the grid table header.
    var TableHeaderView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "thead",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.tableHeader, this.options, this);

            return this;
        }
    });

    // View over a grid table row.
    var TableRowView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tr",

        // Backbone: view events.
        events: {
            'click > td.message-content' : function () {
                var obj = $.parseJSON(this.options.message.content);
                alert(obj);

                console.log(JSON.stringify(obj));
            }
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.tableRow, this.options, this);

            return this;
        }
    });

    // View over the grid table body.
    var TableBodyView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "tbody",

        // Backbone: view renderer.
        render : function () {
            _.each(this.options.messages, this._renderRow, this);

            return this;
        },

        // Renders a row.
        _renderRow : function (message, index) {
            APP.utils.render(TableRowView, {
                message: message,
                messageIndex: index + 1
            }, this);
        }
    });

    // View over the grid table.
    var TableView = Backbone.View.extend({
        // Backbone: view CSS class.
        className : "table table-hover table-bordered table-condensed table-striped message-history-table",

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

    // View over a collection of messages.
    var MessageCollectionView = Backbone.View.extend({
        // Backbone: view DOM element type.
        tagName : "section",

        // Backbone: view renderer.
        render : function () {
            APP.utils.renderHTML(TEMPLATES.messageCollectionHeader, this.options, this);
            APP.utils.render(TableView, this.options, this);

            return this;
        }
    });

    // View over the set of messages received during the lifetime of a simulation.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName : "article",

        // Backbone: view renderer.
        render : function () {
            APP.utils.render(ModuleHeaderView, {}, this);
            this._renderCollection("Compute", MOD.state.messageHistory.compute);
            this._renderCollection("Post Processing", MOD.state.messageHistory.postProcessing);
            APP.utils.render(ModuleFooterView, {}, this);

            return this;
        },

        // Renders a message collection.
        _renderCollection: function (jobType, messages) {
            if (messages.length) {
                APP.utils.render(MessageCollectionView, {
                    jobType: jobType,
                    messages: messages
                }, this);
            }
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
