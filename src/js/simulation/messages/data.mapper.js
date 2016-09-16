(function (APP, MOD, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Maps message info from data returned from server.
    MOD.mapMessage = function (i) {
        return {
            content: i[0],
            emailID: i[1],
            jobInfo: null,
            jobUID: i[2],
            latency: null,
            processed: i[3] ? moment(i[3]) : null,
            producerVersion: i[4],
            timestamp: i[5] ? moment(i[5]) : null,
            typeID: i[6],
            uid: i[7],
        };
    };

}(
    this.APP,
    this.APP.modules.messages,
    this.moment
));
