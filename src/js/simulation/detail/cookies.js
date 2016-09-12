(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Grid page size.
    MOD.setCookieDefault('detail-page-size', 25);

    // Grid sort field.
    _.each(MOD.jobTypes, function (jobType) {
        MOD.setCookieDefault('detail-sort-field-' + jobType, 'executionStartDate');
        MOD.setCookieDefault('detail-sort-direction-' + jobType, 'desc');
    });

}(
    this.APP.modules.monitoring,
    this._
));
