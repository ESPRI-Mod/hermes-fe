(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns a persistent URL to return to page state at a later date.
    MOD.getPermalink = function () {
        var url;

        url = APP.utils.getPageURL(MOD.urls.SIMULATION_MONITORING_PAGE, true);
        url += "?";

        // Append filter fields.
        _.each(MOD.state.filters, function (filter) {
            if (filter.key === "timeslice" ||
                filter.cvTerms.current.name != filter.defaultValue) {
                url += filter.cookieKey;
                url += "=";
                url += filter.cvTerms.current.name;
                url += "&";
            }
        });

        // Append sort fields.
        url += "sortField=";
        url += MOD.state.sorting.field.key;
        url += "&";
        url += "sortDirection=";
        url += MOD.state.sorting.direction.key;

        return url;
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
