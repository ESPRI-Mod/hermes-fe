(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.templates = {
        timeframeFilterOptions:
            "<option value='ALL'>*</option>\n\
             <option value='1W' selected='true'>< 1 week</option>\n\
             <option value='2W'>< 2 weeks</option>\n\
             <option value='1M'>< 1 month</option>\n\
             <option value='2M'>< 2 months</option>\n\
             <option value='3M'>< 3 months</option>\n\
             <option value='6M'>< 6 months</option>\n\
             <option value='12M'>< 1 year</option>"
    };

}(this.APP.modules.monitoring));
