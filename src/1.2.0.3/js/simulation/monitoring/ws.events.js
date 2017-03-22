(function (APP, MOD, $, _, moment) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler: websocket initialized.
    var onInitializationEvent = function () {
        $.getJSON(APP.utils.getEndPoint(MOD.urls.FETCH_CV), function (data) {
            MOD.events.trigger("cv:dataFetched", data);
        });
    };

    // Event handler: job start/complete/error.
    // @data    Event information received from server.
    var onJobEvent = function (data) {
        var j, s;

        // Map event data.
        j = MOD.mapJob(data.job);

        // Set simulation (escape if not in memory).
        if (_.has(MOD.state.simulationSet, j.simulationID) === false) {
            return;
        }
        s = MOD.state.simulationSet[j.simulationID];

        // Signal.
        MOD.events.trigger("ws:jobUpdating");

        // Update job counts.
        if (data.eventType === 'jobStart') {
            s.jobCounts.all += 1;
            s.jobCounts[j.typeof].all += 1;
            s.jobCounts[j.typeof].r += 1;
        } else if (data.eventType === 'jobComplete') {
            s.jobCounts[j.typeof].c += 1;
            s.jobCounts[j.typeof].r -= 1;
        } else if (data.eventType === 'jobError') {
            s.jobCounts[j.typeof].e += 1;
            s.jobCounts[j.typeof].r -= 1;
        }

        // Update latest compute job.
        if (j.typeof === 'c' &&
            moment(j.executionStartDate) > moment(s.ext.latestComputeJob.executionStartDate)) {
            s.ext.latestComputeJob = j;
        }

        // Update execution end date.
        MOD.setSimulationExecutionEndDate(s);

        // Update execution state.
        MOD.setSimulationExecutionState(s);

        // Fire event.
        MOD.events.trigger("ws:jobUpdated", _.extend(data, {
            simulation: s
        }));
    };

    // Job period event handler.
    // @data    Event information received from server.
    var onJobPeriodUpdate = function (data) {
        var jp = data, s, wasParsed;

        // Escape if simulation is not in memory.
        if (_.has(MOD.state.simulationUIDSet, jp.simulationUID) === false) {
            return;
        }
        s = MOD.state.simulationUIDSet[jp.simulationUID];

        // Signal.
        MOD.events.trigger("ws:jobPeriodUpdating");

        // Parse job period.
        wasParsed = MOD.parseJobPeriod(s, jp);

        // Fire event.
        if (wasParsed) {
            MOD.events.trigger("ws:jobPeriodUpdated", _.extend(jp, {
                simulation: s
            }));
        }
    };

    // Event handler: simulation start/complete/error.
    // @data    Event information received from server.
    var onSimulationEvent = function (data) {
        var s = data.simulation, jp = data.jobPeriod, relatedSimulation;

        // Escape if a later try is already in memory.
        if (_.has(MOD.state.simulationHashSet, s.hashid)) {
            relatedSimulation = MOD.state.simulationHashSet[s.hashid];
            if (moment(relatedSimulation.executionStartDate) > moment(s.executionStartDate)) {
                return;
            }
        }

        // Map incoming data.
        if (jp) {
            jp = {
                startDate: jp.periodDateBegin
            };
        }
        data.jobCounts = _.map(data.jobCounts, MOD.mapJobCount);
        if (data.latestComputeJob) {
            data.latestComputeJob = MOD.mapJob(data.latestComputeJob);
        }

        // Signal.
        MOD.events.trigger("ws:simulationUpdating");

        console.log(data);

        // Update state: cv terms.
        MOD.state.cvTerms = _.union(MOD.state.cvTerms, data.cvTerms);
        _.each(data.cvTerms, function (term) {
            if (_.has(MOD.state.filterSet, term.typeof)) {
                MOD.state.filterSet[term.typeof].cvTerms.all.push(term);
            }
        });
        console.log("CV terms updated");

        // Update state: simulations.
        MOD.state.simulationList = _.filter(MOD.state.simulationList, function (i) {
            return i.hashid !== s.hashid;
        });
        MOD.state.simulationList.push(s);
        MOD.state.simulationSet = _.indexBy(MOD.state.simulationList, "id");
        MOD.state.simulationHashSet = _.indexBy(MOD.state.simulationList, "hashid");
        MOD.state.simulationUIDSet = _.indexBy(MOD.state.simulationList, "uid");
        console.log("Simulation sets updated");

        // Set simulation extenstion info.
        MOD.extendSimulation(s);
        console.log("Simulation extended");

        // Set job counts;
        _.each(data.jobCounts, function (jc) {
            s.jobCounts[jc.jobType][jc.jobState] = jc.count;
            s.jobCounts[jc.jobType].all += jc.count;
            s.jobCounts.all += jc.count;
        });
        console.log("Simulation job counts assigned");

        // Set latest compute job;
        s.ext.latestComputeJob = data.latestComputeJob;
        console.log("Simulation latest compute job assigned");

        // Set latest job period;
        MOD.parseJobPeriod(s, jp);
        console.log("Simulation latest job period parsed");

        // Set execution end date.
        MOD.setSimulationExecutionEndDate(s);
        console.log("Simulation execution end date assigned");

        // Set execution state.
        MOD.setSimulationExecutionState(s);
        console.log("Simulation execution state assigned");

        // Update filtered simulations.
        MOD.updateFilteredSimulationList();

        // Update active filter terms.
        MOD.updateActiveFilterTerms();

        // Update pagination.
        MOD.updatePagination(MOD.state.paging.current);

        // Fire events.
        MOD.events.trigger("ws:simulationUpdated", data);
        MOD.events.trigger("simulationTimesliceUpdated");
    };

    // Map events to handlers.
    MOD.events.on("ws:initialized", onInitializationEvent);
    MOD.events.on("ws:jobComplete", onJobEvent);
    MOD.events.on("ws:jobError", onJobEvent);
    MOD.events.on("ws:jobPeriodUpdate", onJobPeriodUpdate);
    MOD.events.on("ws:jobStart", onJobEvent);
    MOD.events.on("ws:simulationComplete", onSimulationEvent);
    MOD.events.on("ws:simulationError", onSimulationEvent);
    MOD.events.on("ws:simulationStart", onSimulationEvent);

}(
    this.APP,
    this.APP.modules.monitoring,
    this.$,
    this._,
    this.moment
));
