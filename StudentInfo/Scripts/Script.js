$(function () {

    var myGridData = [
        // main grid data
        { id: "1", col1: "11", col2: "12" },
        { id: "2", col1: "21", col2: "22" }
    ],
        mySubgrids = {
            1: [
                // data for subgrid for the id=m1
                { id: "s1a", c1: "aa", c2: "ab", c3: "ac" },
                { id: "s1b", c1: "ba", c2: "bb", c3: "bc" },
                { id: "s1c", c1: "ca", c2: "cb", c3: "cc" }
            ],
            2: [
                // data for subgrid for the id=m2
                { id: "s2a", c1: "xx", c2: "xy", c3: "xz" }
            ]
        };
    $("#jqGrid").jqGrid({
        url: "/Student/GetStudents",
        datatype: 'json',
        mtype: 'Get',
        colNames: ['StudentId', 'FirstName', 'LastName', 'Gender', 'Class'],
        colModel: [
            { key: true, hidden: false, name: 'StudentId', index: 'StudentId', editable: true },
            { key: false, name: 'FirstName', index: 'FirstName', editable: true },
            { key: false, name: 'LastName', index: 'LastName', editable: true },
            { key: false, name: 'Gender', index: 'Gender', editable: true, edittype: 'select', editoptions: { value: { 'M': 'Male', 'F': 'Female', 'N': 'None' } } },
            { key: false, name: 'Class', index: 'Class', editable: true, edittype: 'select', editoptions: { value: { '1': '1st Class', '2': '2nd Class', '3': '3rd Class', '4': '4th Class', '5': '5th Class' } } }
            //{ key: false, hidden: true, name: 'Name', align: "right", index: 'Name', editable: true },
            //{ key: false, hidden: true, name: 'Marks', align: "right", index: 'Marks', editable: true }
        ],
        pager: jQuery('#jqControls'),
        rowNum: 10,
        sortname: 'StudentId',
        sortorder: 'asc',
        rowList: [10, 20, 30, 40, 50],
        height: '100%',
        viewrecords: true,
        subGrid: true,
       
        iconSet: "fontAwesome",
       
     
       
      
       
      
        multiSort: true,
        sortable: true,
        loadonce: true,
        additionalProperties: ['Class', 'ClassLang'],
        autoencode: true,
        cmTemplate: {
            autoResizable: true
        },
        autoresizeOnLoad: true,
        autowidth: true,
        autoResizing: {
            //resetWidthOrg: true,
            compact: true
        },
        caption: 'Students Records',
        emptyrecords: 'No Students Records are Available to Display',
        jsonReader: {
            root: "rows",
            page: "page",
            total: "total",
            records: "records",
            repeatitems: false,
            Id: "0"
        },
        multiselect: false,
        subGridRowExpanded: function (subgrid_id, row_id) {
            // we pass two parameters
            // subgrid_id is a id of the div tag created within a table
            // the row_id is the id of the row
            // If we want to pass additional parameters to the url we can use
            // the method getRowData(row_id) - which returns associative array in type name-value
            // here we can easy construct the following
            var subgrid_table_id;
            subgrid_table_id = subgrid_id + "_t";
            jQuery("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'></table>");
            jQuery("#" + subgrid_table_id).jqGrid({
                url: "/Student/GetStudentsMarks/" + row_id,
                datatype: "json",
                colNames: ['SubjectId', 'Name', 'Marks'],
                colModel: [
                    { key: true, hidden: true, align: "right", name: 'SubjectId', index: 'SubjectId', editable: true },
                    { key: false, name: 'Name', align: "right", index: 'Name', editable: true },
                    { key: false, name: 'Marks', align: "right", index: 'Marks', editable: true }
                ],
                height: '100%',
                rowNum: 20,
                sortname: 'StudentId',
                sortorder: 'asc',
                rowList: [10, 20, 30, 40, 50],
                viewrecords: true

            });
        }
        //subGridRowExpanded: function (subgridDivId, rowId) {
        //    var subgridTableId = subgridDivId + "_t";
        //    $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table>");
        //    $("#" + subgridTableId).jqGrid({
        //        datatype: 'local',
        //        data: mySubgrids[rowId],
        //        colNames: ['Col 1', 'Col 2', 'Col 3'],
        //        colModel: [
        //            { name: 'c1', width: 100 },
        //            { name: 'c2', width: 100 },
        //            { name: 'c3', width: 100 }
        //        ]
               
        //});
        //}
    }).navGrid('#jqControls', { edit: true, add: true, del: true, search: true, refresh: true },
        {
            zIndex: 100,
            url: '/Student/Edit',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                if (response.responseText) {
                    alert(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/Student/Create",
            closeOnEscape: true,
            closeAfterAdd: true,
            afterComplete: function (response) {
                if (response.responseText) {
                    alert(response.responseText);
                }
            }
        },
        {
            zIndex: 100,
            url: "/Student/Delete",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure you want to delete Student... ? ",
            afterComplete: function (response) {
                if (response.responseText) {
                    alert(response.responseText);
                }
            }
        });



});


