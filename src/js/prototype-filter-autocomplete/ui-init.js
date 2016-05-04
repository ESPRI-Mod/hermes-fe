(function (APP, $, _) {

    // ECMAScript 5 Strict Mode
    "use strict";


    // Controlled vocabularies loaded event handler.
    // @data    Data loaded from remote server.
    APP.events.on("fetch:cvDataLoaded", function (data) {

        _.each(APP.state.filters, function (f) {
            if (f.initialValue != '*') {
                $("#filter-"+ f.key + " > input").val(f.initialValue);
            }
        });

        _.each(APP.state.filters, function (f) {
            f.bh = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                identify: function(obj) { return obj.name; },
                local: f.cvTerms.all
            });
        });

        _.each(APP.state.filters, function (f) {
            $('#filter-' + f.key + ' .typeahead').typeahead({
                    highlight: true,
                    minLength: 0
                }, {
                    display: 'displayName',
                    name: f.key,
                    limit: 500,
                    source: function (q, sync) {
                        if (q === '') {
                            sync(f.bh.get(_.pluck(f.cvTerms.all, 'name')));
                        } else {
                            f.bh.search(q, sync);
                        }
                    }
            });
        });

        APP.events.trigger("filters:initialised", data);
    });

}(
    this.APP,
    this.$,
    this._
));