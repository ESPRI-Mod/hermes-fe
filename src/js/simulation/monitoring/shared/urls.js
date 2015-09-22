(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare URL's used across module.
    MOD.urls = {
        // Fetch CV data endpoint.
        FETCH_CV: 'simulation/monitoring/fetch_cv',

        // Fetch monitoring time slice endpoint.
        FETCH_TIMESLICE: 'simulation/monitoring/fetch_timeslice?timeslice={timeslice}',

        // Fetch monitoring one simulation endpoint.
        FETCH_ONE: 'simulation/monitoring/fetch_one?hashid={hashid}&tryID={tryID}',

        // Simulation page.
        SIMULATION_PAGE: 'simulation.monitoring.one.html?hashid={hashid}&tryID={tryID}',

        // Web-socket endpoint.
        WS_ALL: 'simulation/monitoring/ws/all',

        // Web-socket endpoint.
        WS_ONE: 'simulation/monitoring/ws/one?uid={uid}',

        // Monitoring endpoints.
        M: {
            'ccrt': 'https://esgf.extra.cea.fr/thredds/fileServer/work',
            'idris': 'http://prodn.idris.fr/thredds/fileServer/ipsl_public',
            'ipsl': 'http://esgf-local.ipsl.fr/thredds/fileServer/ipsl_public',
            'tgcc': 'https://esgf.extra.cea.fr/thredds/fileServer/work'
        },

        // Inter-monitoring endpoints.
        IM: {
            'httpPostTarget': 'http://webservices.ipsl.jussieu.fr/monitoring_fromprodiguer/index.php',
            'ccrt': 'http://esgf.extra.cea.fr/thredds/dodsC/work',
            'idris': 'http://prodn.idris.fr/thredds/dodsC/ipsl_public',
            'ipsl': 'http://esgf-local.ipsl.fr/thredds/dodsC/ipsl_public',
            'tgcc': 'http://esgf.extra.cea.fr/thredds/dodsC/work'
        }
    };

}(
    this.APP.modules.monitoring
));
