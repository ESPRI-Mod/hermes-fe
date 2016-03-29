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

    // Sets pagination for a collection of jobs.
    MOD.setJobsetPagination = function (jobSet) {
        var currentPage = jobSet.paging.current,
            pages = APP.utils.getPages(jobSet.all, MOD.state.pageSize),
            page;

        // Reset pages.
        jobSet.paging.count = pages.length;
        jobSet.paging.current = pages ? pages[0] : null;
        jobSet.paging.pages = pages;

        // Ensure current page is respected when pages collection changes.
        if (currentPage) {
            page = _.find(pages, function (p) {
                return _.indexOf(p.data, currentPage.data[0]) !== -1;
            });
            if (page) {
                jobSet.paging.current = page;
            }
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
