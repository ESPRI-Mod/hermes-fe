(function (APP, MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns related set of messages.
    MOD.getMessageSet = function (messageType) {
        switch (messageType) {
        case "compute":
            return MOD.state.messageHistory.compute;
        case "post-processing":
            return MOD.state.messageHistory.postProcessing;
        case "post-processing-from-checker":
            return MOD.state.messageHistory.postProcessingFromChecker;
        default:
            return [];
        }
    };

    // Sets pageable collection of messages.
    MOD.setMessageSetPagination = function (messageSet) {
        var pages = APP.utils.getPages(messageSet.all, MOD.state.pageSize);

        messageSet.paging = {
            current: pages ? pages[0] : null,
            count: pages.length,
            pages: pages
        };
    };

}(
    this.APP,
    this.APP.modules.messages
));
