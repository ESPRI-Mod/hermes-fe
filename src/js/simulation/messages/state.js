(function (APP, MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialise state backed by cookies.
    MOD.setCookieDefault('message-page-size', 25);

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
        pageSize: MOD.getCookie('message-page-size'),

        // Set of grid page size options.
        pageSizeOptions: [25, 50, 100]
    };

}(
    this.APP,
    this.APP.modules.messages
));
