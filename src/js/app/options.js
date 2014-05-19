// --------------------------------------------------------
// app/options.js
// Application options manager.
// --------------------------------------------------------
(function(APP, _) {
    
    // ECMAScript 5 Strict Mode
    "use strict";

    // Set default options.
    var options = APP.options = {
        // Execution mode.
        mode : APP.constants.modes.DEV,

        // Sets a single option.
        // @name    Option name.
        // @value   Option value.
        setOption : function (name, value) {
            options.setOptions({
                name : value
            });
        },

        // Sets options.
        // @opts    Options to be assigned.
        setOptions : function (opts) {
            // Error if options are not in correct format.
            if (_.isObject(opts) === false) {
                APP.events.trigger("app:error", {
                    type : 'Set Options',
                    errors : ["App options must be passed as an object."]
                });
                return;
            }

            // Option : mode.
            if (_.has(opts, 'mode')) {
                if (_.indexOf(APP.constants.modes.all, opts.mode) === -1) {
                    APP.events.trigger("app:error", {
                        type : 'Set Options',
                        errors : ["App mode option [{0}] is unsupported".replace('{0}', opts.mode)]
                    });
                    return;
                }
                options.mode = opts.mode;
            }
        }
    };

}(this.APP, this._));
