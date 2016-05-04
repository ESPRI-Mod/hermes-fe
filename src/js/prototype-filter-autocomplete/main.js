// --------------------------------------------------------
// $ :: JQuery nonconflict reference.
// See :: http://www.tvidesign.co.uk/blog/improve-your-jquery-25-excellent-tips.aspx#tip19
// --------------------------------------------------------
window.$ = window.$jq = jQuery.noConflict();

// --------------------------------------------------------
// app/main.js
// Application entry point.
// --------------------------------------------------------
(function (root, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Root Application module.
    root.APP = {
        // Institute information.
        institute: {
            // Code.
            code: "IPSL",

            // Long name.
            longName: "Institut Pierre Simon Laplace",

            // Home page.
            homePage: "http://www.ipsl.fr/",

            // GitHub page.
            githubPage: "https://github.com/Prodiguer/prodiguer-docs/wiki",

            // Documentation page.
            docPage: "http://prodiguer-docs.readthedocs.org/en/latest/"
        },

        // App title.
        title: "HERMES",

        // App version.
        version : "0.4.4.2",

        // App copyright statement.
        copyrightYear: new Date().getFullYear(),

        // App Event dispatcher.
        events: _.extend({}, Backbone.Events),
    };



}(
    this,
    this._,
    this.Backbone
));