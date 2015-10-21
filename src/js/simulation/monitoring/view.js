(function (APP, MOD, PAGING, _, Backbone, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view event handlers.
        events : {
            // Open simulation detail page.
            'click table tbody tr td:not(.monitoring):not(.inter-monitoring)' : function (e) {
                this._openSimulationDetailPage($(e.target).parent().attr("id") ||
                                               $(e.target).parent().parent().attr("id"));
            },
            // Open monitoring page.
            'click table tbody tr td.monitoring' : function (e) {
                var s;

                s = this._getSimulation($(e.target).parent().parent().attr("id"));
                MOD.events.trigger("im:openMonitor", s);
            },
            // Toggle inter-monitoring selection.
            'change table tbody tr td.inter-monitoring > input' : function (e) {
                var s;

                s = this._getSimulation($(e.target).parent().parent().attr("id"));
                s.ext.isSelectedForIM = !s.ext.isSelectedForIM;
            },
            // Open inter-monitoring page.
            'click #inter-monitoring-context-menu a.open' : function () {
                MOD.events.trigger("im:openInterMonitor");
            },
            // Clear inter-monitoring selections.
            'click #inter-monitoring-context-menu a.clear' : function () {
                MOD.events.trigger("im:clearInterMonitor");
            },
            // Pager: navigate to manually chosen page.
            'change .pagination-info' : function (e) {
                var pageNumber;

                pageNumber = parseInt($(e.target).val(), 10);
                $(e.target).val("");
                if (_.isNaN(pageNumber) === false &&
                    pageNumber > 0 &&
                    pageNumber <= PAGING.pages.length &&
                    PAGING.current !== PAGING.pages[pageNumber - 1]) {
                    PAGING.current = PAGING.pages[pageNumber - 1];
                    MOD.events.trigger('state:simulationPageUpdate');
                }
            },
            // Pager: navigate to first page.
            'click .pagination-first' : function () {
                if (PAGING.pages.length && PAGING.current !== _.first(PAGING.pages)) {
                    PAGING.current = _.first(PAGING.pages);
                    MOD.events.trigger('state:simulationPageUpdate');
                }
            },
            // Pager: navigate to previous page.
            'click .pagination-previous' : function () {
                if (PAGING.pages.length && PAGING.current !== _.first(PAGING.pages)) {
                    PAGING.current = PAGING.pages[PAGING.current.id - 2];
                    MOD.events.trigger('state:simulationPageUpdate');
                }
            },
            // Pager: navigate to next page.
            'click .pagination-next' : function () {
                if (PAGING.pages.length && PAGING.current !== _.last(PAGING.pages)) {
                    PAGING.current = PAGING.pages[PAGING.current.id];
                    MOD.events.trigger('state:simulationPageUpdate');
                }
            },
            // Pager: navigate to last page.
            'click .pagination-last' : function () {
                if (PAGING.pages.length && PAGING.current !== _.last(PAGING.pages)) {
                    PAGING.current = _.last(PAGING.pages);
                    MOD.events.trigger('state:simulationPageUpdate');
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
            },
            // Filter: value change.
            'change select:not(.custom-filter)': function (e) {
                MOD.updateFilterValue($(e.target).attr("id").slice(16),
                                      $(e.target).val());
            },
            // Filter: value change (timeslice).
            'change #filter-selector-timeslice': function (e) {
                MOD.fetchTimeSlice($(e.target).val(), true);
            }
        },

        // Backbone: view initializer.
        initialize : function () {
            // Pagination events.
            MOD.events.on("state:simulationPageUpdate", this._updateGrid, this);
            MOD.events.on("state:simulationPageUpdate", this._updateGridPager, this);
            MOD.events.on("state:filterOptionsUpdate", this._updateFilterSelector, this);

            // Simulation list filtered event.
            MOD.events.on("state:simulationListUpdate", this._updateStatisticsInfo, this);
            MOD.events.on("state:simulationListUpdate", this._updateGrid, this);
            MOD.events.on("state:simulationListUpdate", this._updateGridPager, this);

            // Simulation update events.
            MOD.events.on("state:simulationUpdate", this._updateNotificationInfo, this);

            // Job update events.
            MOD.events.on("state:jobUpdate", this._updateNotificationInfo, this);
            MOD.events.on("state:jobUpdate", this._updateGridRow, this);

            // Other events.
            MOD.events.on("ws:socketClosed", this._displayWebSocketClosedDialog, this);
            MOD.events.on("im:postInterMonitorForm", this._openInterMonitoringPage, this);
        },

        // Backbone: view renderer.
        render : function () {
            _.each([
                "notification-info-template",
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

        _updateNotificationInfo: function (ei) {
            // Set event type description.
            if (ei.simulation) {
                ei.simulationDetailURL = this._getSimulationDetailURL(ei.simulation.uid);
                ei.eventTypeDescription = MOD.getEventDescription(ei);
            }

            // Update UI.
            this._replaceNode('#notification-info', 'notification-info-template', ei);
        },

        _updateFilterSelector: function (filter) {
            this._replaceNode("#filter-selector-" + filter.key, "filter-selector-template", filter);
        },

        _updateStatisticsInfo: function () {
            this._replaceNode('#statistics-info', 'statistics-info-template', MOD.state);
        },

        _updateGridPager: function () {
            var text;

            this.$('.pagination').removeClass('hidden');
            if (PAGING.count < 2) {
                this.$('.pagination').addClass('hidden');
            }
            text = "Page ";
            text += PAGING.current ? PAGING.current.id : '0';
            text += " of ";
            text += PAGING.count;
            this.$('.pagination-info').attr('placeholder', text);
        },

        _updateGrid: function () {
            this._replaceNode('tbody', 'grid-body-template', MOD.state);
        },

        _updateGridRow: function (ei) {
            var s;

            s = this._getSimulation(ei.simulation.uid);
            if (s) {
                APP.utils.renderTemplate("grid-row-template", {s: ei.simulation});
                this._replaceNode('#' + ei.simulation.uid, "grid-row-template", {s: ei.simulation});
            }
        },

        _displayWebSocketClosedDialog: function () {
            this.$('#ws-close-dialog').modal('show');
        },

        _openSimulationDetailPage: function (uid) {
            APP.utils.openURL(this._getSimulationDetailURL(uid), true);
        },

        _openInterMonitoringPage: function (urls) {
            var imForm;

            imForm = APP.utils.renderTemplate("im-form-template", {
                httpPostTarget: MOD.urls.IM.httpPostTarget,
                urls: urls
            });
            $(imForm).submit();
        },

        _getSimulation: function (uid) {
            return _.find(MOD.state.paging.current.data, function (s) {
                return s.uid === uid;
            });
        },

        _getSimulationDetailURL: function (uid) {
            var s, url;

            s = this._getSimulation(uid);
            url = APP.utils.getPageURL(MOD.urls.SIMULATION_DETAIL_PAGE);
            url = url.replace("{hashid}", s.hashid);
            url = url.replace("{tryID}", s.tryID);
            url = url.replace("{uid}", s.uid);

            return url;
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