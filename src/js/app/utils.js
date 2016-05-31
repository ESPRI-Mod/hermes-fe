(function (APP, constants, $, _, moment, window) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Cache of loaded templates.
    var templateCache = {};

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
        },

        // Converts a YYYY-MM-DD HH:mm:ss.SSSSSS UTC string into a local datetime.
        toLocalDateTimeString: function (val) {
            return moment(val.slice(0, 19)).add(1, 'h').format("YYYY-MM-DD HH:mm:ss") +
                   val.slice(19);
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