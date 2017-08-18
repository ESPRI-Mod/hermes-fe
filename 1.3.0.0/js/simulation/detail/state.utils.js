(function (APP, MOD, STATE, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns job history collection by job type.
    MOD.getJobs = function (jobType) {
        switch (jobType) {
        case "c":
            return STATE.simulation.jobs.compute;
        case "p":
            return STATE.simulation.jobs.postProcessing;
        default:
            return [];
        }
    };

    // Returns description of a simulation related event.
    MOD.getEventDescription = function (ei) {
        switch (ei.eventType) {
        case 'simulationComplete':
            return "SIMULATION COMPLETED";
        case 'simulationError':
            return "SIMULATION ERROR";
        case 'simulationStart':
            if (ei.simulation.ext.isRestart === false) {
                return "SIMULATION STARTED";
            }
            return "SIMULATION RESTARTED";
        case 'jobComplete':
            if (_.has(MOD.jobTypeDescriptions, ei.job.typeof)) {
                return MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() + " JOB COMPLETED";
            } else {
                return "JOB COMPLETED";
            }
        case 'jobError':
            if (_.has(MOD.jobTypeDescriptions, ei.job.typeof)) {
                return MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() + " JOB ERROR";
            } else {
                return "JOB ERROR";
            }
        case 'jobStart':
            if (_.has(MOD.jobTypeDescriptions, ei.job.typeof)) {
                return MOD.jobTypeDescriptions[ei.job.typeof].toUpperCase() + " JOB STARTED";
            } else {
                return "JOB STARTED";
            }
        case 'jobPeriodUpdate':
            return "OUTPUT PERIOD UPDATED";
        default:
            break;
        }
    };

    // Sorts jobsets in readiness for rendering.
    MOD.sortJobset = function (jobSet) {
        var field, direction;

        if (!jobSet.all.length) {
            return;
        };

        // Set sort fields.
        field = STATE.sorting[jobSet.jobType].field;
        direction = STATE.sorting[jobSet.jobType].direction;

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

    // Sets jobset pagination.
    MOD.setJobsetPagination = function (jobSet, retainCurrent) {
        var currentPage = jobSet.paging.current,
            pages = APP.utils.getPages(jobSet.all, STATE.pageSize),
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
        sortInfo = STATE.sorting[jobType];
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
    this.APP.modules.monitoring.state,
    this._
));
