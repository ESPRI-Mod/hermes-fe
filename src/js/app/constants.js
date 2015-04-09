// --------------------------------------------------------
// app/constants.js
// Application level constants shared across modules.
// --------------------------------------------------------
(function (APP) {

    // ECMAScript 5 Strict Mode
    "use strict";

    var constants = APP.constants = {
        // Default module key.
        defaultModule: "monitoring",

        // Set of email related constants.
        email : {
            // Contact email.
            contact : "platform-users@ipsl.jussieu.fr",

            // Support email.
            support : "platform-users@ipsl.jussieu.fr",

            // Default email subject.
            defaultSubject: "{0} {1} :: please enter subject here"
                            .replace("{0}", APP.institute.code.toUpperCase())
                            .replace("{1}", APP.title.toUpperCase()),

            // Default email message.
            defaultMessage: "Dear {0} {1} support team,"
                            .replace("{0}", APP.institute.code.toUpperCase())
                            .replace("{1}", APP.title.toUpperCase()),
        },

        // Application modes.
        modes : {
            all : ['dev', 'test', 'prod'],
            DEV : 'dev',
            TEST : 'test',
            PROD : 'prod'
        },

        // Communications protocols.
        protocols: {
            HTTP: 'http',
            WS: 'ws'
        },

        // Images.
        images: {
            logo: "img/site-logo-ipsl.png"
        },

        // Logging related.
        logging: {
            PREFIX: "PRODIGUER :: "
        },

        // Paging defaults.
        paging: {
            itemsPerPage: 20
        }
    };

}(this.APP));