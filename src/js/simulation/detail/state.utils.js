(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns job history collection by job type.
    MOD.getJobs = function (jobType) {
        switch (jobType) {
        case "computing":
            return MOD.state.simulation.jobs.compute;
        case "post-processing":
            return MOD.state.simulation.jobs.postProcessing;
        case "post-processing-from-checker":
            return MOD.state.simulation.jobs.postProcessingFromChecker;
        default:
            return [];
        }
    };

    MOD.sortJobset = function (jobSet) {
        var sortInfo;

        if (jobSet.all.length === 0) {
            return;
        };

        sortInfo = MOD.state.sorting[jobSet.jobType];

        // Sort by field.
        if (_.contains([
            'postProcessingInfo',
            'executionStartDate',
            'executionEndDate',
            'duration',
            'warningDelay',
            'lateness'], sortInfo.field)) {
            jobSet.all = _.sortBy(jobSet.all, sortInfo.field);
        }

        // Apply sort direction.
        if (_.contains(['executionStartDate', 'executionEndDate'], sortInfo.field)) {
            if (sortInfo.direction === 'desc') {
                jobSet.all = jobSet.all.reverse();
            }
        } else if (sortInfo.direction === 'desc') {
            jobSet.all = jobSet.all.reverse();
        }

        return;

        if (_.contains(['name', 'accountingProject', 'computeNodeLogin'], sortInfo.field)) {
            jobSet.all = _.sortBy(jobSet.all, sortInfo.field);

        } else if (_.contains(['computeNodeMachine', 'model', 'space', 'experiment'], sortInfo.field)) {
            jobSet.all = _.sortBy(jobSet.all, function (s) {
                return s.ext[sortInfo.field].toLowerCase();
            });

        } else if (_.contains(['executionStartDate', 'executionEndDate'], sortInfo.field)) {
            jobSet.all = _.sortBy(jobSet.all, function (s) {
                return s[sortInfo.field];
                // return s[sortInfo.field].valueOf();
            });
        }

        // Apply sort direction.
        if (_.contains(['executionStartDate', 'executionEndDate'], sortInfo.field)) {
            if (sortInfo.direction === 'desc') {
                jobSet.all = jobSet.all.reverse();
            }
        } else if (sortInfo.direction === 'desc') {
            jobSet.all = jobSet.all.reverse();
        }
    };

    // Sets pagination for a collection of jobs.
    MOD.setJobsetPagination = function (jobSet, retainCurrent) {
        var currentPage = jobSet.paging.current,
            pages = APP.utils.getPages(jobSet.all, MOD.state.pageSize),
            page;

        // Reset pages.
        jobSet.paging.count = pages.length;
        jobSet.paging.current = pages ? pages[0] : null;
        jobSet.paging.pages = pages;

        // Ensure current page is respected when pages collection changes.
        if (retainCurrent && currentPage) {
            page = _.find(pages, function (p) {
                return _.indexOf(p.data, currentPage.data[0]) !== -1;
            });
            if (page) {
                jobSet.paging.current = page;
            }
        }
    };

    // Updates filtered simulations sort order.
    MOD.updateSortedJobSet = function (jobType, sortField) {
        var sortInfo, jobSet;

        // Update sort fields.
        sortInfo = MOD.state.sorting[jobType];
        if (sortInfo.field === sortField) {
            sortInfo.direction = (sortInfo.direction === 'asc' ? 'desc' : 'asc');
            MOD.events.trigger('state:jobSetSortOrderToggled', jobType);
        } else {
            MOD.events.trigger('state:jobSetSortOrderChanging', jobType);
            sortInfo.field = sortField;
            sortInfo.direction = 'asc';
            MOD.events.trigger('state:jobSetSortOrderChanged', jobType);
        }

        jobSet = MOD.getJobs(jobType);
        MOD.sortJobset(jobSet);
        MOD.setJobsetPagination(jobSet, false);
        MOD.events.trigger('state:jobSetSorted', jobType);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
