(function (_, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Grid page size.
    cookies.set('simulation-monitoring-page-size',
                cookies.get('simulation-monitoring-page-size') || 25,
                { expires: 3650 });

    // Grid sort field.
    cookies.set('simulation-monitoring-sort-field',
                cookies.get('simulation-monitoring-sort-field') || 'executionStartDate',
                { expires: 3650 });

    // Grid sort direction.
    cookies.set('simulation-monitoring-sort-direction',
                cookies.get('simulation-monitoring-sort-direction') || 'desc',
                { expires: 3650 });

    // Filters.
    _.each([
        ['timeslice', "1W"],
        ['activity', "ipsl"],
        ['machine', "*"],
        ['accounting-project', "*"],
        ['login', "*"],
        ['model', "*"],
        ['experiment', "*"],
        ['space', "*"],
        ['state', "*"],
    ], function (spec) {
        cookies.set('simulation-monitoring-filter-' + spec[0],
                    cookies.get('simulation-monitoring-filter-' + spec[0]) || spec[1],
                    { expires: 3650 });
    });

}(
    this._,
    this.Cookies
));
