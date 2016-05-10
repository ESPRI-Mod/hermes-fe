(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns a persistent URL to return to page state at a later date.
    MOD.getPersistentURL = function () {
        var url;

        url = APP.utils.getPageURL(MOD.urls.SIMULATION_MONITORING_PAGE);
        url += "?";
        url += "sortField=";
        url += MOD.state.sorting.field;
        url += "&sortDirection=";
        url += MOD.state.sorting.direction;
        url += "&";
        _.each(MOD.state.filters, function (filter) {
            if (filter.key === "timeslice" ||
                filter.key === "activity" ||
                filter.cvTerms.current.name != filter.defaultValue) {
                url += filter.cookieKey;
                url += "=";
                url += filter.cvTerms.current.name;
                url += "&";
            }
        });

        return url.slice(0, url.length - 1);
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
