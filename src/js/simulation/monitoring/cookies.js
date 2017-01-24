(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Grid page size.
    MOD.setCookieDefault('page-size', 25);
    MOD.setCookieDefault('sort-field', 'name');
    MOD.setCookieDefault('sort-direction', 'desc');

    // Filters.
    _.each([
        ['timeslice', "1W"],
        ['machine', "*"],
        ['accounting-project', "*"],
        ['login', "*"],
        ['model', "*"],
        ['experiment', "*"],
        ['space', "*"],
        ['state', "*"],
    ], function (spec) {
        MOD.setCookieDefault('filter-' + spec[0], spec[1]);
    });

}(
    this.APP.modules.monitoring,
    this._
));
