(function (APP, MOD, PAGING, _, Backbone, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view event handlers.
        events : {
            // Open simulation detail page.
            'click > table tbody tr td:not(.monitoring):not(.inter-monitoring)' : function (e) {
                this._openSimulationDetailPage($(e.target).parent().attr("id") ||
                                               $(e.target).parent().parent().attr("id"));
            },
            // Open monitoring page.
            'click > table tbody tr td.monitoring' : function (e) {
                var s;

                s = this._getSimulation($(e.target).parent().parent().attr("id"));
                MOD.events.trigger("im:openMonitor", s);
            },
            // Open inter-monitoring page.
            'click > #inter-monitoring-context-menu a.open' : function () {
                MOD.events.trigger("im:openInterMonitor");
            },
            // Clear inter-monitoring selections.
            'click > #inter-monitoring-context-menu a.clear' : function () {
                MOD.events.trigger("im:clearInterMonitor");
            },
            // Toggle inter-monitoring selection.
            'change > table tbody tr td.inter-monitoring > input' : function (e) {
                var s;

                s = this._getSimulation($(e.target).parent().parent().attr("id"));
                s.ext.isSelectedForIM = !s.ext.isSelectedForIM;
            },
            // Pager: navigate to manually chosen page.
            'change .pagination-info' : function (e) {
                var pageNumber;

                pageNumber = parseInt($(e.target).val(), 10);
                $(e.target).val("");
                if (_.isNaN(pageNumber) ||
                    pageNumber < 1 ||
                    pageNumber > PAGING.pages.length ||
                    PAGING.current === PAGING.pages[pageNumber - 1]) {
                    return;
                }
                PAGING.current = PAGING.pages[pageNumber - 1];
                MOD.events.trigger('ui:pagination');
            },
            // Pager: navigate to first page.
            'click .pagination-first' : function () {
                if (PAGING.pages.length && PAGING.current !== _.first(PAGING.pages)) {
                    PAGING.current = _.first(PAGING.pages);
                    MOD.events.trigger('ui:pagination');
                }
            },
            // Pager: navigate to previous page.
            'click .pagination-previous' : function () {
                if (PAGING.pages.length && PAGING.current !== _.first(PAGING.pages)) {
                    PAGING.current = PAGING.pages[PAGING.current.id - 2];
                    MOD.events.trigger('ui:pagination');
                }
            },
            // Pager: navigate to next page.
            'click .pagination-next' : function () {
                if (PAGING.pages.length && PAGING.current !== _.last(PAGING.pages)) {
                    PAGING.current = PAGING.pages[PAGING.current.id];
                    MOD.events.trigger('ui:pagination');
                }
            },
            // Pager: navigate to last page.
            'click .pagination-last' : function () {
                if (PAGING.pages.length && PAGING.current !== _.last(PAGING.pages)) {
                    PAGING.current = _.last(PAGING.pages);
                    MOD.events.trigger('ui:pagination');
                }
            },
            // Reopen page when web socket closed.
            'click #ws-close-dialog-refresh-page-button' : function () {
                var baseURL, url;

                // Construct URL.
                url = baseURL = APP.utils.getBaseURL();
                _.each(MOD.state.filters, function (filter) {
                    if (filter.cvTerms.current && filter.cvTerms.current.name !== '*') {
                        url += url === baseURL ? '?' : '&';
                        url += filter.key;
                        url += '=';
                        url += filter.cvTerms.current.name;
                    }
                });

                // Redirect.
                APP.utils.openURL(url);
            }
        },

        // Backbone: view initializer.
        initialize : function () {
            // Pagination events.
            MOD.events.on("ui:pagination", this._renderPage, this);
            MOD.events.on("ui:pagination", this._renderPageNavigator, this);
            // Filter events.
            MOD.events.on("state:simulationListFiltered", this._renderStatistics, this);
            MOD.events.on("state:simulationListFiltered", this._renderPage, this);
            MOD.events.on("state:simulationListFiltered", this._renderPageNavigator, this);
            // Web-socket events.
            MOD.events.on("state:simulationComplete", this._renderWebSocketNotification, this);
            MOD.events.on("state:simulationError", this._renderWebSocketNotification, this);
            MOD.events.on("state:simulationStart", this._renderWebSocketNotification, this);
            MOD.events.on("state:jobComplete", this._renderWebSocketNotification, this);
            MOD.events.on("state:jobError", this._renderWebSocketNotification, this);
            MOD.events.on("state:jobStart", this._renderWebSocketNotification, this);
            MOD.events.on("ws:socketClosed", this._renderWebSocketClosedDialog, this);
            // Other events.
            MOD.events.on("im:postInterMonitorForm", this._openInterMonitoringForm, this);
        },

        // Backbone: view renderer.
        render : function () {
            APP.utils.render([
                MOD.views.FilterPanelView
            ], {}, this);

            // Render templates.
            _.each([
                "ws-notification-info-template",
                "filter-panel-template",
                "grid-header-template",
                "grid-template",
                "im-context-menu-template",
                "ws-close-dialog-template"
                ], function (template) {
                APP.utils.renderTemplate(template, MOD.state, this);
            }, this);

            return this;
        },

        _renderStatistics: function () {
            this._replaceNode('#grid-header-stats', 'grid-header-stats-template', MOD.state);
        },

        _renderPage: function () {
            this._replaceNode('tbody', 'grid-body-template', MOD.state);
        },

        _renderPageNavigator: function () {
            var text;

            if (PAGING.count < 2) {
                this.$('.pagination').hide();
            } else {
                this.$('.pagination').show();
            }
            text = "Page ";
            text += PAGING.current ? PAGING.current.id : '0';
            text += " of ";
            text += PAGING.count;
            this.$('.pagination-info').attr('placeholder', text);
        },

        _renderWebSocketNotification: function (ei) {
            var s;

            // Update notification panel.
            this._replaceNode('#ws-notification-info', 'ws-notification-info-template', ei);

            // Update table row.
            s = this._getSimulation(ei.simulation.uid);
            if (s) {
                this._replaceNode('#' + ei.simulation.uid, "monitoring-grid-row-template", {s: ei.simulation});
            }
        },

        _renderWebSocketClosedDialog: function () {
            this.$('#ws-close-dialog').modal('show');
        },

        _getSimulation: function (uid) {
            return _.find(MOD.state.paging.current.data, function (s) {
                return s.uid === uid;
            });
        },

        _openSimulationDetailPage: function (uid) {
            var s, url;

            s = this._getSimulation(uid);
            url = APP.utils.getPageURL(MOD.urls.SIMULATION_DETAIL_PAGE);
            url = url.replace("{hashid}", s.hashid);
            url = url.replace("{tryID}", s.tryID);
            url = url.replace("{uid}", s.uid);
            APP.utils.openURL(url, true);
        },

        _openInterMonitoringForm: function (urls) {
            var imForm;

            imForm = APP.utils.renderTemplate("im-form-template", {
                httpPostTarget: MOD.urls.IM.httpPostTarget,
                urls: urls
            });
            $(imForm).submit();
        },

        _replaceNode: function (nodeSelector, template, templateData) {
            this.$(nodeSelector).replaceWith(APP.utils.renderTemplate(template, templateData));
        }
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this.APP.modules.monitoring.state.paging,
    this._,
    this.Backbone,
    this.$
));
