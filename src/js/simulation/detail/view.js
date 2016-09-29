(function (APP, MOD, _, Backbone, $) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Forward declare helper vars.
    var getJobType;

    // Main module level view.
    MOD.views.MainView = Backbone.View.extend({
        // Backbone: view HTML tag.
        tagName: 'article',

        // Backbone: view events.
        events: {
            // Open inter-monitoring page.
            'click .inter-monitoring' : function () {
                MOD.events.trigger("im:openMonitor", MOD.state.simulation);
            },

            // Open messages page.
            'click .glyphicon-envelope' : function () {
                var url;

                url = APP.utils.getPageURL(MOD.urls.SIMULATION_MESSAGES_PAGE);
                url = url.replace("{uid}", MOD.state.simulation.uid);
                APP.utils.openURL(url, true);
            },

            // Reopen page when web socket closed.
            'click #ws-close-dialog-refresh-page-button' : function () {
                APP.utils.openURL();
            },

            // Pager: navigate to manually chosen page.
            'change .pagination-info' : function (e) {
                var jobType = getJobType(e),
                    pageNumber = parseInt($(e.target).val(), 10),
                    paging = MOD.getJobs(jobType).paging;

                if (_.isNaN(pageNumber) === false &&
                    pageNumber > 0 &&
                    pageNumber <= paging.pages.length &&
                    paging.current !== paging.pages[pageNumber - 1]) {
                    paging.current = paging.pages[pageNumber - 1];
                    this._updateJobCollection(jobType);
                } else {
                    $(e.target).val("");
                }
            },

            // Pager: navigate to first page.
            'click .pagination-first' : function (e) {
                var jobType = getJobType(e),
                    paging = MOD.getJobs(jobType).paging;

                if (paging.pages.length && paging.current !== _.first(paging.pages)) {
                    paging.current = _.first(paging.pages);
                    this._updateJobCollection(jobType);
                }
            },

            // Pager: navigate to previous page.
            'click .pagination-previous' : function (e) {
                var jobType = getJobType(e),
                    paging = MOD.getJobs(jobType).paging;

                if (paging.pages.length && paging.current !== _.first(paging.pages)) {
                    paging.current = paging.pages[paging.current.id - 2];
                    this._updateJobCollection(jobType);
                }
            },

            // Pager: navigate to next page.
            'click .pagination-next' : function (e) {
                var jobType = getJobType(e),
                    paging = MOD.getJobs(jobType).paging;

                if (paging.pages.length && paging.current !== _.last(paging.pages)) {
                    paging.current = paging.pages[paging.current.id];
                    this._updateJobCollection(jobType);
                }
            },

            // Pager: navigate to last page.
            'click .pagination-last' : function (e) {
                var jobType = getJobType(e),
                    paging = MOD.getJobs(jobType).paging;

                if (paging.pages.length && paging.current !== _.last(paging.pages)) {
                    paging.current = _.last(paging.pages);
                    this._updateJobCollection(jobType);
                }
            },

            // Pager: page-size change.
            'change .pagination-page-size' : function (e) {
                var jobType = getJobType(e),
                    pageSize = $(e.target).val();

                // Update page size.
                MOD.setCookie('detail-page-size', pageSize);
                MOD.state.pageSize = pageSize;

                // Update job set pagination info.
                MOD.setJobsetPagination(MOD.getJobs(jobType), true);

                // Update view.
                this._updateJobCollection(jobType);
            },

            // Sorting: change sort field / order.
            'click .sort-target' : function (e) {
                MOD.updateSortedJobSet(getJobType(e), _.find($(e.target).attr('class').split(' '), function (cls) {
                    return cls.startsWith('sort-target-');
                }).slice(12));
            }
        },

        // Backbone: view initializer.
        initialize : function () {
            // Sorting events.
            MOD.events.on("state:jobSetSortOrderChanging", this._clearSortColumn, this);
            MOD.events.on("state:jobSetSortOrderChanged", this._setSortColumn, this);
            MOD.events.on("state:jobSetSortOrderToggled", this._toggleSortColumn, this);
            MOD.events.on("state:jobSetSorted", this._updateJobCollection, this);

            // Simulation update events.
            MOD.events.on("state:simulationUpdate", this._updateCaption, this);
            MOD.events.on("state:simulationUpdate", this._updateOverview, this);
            MOD.events.on("state:simulationUpdate", this._updateJobCollections, this);
            MOD.events.on("state:simulationUpdate", this._updateJobCounts, this);
            MOD.events.on("state:simulationUpdate", this._updateNotification, this);

            // Job update events.
            MOD.events.on("state:jobListUpdate", this._updateOverview, this);
            MOD.events.on("state:jobListUpdate", function (ei) {
                this._updateJobCollection(ei.job.typeof);
                this._updateJobCount(ei.job.typeof);
            }, this);
            MOD.events.on("state:jobListUpdate", this._updateNotification, this);

            // Web socket closed event.
            MOD.events.on("ws:socketClosed", this._displayWebSocketClosedDialog, this);
        },

        // Backbone: view renderer.
        render : function () {
            _.each([
                "template-caption",
                "template-notification",
                "template-tabs",
                "ws-close-dialog-template"
                ], function (template) {
                APP.utils.renderTemplate(template, MOD.state, this);
            }, this);
            _.each(MOD.jobTypes, function (jobType) {
                this._setSortColumn(jobType);
            }, this);

            // Initialise tooltips.
            this.$('[data-toggle="tooltip"]').tooltip({
                placement: 'right'
            });

            return this;
        },

        _clearSortColumn: function (jobType) {
            var cssSelector;

            cssSelector = this._getSortCSSSelector(jobType);
            this.$(cssSelector).removeClass('glyphicon-menu-up');
            this.$(cssSelector).removeClass('glyphicon-menu-down');
        },

        _getSortCSSSelector: function (jobType) {
            var sortInfo, cssSelector;

            sortInfo = MOD.state.sorting[jobType];
            cssSelector = "#job-collection-";
            cssSelector += jobType;
            cssSelector += " ";
            cssSelector += ".glyphicon.sort-target-";
            cssSelector += sortInfo.field;

            return cssSelector;
        },

        _setSortColumn: function (jobType) {
            var sortInfo, cssSelector;

            sortInfo = MOD.state.sorting[jobType];
            cssSelector = this._getSortCSSSelector(jobType);
            if (sortInfo.direction === 'asc') {
                this.$(cssSelector).addClass('glyphicon-menu-up');
            } else {
                this.$(cssSelector).addClass('glyphicon-menu-down');
            }
        },

        _toggleSortColumn: function (jobType) {
            this._clearSortColumn(jobType);
            this._setSortColumn(jobType);
        },

        _updateNotification: function (ei) {
            if (ei.simulation) {
                ei.eventTypeDescription = MOD.getEventDescription(ei);
            }
            if (ei.job) {
                ei.eventTypeDescription = MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() + " " + ei.eventTypeDescription;
            }
            this._replaceNode('#notification', 'template-notification', ei);
        },

        _updateCaption: function () {
            this._replaceNode("#caption", "template-caption", MOD.state);
        },

        _updateOverview: function () {
            this._replaceNode("#simulation-overview", "template-tab-overview", MOD.state);
        },

        _updateJobCollections: function () {
            _.each(MOD.jobTypes, this._updateJobCollection, this);
        },

        _updateJobCollection : function (jobType) {
            var ctx;

            ctx = {
                APP: APP,
                hidePPInfo: jobType === 'c',
                jobList: MOD.getJobs(jobType),
                jobType: jobType,
                jobTypeCaption: MOD.jobTypeDescriptions[jobType],
                MOD: MOD
            };
            this._replaceNode("#job-collection-" + jobType, "template-job-collection", ctx);
            this._setSortColumn(jobType);
        },

        _updateJobCounts: function () {
            _.each(MOD.jobTypes, this._updateJobCount, this);
        },

        _updateJobCount: function (jobType) {
            var jobs, selector;

            jobs = MOD.getJobs(jobType);
            selector = '#' + "tab-job-count-" + jobType + "-";
            this.$(selector + "running").text(jobs.running.length);
            this.$(selector + "complete").text(jobs.complete.length);
            this.$(selector + "error").text(jobs.error.length);
        },

        _displayWebSocketClosedDialog: function () {
            this.$('#ws-close-dialog').modal('show');
        },

        _replaceNode: function (nodeSelector, template, templateData) {
            this.$(nodeSelector).replaceWith(APP.utils.renderTemplate(template, templateData));
        }
    });

    // Returns job type from user event target.
    getJobType = function (e) {
        var $node;

        $node = $(e.target);
        while (!$node.attr("id")) {
            $node = $node.parent();
        }

        return $node.attr("id").startsWith('pagination') ?
               $node.attr("id").slice(11) :
               $node.attr("id").slice(15);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.Backbone,
    this.$
));
