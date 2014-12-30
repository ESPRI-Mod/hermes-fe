(function (MOD) {

    // ECMAScript 5 Strict Mode
    "use strict";

    MOD.templates = {
        info: {
            pagerItem: "<a href='#'><%- id %></ a>"
        },

        grid: {
            contextMenu:
                "<ul class='dropdown-menu' role='menu'>\n\
                    <li><a tabindex='-1' class='open'>Open inter-monitoring</a></li>\n\
                    <li><a tabindex='-1' class='clear'>Clear selections</a></li>\n\
                </ul>",

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
                        <th title='monitoring'></th>\n\
                        <th class='interMonitoring' title='Open inter-monitoring menu' data-toggle='context' data-target='#imContextMenu'>\n\
                          <span class='glyphicon glyphicon-random'></span>\n\
                        </th>\n\
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
                  <td class='monitoring' title='Open monitoring'><span class='glyphicon glyphicon-random'></span></td>\n\
                  <td class='interMonitoring' title='Select for inter-monitoring'><input type='checkbox'></input></td>"
        },

        imInput : "<input type='hidden' id=<%= key %> name=<%= key %> value=<%= value %>></ input>",

        wsClose: "<div class='modal-dialog'>\n\
                <div class='modal-content'>\n\
                    <div class='modal-header'>\n\
                        <h4 class='modal-title' id='wsCloseDialogLabel'><%= app.title %> <%= mod.title %> v<%= mod.version %></h4>\n\
                    </div>\n\
                    <div class='modal-body'>\n\
                        The Prodiguer web socket server connection has been interrupted.\n\
                    </div>\n\
                    <div class='modal-footer'>\n\
                        <button type='button' class='btn btn-primary' id='wsCloseRefreshPageButton'>Refresh page</button>\n\
                    </div>\n\
                </div>\n\
            </div>"
    };

}(this.APP.modules.monitoring));
