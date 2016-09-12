// --------------------------------------------------------
// app/constants.js
// Application level constants shared across modules.
// --------------------------------------------------------
(function (APP) {

    // ECMAScript 5 Strict Mode
    "use strict";

    APP.constants = {
        // Default module key.
        defaultModule: undefined,

        // Set of email related constants.
        email : {
            // Support email.
            support : "platform-users@ipsl.jussieu.fr",

            // Default email subject.
            defaultSubject: "IPSL :: HERMES SUPPORT",

            // Default email message.
            defaultMessage: "",
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
            PREFIX: "HERMES :: "
        },

        // Paging defaults.
        paging: {
            itemsPerPage: 25
        }
    };

}(this.APP));