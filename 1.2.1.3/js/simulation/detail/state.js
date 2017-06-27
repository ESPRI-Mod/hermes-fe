(function (APP, MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    MOD.state = {
        // Application pointer.
        APP: APP,

        // Module pointer.
        MOD: MOD,

        // Copyright year.
        year: new Date().getFullYear(),

        // Simulation configuration card.
        configCard: undefined,

        // CV terms.
        cvTerms: [],

        // Timestamp of most recent web-socket event.
        eventTimestamp: null,

        // Description of most recent web-socket event.
        eventTypeDescription: null,

        // Simulation try identifier.
        simulationUID: APP.utils.getURLParam('uid'),

        // Simulation.
        simulation: undefined,

        // Set of previous tries.
        previousTries: {},

        // Has associated messages.
        hasMessages: false,

        // Size of grid pages.
        pageSize: undefined,

        // Set of grid page size options.
        pageSizeOptions: [25, 50, 100],

        // Sorting related state.
        sorting: {}
    };

    // Set state derived from cookies.
    MOD.state.pageSize = MOD.getCookie('detail-page-size');
    _.each(MOD.jobTypes, function (jobType) {
        MOD.state.sorting[jobType] = {
            field: MOD.getCookie('detail-sort-field-' + jobType),
            direction: MOD.getCookie('detail-sort-direction-' + jobType)
        };
    });

}(
    this.APP,
    this.APP.modules.monitoring,
    this._
));
