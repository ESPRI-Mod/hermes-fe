(function (MOD, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Module data parser.
    MOD.parser = {
        // Parses loaded timeslice.
        parseTimeslice: function (simulations, jobs) {
            // Extend simulations.
            _.each(simulations, MOD.extendSimulation);
            MOD.log("timeslice simulations extended");

            // Parse jobs.
            _.each(jobs, function (j) {
                MOD.parseJob(MOD.state.simulationSet[j.simulationUID], j)
            });
            MOD.log("timeslice jobs mapped");

            // Sort compute jobs (required in order to determine simulation execution status).
            _.each(simulations, function (s) {
                s.jobs.compute.all = _.sortBy(s.jobs.compute.all, 'executionStartDate');
            });
            MOD.log("timeslice compute jobs sorted");

            // Set execution end dates.
            _.each(simulations, MOD.setSimulationExecutionEndDate);
            MOD.log("timeslice simulation end dates assigned");

            // Set execution states.
            _.each(simulations, MOD.setSimulationExecutionState);
            MOD.log("timeslice simulation compute state assigned");
        },

        // Parses web-socket event data.
        parseEvent: function (s, jobs) {
            // Extend simulation.
            MOD.extendSimulation(s);

            // Parse jobs.
            _.each(jobs, function (j) {
                MOD.parseJob(s, j);
            });

            // Sort compute jobs (required in order to determine simulation execution status).
            s.jobs.compute.all = _.sortBy(s.jobs.compute.all, 'executionStartDate');

            // Set derived execution end date (necessary if 0100 not sent).
            MOD.setSimulationExecutionEndDate(s);

            // Set execution state.
            MOD.setSimulationExecutionState(s);
        }
    };
}(
    this.APP.modules.monitoring,
    this._
));
