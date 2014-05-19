// --------------------------------------------------------
// metric/state.js
// Manages module level state.
// --------------------------------------------------------
(function (APP, MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module state.
    MOD.state = {
        // Current group.
        group: undefined,

        // List of groups.
        groupList: [],
    };

    // Setup data loaded event handler.
    // @data    Setup data loaded from remote server.
    MOD.events.on("state:setupDataLoaded", function (data) {
        // Cache setup data.
        MOD.state.groupList = data.groupList;

        // Fire event.
        MOD.events.trigger("state:initialized", this);
    });

}(this.APP, this.APP.modules.metric));
