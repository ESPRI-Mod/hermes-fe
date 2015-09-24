(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare constants used across module.
    MOD.constants = {
        // Delay in seconds before a job is considered to be dead / delayed.
        jobWarningDelay: 86400
    };

}(
    this.APP.modules.monitoring
));
