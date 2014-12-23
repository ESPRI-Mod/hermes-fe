(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.templates = {
        info: {
            pagerItem: "<a href='#'><%- id %></ a>"
        },

        grid: {
            header: "<tr class='bg-primary'>\n\
                        <th title='Activity'>Activity</th>\n\
                        <th title='Name' class='col-md-2'>Name</th>\n\
                        <th title='Node - Machine'>Node - Machine</th>\n\
                        <th title='Login'>Login</th>\n\
                        <th title='Tag / Model'>Tag / Model</th>\n\
                        <th title='Space'>Space</th>\n\
                        <th title='Experiment' class='col-md-2'>Experiment</th>\n\
                        <th title='Start'>Start</th>\n\
                        <th title='End'>End</th>\n\
                        <th title='monitoring'>M</th>\n\
                        <th title='inter-monitoring'>IM</th>\n\
                    </tr>",

            row: "<td class='activity text-uppercase' title='<%= activity %>'><%= activity %></td>\n\
                  <td class='name' title='<%= name %>'><%= name %></td>\n\
                  <td class='computeNodeMachine text-uppercase' title='<%= computeNodeMachine %>'><%= computeNodeMachine %></td>\n\
                  <td class='computeNodeLogin' title='<%= computeNodeLogin %>'><%= computeNodeLogin %></td>\n\
                  <td class='model text-uppercase' title='<%= model %>'><%= model %></td>\n\
                  <td class='space text-uppercase' title='<%= space %>'><%= space %></td>\n\
                  <td class='experiment' title='<%= experiment %>'><%= experiment %></td>\n\
                  <td class='executionStartDate' title='<%= executionStartDate %>'><%= executionStartDate.substring(0, 10) %></td>\n\
                  <td class='executionEndDate' title='<%= executionEndDate %>'><%= executionEndDate.substring(0, 10) %></td>\n\
                  <td class='linkToMonitoring' title='Hyperlink to monitoring'><span class='glyphicon glyphicon-random'></span></td>\n\
                  <td class='linkToInterMonitoring' title='Hyperlink to inter-monitoring'><input type='checkbox'></input></td>"
        },
    };

}(this.APP.modules.monitoring));
