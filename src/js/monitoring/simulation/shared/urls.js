(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare URL's used across module.
    MOD.urls = {
        // CV setup data endpoint.
        CV: 'monitoring/fe/cv',

        // Monitoring setup data endpoint.
        SETUP_ALL: 'monitoring/fe/setup/all',

        // Page setup data endpoint.
        SETUP_ONE: 'monitoring/fe/setup/one?uid={uid}',

        // Simulation page.
        SIMULATION_PAGE: 'monitoring.simulation.one.html?uid={uid}',

        // Web-socket endpoint.
        WS_ALL: 'monitoring/fe/ws/all',

        // Web-socket endpoint.
        WS_ONE: 'monitoring/fe/ws/uid={uid}',

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
