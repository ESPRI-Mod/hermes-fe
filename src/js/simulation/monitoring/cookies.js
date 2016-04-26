(function (_, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Grid page size.
    cookies.set('simulation-monitoring-page-size',
                cookies.get('simulation-monitoring-page-size') || 25);

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
        console.log(spec[0] + ":c:" + cookies.get('simulation-monitoring-filter-' + spec[0]));
        cookies.set('simulation-monitoring-filter-' + spec[0],
                    cookies.get('simulation-monitoring-filter-' + spec[0]) || spec[1]);
    });

}(
    this._,
    this.Cookies
));
