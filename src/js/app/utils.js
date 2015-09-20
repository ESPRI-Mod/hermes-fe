(function(APP, constants, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    APP.utils = {
        // Outputs message to brwoser logging console.
        // @msg          Logging message.
        log: function(msg) {
            console.log(constants.logging.PREFIX + msg);
        },

        // Returns an endpoint address on the test server.
        // @ep          Endpoint to be invoked.
        getTestServerEndPoint: function(ep) {
            return "https://prodiguer-test-web.ipsl.fr/api/1/{0}".replace("{0}", ep);
        },

        // Returns an endpoint address.
        // @ep          Endpoint to be invoked.
        // @protocol    Communications protocol (ws | http).
        getEndPoint: function(ep, protocol) {
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
        getPageURL: function(page) {
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

        // Gets count of pages to be rendered.
        // @data    Data to be displayed via pager.
        getPageCount: function(data) {
            var pageCount = 0, 
                itemCount = _.isArray(data) ? data.length : data;

            if (itemCount) {
                pageCount = parseInt(itemCount / constants.paging.itemsPerPage);
                if (itemCount / constants.paging.itemsPerPage > pageCount) {
                    pageCount += 1;
                }
            }

            return pageCount;
        },

        // Retrieves collection of pages to be rendered.
        // @data        Data to be displayed via pager.
        getPages: function (data) {
            return !_.isArray(data) ? [] : _.map(_.range(this.getPageCount(data)), function (id) {
                return {
                    id: id + 1,
                    data: this.slice(id * constants.paging.itemsPerPage, ((id + 1) * constants.paging.itemsPerPage))
                };
            }, data);
        },

        // Recursively compile templates.
        compileTemplates: function(templates) {
            _.each(templates, function(v, k) {
                if (_.isObject(v)) {
                    APP.utils.compileTemplates(v);
                } else {
                    templates[k] = _.template(v);
                }
            })
        },

        // Returns URL query param value.
        // @name                URL query param name.
        // @defaultValue        URL query param default value.
        getURLParam: function(name, defaultValue) {
            var result;

            // Extract param from url.
            result = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);

            // Return param (default if unspecified).
            if (!result) {
                if (defaultValue) {
                    return defaultValue;
                } else {
                    return undefined;
                }
            } else {
                return (result[1] || defaultValue);
            }
        },

        // Opens the target email.
        // @address         Target email address.
        // @subject         Target email subject.
        // @message         Target email message.
        openEmail: function(address, subject, message) {
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
        openURL: function(url, inTab) {
            if (url) {
                if (inTab === true) {
                    window.open(url);
                } else {
                    window.location = url;
                }
            }
        },

        // Opens support email.
        openSupportEmail: function() {
            APP.utils.openEmail(APP.constants.email.support);
        },

        // Opens institute home page.
        openInstituteHomePage: function() {
            APP.utils.openURL(APP.institute.homePage, true);
        },

        // Formats a date field.
        formatDateField: function (obj, attr) {
            if (obj[attr]) {
                obj[attr] = moment(obj[attr]);
                obj.ext = obj.ext || {};
                obj.ext[attr] = obj[attr].format('DD-MM-YYYY');
            }
        },

        // Formats a date time field.
        formatDateTimeField: function (obj, attr) {
            if (obj[attr]) {
                obj[attr] = moment(obj[attr]);
                obj.ext = obj.ext || {};
                obj.ext[attr] = obj[attr].format('DD-MM-YYYY HH:mm:ss');
            }
        },

        // Returns a flag indicating whether the value is considered to be none.
        isNone: function (value) {
            return value === 'None' ||
                   _.isNull(value) ||
                   _.isUndefined(value);
        }
    };

}(
    this.APP,
    this.APP.constants,
    this._,
    this.moment
));