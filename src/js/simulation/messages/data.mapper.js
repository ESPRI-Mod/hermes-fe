(function (APP, MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Maps message info from data returned from server.
    MOD.mapMessage = function (i) {
        return {
            content: i[0],
            emailID: i[1],
            jobUID: i[2],
            processed: APP.utils.toLocalDateTimeString(i[3]),
            producerVersion: i[4],
            timestamp: i[5],
            typeID: i[6],
            uid: i[7],
        };
    };

}(
    this.APP,
    this.APP.modules.messages
));
