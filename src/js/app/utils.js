(function (APP, constants, $, _, moment, window) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Cache of loaded templates.
    var templateCache = {};

    // Array used to determine month offsets.
    var DAYS_ELAPSED = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

    APP.utils = {
        // Outputs info message to brwoser logging console.
        // @msg          Logging message.
        log: function (msg) {
            console.log(new Date() + " :: [INFO] :: " + constants.logging.PREFIX + msg);
        },

        // Outputs warning message to brwoser logging console.
        // @msg          Logging message.
        logWarning: function (msg) {
            console.log(new Date() + " :: [WARNING] :: " + constants.logging.PREFIX + msg);
        },

        // Returns an endpoint address.
        // @ep          Endpoint to be invoked.
        // @protocol    Communications protocol (ws | http).
        getEndPoint: function (ep, protocol) {
            var host;

            // Set default protocol.
            if (_.isUndefined(protocol)) {
                protocol = APP.constants.protocols.HTTP;
            }

            // Append protocol suffix for secure endpoints.
            if (window.location.protocol.indexOf("s") !== -1) {
                protocol += "s";
            }

            if (!window.location.host) {
                host = "localhost:8888";
            } else {
                host = window.location.host;
            }

            // Derive endpoint.
            return "{0}://{1}/api/1/{2}"
                .replace("{0}", protocol)
                .replace("{1}", host)
                .replace("{2}", ep);
        },

        // Returns URL to a static page within the application.
        // @page         Page name.
        getPageURL: function (page) {
            var protocol;

            // Set protocol.
            protocol = APP.constants.protocols.HTTP;

            // Append protocol suffix for secure endpoints.
            if (window.location.protocol.indexOf("s") !== -1) {
                protocol += "s";
            }

            // Derive url.
            return "{0}://{1}/static/{2}"
                .replace("{0}", protocol)
                .replace("{1}", window.location.host)
                .replace("{2}", page);
        },

        // Renders a view.
        // @type          View type.
        // @options       View options.
        // @container     View container.
        render : function (types, options, container) {
            var typeset, view, rendered = [];

            typeset = _.isArray(types) ? types : [types];
            _.each(typeset, function (ViewType) {
                view = new ViewType(options).render();
                rendered.push(view);
                if (!_.isUndefined(container)) {
                    if (_.has(container, '$el')) {
                        container.$el.append(view.$el);
                    } else {
                        container.append(view.$el);
                    }
                }
            }, this);

            return typeset.length === 1 ? rendered[0] : rendered;
        },

        // Renders an html view and injects it into DOM.
        renderHTML : function (template, data, container) {
            var html = data ? template(data) : template();

            if (!_.isUndefined(container)) {
                if (_.has(container, '$el')) {
                    container.$el.append(html);
                } else {
                    container.append(html);
                }
            }
        },

        // Returns a rendered template.
        renderTemplate: function (templateID, templateData, view) {
            var template;

            if (!_.has(templateCache, templateID)) {
                templateCache[templateID] = _.template($('#' + templateID).html());
            }
            template = templateCache[templateID];
            if (view && view.$el) {
                view.$el.append(template(templateData));
            } else if (view) {
                view.replaceWith(template(templateData));
            } else {
                return template(templateData);
            }
        },

        // Renders a date tie field.
        renderDateTime: function (value) {
            if (_.isNull(value)) {
                return "--";
            }
            if (_.isUndefined(value)) {
                return "N/A";
            }
            if (_.isString(value)) {
                value = moment(value);
            }
            return value.format("DD-MM-YYYY HH:mm:ss");
        },

        // Renders a date field.
        renderDate: function (value) {
            if (_.isNull(value)) {
                return "--";
            }
            if (_.isUndefined(value)) {
                return "N/A";
            }
            if (_.isString(value)) {
                value = moment(value);
            }
            return value.format("DD-MM-YYYY");
        },

        // Converts a date field to number of days.
        // Assumes value format = "YYYY-MM-DD".
        convertDateToDays: function (value) {
            var year, month, day, result;

            year = parseInt(value.substring(0, 4), 10);
            month = parseInt(value.substring(5, 7), 10);
            day = parseInt(value.substring(8, 10), 10);

            result = parseInt(year * 365.25, 10) +
                   DAYS_ELAPSED[month - 1] +
                   day - 1;

            console.log("----");
            console.log(value);
            console.log(year);
            console.log(month);
            console.log(day);
            console.log(result);

            return result;
        },

        // Renders a time duration field.
        renderDuration: function (value) {
            var formatted;

            formatted = value ? value.format("HH:mm:ss") : "--";
            if (formatted.length === 7) {
                formatted = "0" + formatted;
            }
            return formatted;
        },

        // Gets count of pages to be rendered.
        // @data    Data to be displayed via pager.
        getPageCount: function (data, itemsPerPage) {
            var pageCount = 0,
                itemCount = _.isArray(data) ? data.length : data;

            if (itemCount) {
                itemsPerPage = itemsPerPage || constants.paging.itemsPerPage;
                pageCount = parseInt(itemCount / itemsPerPage, 10);
                if (itemCount / itemsPerPage > pageCount) {
                    pageCount += 1;
                }
            }

            return pageCount;
        },

        // Retrieves collection of pages to be rendered.
        // @data        Data to be displayed via pager.
        getPages: function (data, itemsPerPage) {
            itemsPerPage = itemsPerPage || constants.paging.itemsPerPage;
            return !_.isArray(data) ? [] : _.map(_.range(this.getPageCount(data, itemsPerPage)), function (id) {
                return {
                    id: id + 1,
                    data: this.slice(id * itemsPerPage, ((id + 1) * itemsPerPage))
                };
            }, data);
        },

        // Recursively compile templates.
        compileTemplates: function (templates) {
            _.each(templates, function (v, k) {
                if (_.isObject(v)) {
                    APP.utils.compileTemplates(v);
                } else {
                    templates[k] = _.template(v);
                }
            });
        },

        // Returns URL query param value.
        // @name                URL query param name.
        // @defaultValue        URL query param default value.
        getURLParam: function (name, defaultValue) {
            var result;

            // Extract param from url.
            result = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);

            // Return param (default if unspecified).
            if (!result) {
                if (defaultValue) {
                    return defaultValue;
                }
                return undefined;
            }
            return (result[1] || defaultValue);
        },

        // Opens the target email.
        // @address         Target email address.
        // @subject         Target email subject.
        // @message         Target email message.
        openEmail: function (address, subject, message) {
            window.location.href = "mailto:{0}?subject={1}&body={2}"
                .replace('{0}', address)
                .replace('{1}', subject || APP.constants.email.defaultSubject)
                .replace('{2}', message || APP.constants.email.defaultMessage);
        },

        // Returns current URL stripped of query parameters.
        getBaseURL: function () {
            return window.location.origin + window.location.pathname;
        },

        // Opens the target url.
        openURL: function (url, inTab) {
            if (url) {
                if (inTab === true) {
                    window.open(url);
                } else {
                    window.location = url;
                }
            } else {
                window.location = window.location;
            }
        },

        // Opens support email.
        openSupportEmail: function () {
            APP.utils.openEmail(APP.constants.email.support);
        },

        // Opens institute home page.
        openInstituteHomePage: function () {
            APP.utils.openURL(APP.institute.homePage, true);
        },

        // Returns a flag indicating whether the value is considered to be none.
        isNone: function (value) {
            return value === 'None' ||
                   value === 'NONE' ||
                   _.isNull(value) ||
                   _.isUndefined(value);
        },

        // Returns a mapped cv term.
        mapCVTerm: function (term) {
            return {
                displayName: term[0],
                id: term[1],
                name: term[1],
                sortKey: (term[4] + ":" + (term[2] || term[1])).toLowerCase(),
                synonyms: _.isString(term[3]) ? term[3].split(', ') : term[3],
                text: term[0],
                typeof: term[4],
                uid: term[5]
            };
        },

        // Parses set of cv terms retrieved from server.
        parseCVTerms: function (terms) {
            return _.sortBy(_.map(terms, APP.utils.mapCVTerm), 'sortKey');
        }
    };

}(
    this.APP,
    this.APP.constants,
    this.$,
    this._,
    this.moment,
    this.window
));