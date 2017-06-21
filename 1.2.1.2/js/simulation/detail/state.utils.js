(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns job history collection by job type.
    MOD.getJobs = function (jobType) {
        switch (jobType) {
        case "c":
            return MOD.state.simulation.jobs.compute;
        case "p":
            return MOD.state.simulation.jobs.postProcessing;
        default:
            return [];
        }
    };

    MOD.sortJobset = function (jobSet) {
        var field, direction;

        if (!jobSet.all.length) {
            return;
        };

        // Set sort fields.
        field = MOD.state.sorting[jobSet.jobType].field;
        direction = MOD.state.sorting[jobSet.jobType].direction;

        // Sort by field.
        jobSet.all = _.sortBy(jobSet.all, field);

        // Apply sort direction.
        if (_.contains(['executionStartDate', 'executionEndDate'], field)) {
            if (direction === 'desc') {
                jobSet.all = jobSet.all.reverse();
            }
        } else if (direction === 'desc') {
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
            if (_.contains(['executionStartDate', 'executionEndDate', 'duration', 'lateness'], sortField)) {
                sortInfo.direction = 'desc';
            } else {
                sortInfo.direction = 'asc';
            }
            MOD.events.trigger('state:jobSetSortOrderChanged', jobType);
        }

        // Update cookies.
        MOD.setCookie('detail-sort-field-' + jobType, sortInfo.field);
        MOD.setCookie('detail-sort-direction-' + jobType, sortInfo.direction);

        // Update related state.
        jobSet = MOD.getJobs(jobType);
        MOD.sortJobset(jobSet);
        MOD.setJobsetPagination(jobSet, false);

        // Fire event.
        MOD.events.trigger('state:jobSetSorted', jobType);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
