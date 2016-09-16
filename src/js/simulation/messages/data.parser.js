(function (MOD, $, numeral, moment) {

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

    // Parses a message in readiness for rendering.
    MOD.parseMessage = function (msg) {
        // Set post-processing job information.
        if (msg.typeID === "2000" || msg.typeID === "3000") {
            msg.jobInfo = getPostProcessingInfo($.parseJSON(msg.content));
        }
        // Set message processing latency.
        if (msg.timestamp && msg.processed) {
            msg.latency = msg.processed.diff(msg.timestamp, 's');
            msg.latency = numeral(msg.latency);
        }
    };

}(
    this.APP.modules.messages,
    this.$,
    this.numeral,
    this.moment
));
