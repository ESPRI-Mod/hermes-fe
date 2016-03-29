(function (MOD, numeral, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Returns job post-processing information.
    var getPostProcessingInfo = function (job) {
        var ppFields = [];

        if (job.postProcessingName && job.postProcessingName !== 'null') {
            ppFields.push(job.postProcessingName);
        }
        if (job.postProcessingDate && job.postProcessingDate !== 'null') {
            // ppFields.push(job.postProcessingDate);
            ppFields.push(moment(job.postProcessingDate, "YYYYMMDD").format("YYYY-MM-DD"));
        }
        if (job.postProcessingDimension && job.postProcessingDimension !== 'null') {
            ppFields.push(job.postProcessingDimension);
        }
        if (job.postProcessingComponent && job.postProcessingComponent !== 'null') {
            ppFields.push(job.postProcessingComponent);
        }
        if (job.postProcessingFile && job.postProcessingFile !== 'null') {
            ppFields.push(job.postProcessingFile);
        }
        return ppFields.join(".");
    };

    // Parses a message in readiness for processing.
    MOD.parseMessage = function (msg) {
        msg.latency = numeral(moment(msg.processed).diff(msg.timestamp, 's')).format("00:00:00");
        if (msg.latency.length === 7) {
            msg.latency = "0" + msg.latency;
        }
        if (msg.typeID === "2000" || msg.typeID === "3000") {
            msg.jobInfo = getPostProcessingInfo($.parseJSON(msg.content));
        } else {
            msg.jobInfo = "--";
        }
    };

}(
    this.APP.modules.messages,
    this.numeral,
    this.moment
));
