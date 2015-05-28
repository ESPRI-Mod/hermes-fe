(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare URL's used across module.
    MOD.urls = {
        // Monitoring setup data endpoint.
        SETUP: 'monitoring/fe/setup',

        // Simulation page.
        SIMULATION_PAGE: 'simulation.html?uid={uid}',

        // CV setup data endpoint.
        CV: 'monitoring/fe/cv',

        // Web-socket endpoint.
        WS: 'monitoring/fe/ws',

        // Monitoring endpoints.
        M: {
            'ccrt': 'https://esgf.extra.cea.fr/thredds/fileServer/work',
            'idris': 'https://prodn.idris.fr/thredds/fileServer/ipsl_public',
            'tgcc': 'https://esgf.extra.cea.fr/thredds/fileServer/work'
        },

        // Inter-monitoring endpoints.
        IM: {
            'httpPostTarget': 'http://webservices.ipsl.jussieu.fr/monitoring_fromprodiguer/index.php',
            'ccrt': 'http://esgf.extra.cea.fr/thredds/dodsC/work',
            'idris': 'https://prodn.idris.fr/thredds/fileServer/ipsl_public',
            'tgcc': 'http://esgf.extra.cea.fr/thredds/dodsC/work'
        }
    };

}(
    this.APP.modules.monitoring
));
