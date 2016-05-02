(function (MOD, _, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Grid page size.
    cookies.set('simulation-detail-page-size',
                cookies.get('simulation-detail-page-size') || 25,
                { expires: 3650 });

    // Grid sort field.
    _.each(MOD.jobTypes, function (jobType) {
	    cookies.set('simulation-detail-sort-field-' + jobType,
	                cookies.get('simulation-detail-sort-field-' + jobType) || 'executionStartDate',
	                { expires: 3650 });
	    cookies.set('simulation-detail-sort-direction-' + jobType,
	                cookies.get('simulation-detail-sort-direction-' + jobType) || 'desc',
	                { expires: 3650 });
    });

}(
    this.APP.modules.monitoring,
    this._,
    this.Cookies
));
