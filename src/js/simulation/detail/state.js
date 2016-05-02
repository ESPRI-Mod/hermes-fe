(function (APP, MOD, _, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialise state backed by cookies.
    cookies.set('simulation-detail-page-size',
                cookies.get('simulation-detail-page-size') || 25, { expires: 3650 });

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
        pageSize: cookies.get('simulation-detail-page-size'),

        // Set of grid page size options.
        pageSizeOptions: [25, 50, 100],

        // Sorting related state.
        sorting: {
            allFields: ['postProcessingInfo', 'executionStartDate', 'executionEndDate', 'duration', 'delayWarning', 'lateness'],
            computing: {
                field: 'executionStartDate',
                direction: 'desc'
            },
            'post-processing': {
                field: 'executionStartDate',
                direction: 'desc'
            },
            'post-processing-from-checker': {
                field: 'executionStartDate',
                direction: 'desc'
            }
        }
    };

}(
    this.APP,
    this.APP.modules.monitoring,
    this._,
    this.Cookies
));
