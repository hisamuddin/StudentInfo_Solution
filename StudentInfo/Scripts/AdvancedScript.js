$(document).ready(function () {

    var _rowid;
    $("#jqGrid").jqGrid({
        url: "/Student/GetStudents",
        datatype: 'json',
        mtype: 'Get',
        colNames: ['StudentId', 'FirstName', 'LastName', 'Gender', 'Class'],
        colModel: [
            { key: true, hidden: true, name: 'StudentId', index: 'StudentId', editable: true },
            { key: false, name: 'FirstName', index: 'FirstName', editable: true },
            { key: false, name: 'LastName', index: 'LastName', editable: true },
            { key: false, name: 'Gender', index: 'Gender', editable: true, edittype: 'select', editoptions: { value: { 'M': 'Male', 'F': 'Female', 'N': 'None' } } },
            { key: false, name: 'Class', index: 'Class', editable: true, edittype: 'select', editoptions: { value: { '1': '1st Class', '2': '2nd Class', '3': '3rd Class', '4': '4th Class', '5': '5th Class' } } }
        ],
        sortable: true,
        viewrecords: true,
        ignoreCase: true,
        height: 300,
        width: 900,
        rowNum: 40,
        rowList: [10, 20, 30, 100],
        pager: "#jqGridPager",
        subGridBeforeExpand: function (divid, rowid) {
            _rowid = rowid;
            var expanded = jQuery("td.sgexpanded", "#jqGrid")[0];
            if (expanded) {
                setTimeout(function () {
                    $(expanded).trigger("click");
                }, 100);
            }
        },
        jsonReader: {
            subgrid: { repeatitems: false }
        },
        subGrid: true, // set the subGrid property to true to show expand buttons for each row
        subGridRowExpanded: showChildGrid, // javascript function that will take care of showing the child grid
        subGridOptions: {
            "plusicon": "ui- icon - triangle - 1 - e",
            "minusicon": "ui - icon - triangle - 1 - s",
            "openicon": "ui - icon - arrowreturn - 1 - e",
            "reloadOnExpand": false,
            "selectOnExpand": true
        }
    });

    $('#jqGrid').navGrid("#jqGridPager", {
        search: true, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    },
        {}, // edit options
        {}, // add options
        {} // delete options
        // search options – define multiple search
    );
    function showChildGrid(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var _officeid = $("#jqGrid").jqGrid("getCell", _rowid, "OfficeID");
        var _agentid = $("#jqGrid").jqGrid("getCell", _rowid, "AgentID");
        $('#' + parentRowID).append('<table id=' + childGridID + '></table > <div id=' + childGridPagerID + ' class= scroll ></div >');
        $("#" + childGridID).jqGrid({
            url: 'DataFiles.htm',
            editurl: "DataFiles.htm",
            mtype: "POST",
            datatype: "json",
            postData: { oper: 'loadsubgrid', mode: 'assistant', method: 'data', AgentID: _agentid, OfficeID: _officeid },
            page: 1,
            colModel: [
                { label: 'Agent ID', name: 'pAgentID', align: "left", width: 300, key: true, index: 'pAgentID' },
                {
                    label: 'Personal Assistant', name: 'pName', align: "left", width: 400, stype: 'select', editable: true, edittype: "select",
                    editoptions: {
                        dataUrl: 'DataFiles.htm ? oper = loadselect & mode=assistant& method=data& parent_id=' + _rowid + '& OfficeID=' + _officeid + '& AgentID=' + _agentid
                    }
                }
            ],
            width: 500,
            height: '100 %',
            pager: "#" + childGridPagerID//,
        });
        $("#" + childGridID).navGrid("#" + childGridPagerID, {
            search: false, // show search button on the toolbar
            add: true,
            edit: false,
            del: true,
            refresh: true
        },
            {}, // edit options
            { // add options
                mtype: "POST",
                closeAfterAdd: true,
                closeAfterEdit: true,
                reloadAfterSubmit: true,
                addCaption: "Add Personal Assistanat",
                bSubmit: "Add",
                bCancel: "Cancel",
                left: 250,
                top: 200,
                onclickSubmit: function (rowid) {
                    _OfficeID = $("#jqGrid").jqGrid("getCell", _rowid, "OfficeID");
                    _AgentID = $("#jqGrid").jqGrid("getCell", _rowid, "AgentID");
                    var val = $(this).getCell(rowid, 'pAgentID');
                    return { oper: 'add_subgrid_row', mode: 'assistant', method: 'data', parent_id: _rowid, OfficeID: _OfficeID, AgentID: _AgentID };
                },
                afterSubmit: function (response, postdata) {
                    success = true;
                    message = 'OK';
                    new_id = 1;

                    //this forces true always, need more work here for error checking

                    _Assistants = $("#jqGrid").jqGrid("getCell", _rowid, "Assistants");
                    _Assistants = parseInt(_Assistants) + 1;
                    $("#jqGrid").jqGrid('setCell', _rowid, 'Assistants', _Assistants);

                    return [true, ", "];
                }

            },
            { // delete options
                mtype: "POST",
                onclickSubmit: function (rowid) {
                    var myGrid = $("#" + childGridID);
                    selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                        celValue = myGrid.jqGrid('getCell', selRowId, 'pAgentID');
                    _OfficeID = $("#jqGrid").jqGrid("getCell", _rowid, "OfficeID");
                    _AgentID = $("#jqGrid").jqGrid("getCell", _rowid, "AgentID");

                    _Assistants = $("#jqGrid").jqGrid("getCell", _rowid, "Assistants");
                    _Assistants = parseInt(_Assistants) - 1;
                    $("#jqGrid").jqGrid('setCell', _rowid, 'Assistants', _Assistants);

                    return { oper: 'del_subgrid_row', mode: 'assistant', method: 'data', parent_id: _rowid, AgentID: _AgentID, OfficeID: _OfficeID };
                },

                //need more work here for error checking, possibly in afterSubmit

                beforeShowForm: function (form) {
                    _this_row = jQuery(this).jqGrid('getGridParam', 'selrow');
                    _this_name = $(this).jqGrid("getCell", _this_row, "pName");

                    $("td.delmsg", form).html("xDo you really want delete <b>" + _this_name + "</b >?");
                },
                width: 300,
                addCaption: "Delete Personal Assistanat",
                left: 250,
                top: 200
            },
            { // search options – define multiple search
                multipleSearch: true,
                multipleGroup: true,
                showQuery: true,
                groupOps: [{ op: "AND", text: "and" }, { op: "OR", text: "or" }, { op: "NOT", text: "not" }],
                matchText: "match"
            }
        );

    }
});