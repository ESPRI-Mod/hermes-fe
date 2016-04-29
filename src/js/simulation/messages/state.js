(function (APP, MOD, _, cookies) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialise state backed by cookies.
    cookies.set('simulation-message-page-size',
                cookies.get('simulation-message-page-size') || 25, { expires: 3650 });

    // Module state.
    MOD.state = {
        // Application pointer.
        APP: APP,

        // Copyright year.
        year: new Date().getFullYear(),

        // Simulation.
        simulation: null,

        // Simulation hash identifier.
        simulationUID: APP.utils.getURLParam('uid'),

        // Size of grid pages.
        pageSize: cookies.get('simulation-message-page-size'),

        // Set of grid page size options.
        pageSizeOptions: [25, 50, 100]
    };

}(
    this.APP,
    this.APP.modules.messages,
    this._,
    this.Cookies
));
