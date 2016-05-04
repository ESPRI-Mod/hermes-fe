(function (APP, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";






    var initApp = function () {



        $('.typeahead').bind('typeahead:select', function(e) {
            
            console.log('Selection: ' + $(e.target).val());

        });

        $('.typeahead').bind('typeahead:autocomplete', function(e) {
            
            console.log('autocomplete: ' + $(e.target).val());

        });

        $('.typeahead').bind('change', function(e, autocomplete) {
            
            console.log('change: ' + $(e.target).val());

        });
    };

    // Document ready event handler.
    $(document).ready(initApp);
}(
    this.APP,
    this.$,
    this._
));