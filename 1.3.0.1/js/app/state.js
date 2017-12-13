// --------------------------------------------------------
// app/state.js
// Manages application level state.
// --------------------------------------------------------
(function(APP, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    var state = APP.state = {
        // Current module.
        module: undefined,

        // List of modules.
        moduleList: [],

        // Returns set of active modules.
        getActiveModules: function () {
            return _.where(state.moduleList, { "isActive": true });
        }
    };

}(this.APP, this._));
