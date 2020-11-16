$.extend(
    $.jgrid.search,
    {
        closeOnEscape: true,
        closeAfterSearch: true,
        //closeAfterReset:true,
        overlay: 0,
        Reset: "Reset",
        Find: "Find"
    }
);

var recordids = new Array();

jQuery(function ($) {
    var grid_selector = "#grid-table";
    var pager_selector = "#grid-pager";

    //resize to fit page size
    $(window).on('resize.jqGrid', function () {
        $(grid_selector).jqGrid('setGridWidth', $(".page-content").width());
    })
    //resize on sidebar collapse/expand
    var parent_column = $(grid_selector).closest('[class*="col-"]');
    $(document).on('settings.ace.jqGrid', function (ev, event_name, collapsed) {
        if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
            //setTimeout is for webkit only to give time for DOM changes and then redraw!!!
            setTimeout(function () {
                $(grid_selector).jqGrid('setGridWidth', parent_column.width());
            }, 0);
        }
    })


    var selaArrr = [];

    jQuery(grid_selector).jqGrid({
        //direction: "rtl",

        //subgrid options
        subGrid: false,
        //subGridModel: [{ name : ['No','Item Name','Qty'], width : [55,200,80] }],
        //datatype: "xml",
        subGridOptions: {
            plusicon: "ace-icon fa fa-plus center bigger-110 blue",
            minusicon: "ace-icon fa fa-minus center bigger-110 blue",
            openicon: "ace-icon fa fa-chevron-right center orange"
        },
        ///veera

        multiselect: true,
        onSelectRow: function (id, status, e) {

        },
        onSelectAll: function (aRowids, status, id, e) {
            recordids = [];

            if (status) {
                //$('#add_grid-table').hide();
                //$('#edit_grid-table').hide();
            }
            else {
                //$('#add_grid-table').show();
                //$('#edit_grid-table').show();
            }
            for (var i = 0; i < aRowids.length; i++) {
                var myGrid = $('#grid-table'),
                    // selectedRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                    cellValue = myGrid.jqGrid('getCell', aRowids[i], 'institutionid');
                recordids.push(cellValue);
            }


        },
        ondblClickRow: function (rowid, iRow, iCol, e) {
            var myGrid = $('#grid-table'),
                selectedRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                cellValue = myGrid.jqGrid('getCell', rowid, 'institutionid');
            window.location = "../Ace/EditRecord?rowid=" + cellValue + "&operation=ViewRecord";
        },

        //for this example we are using local data
        subGridRowExpanded: function (subgridDivId, rowId) {
            var subgridTableId = subgridDivId + "_t";
            $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table>");
            $("#" + subgridTableId).jqGrid({
                datatype: 'json',
                data: subgrid_data,
                colNames: ['ID', 'Institution Name', 'Short Name', 'Board of Education', 'Website Address'],
                colModel: [
                    { name: 'id', width: 50 },
                    { name: 'name', width: 150 },
                    { name: 'qty', width: 50 }
                ]
            });
        },



        url: "../Student/GridRecords1",
        datatype: "json",
        height: 250,

        //Here i need to bind the Controller Data,Column model,Column names dynamically But now i have to give
        colNames: ['ID', 'Institution Name', 'Display Name', 'Short Name', 'Board of Education', 'Scheme Name', 'Subscription Date'],
        colModel: [
            { name: 'institutionid', hidden: true, sortable: true, sorttype: "int" },
            { name: 'institutionname', sortable: true },
            { name: 'displayname', sortable: true },
            { name: 'shortname', sortable: true },
            { name: 'supportedfield', sortable: true },
            { name: 'schemename', sortable: true },
            { name: 'subscriptionto', hidden: true, sortable: true, formatter: "date", formatoptions: { newformat: "d/m/Y" } }

        ],


        viewrecords: true,
        rowNum: 10,
        height: '350px',
        loadtext: "Processing pending request data please wait...",
        rowList: [10, 20, 30],
        idsOfSelectedRows: [],
        pager: pager_selector,
        reloadAfterSubmit: true,
        altRows: true,
        sortorder: "ASC",
        loadonce: true,
        //toppager: true,
        multiselect: true,
        scrollerbar: true,
        //multikey: "ctrlKey",
        multiboxonly: true,
        afterSubmit: function () {
            $(grid_selector).jqGrid().setGridParam(
                {
                    datatype: "json",
                    page: 1,
                    url: "GridRecords",
                }
            ).trigger("reloadGrid");
        },
        onSelectRow: function (id, isSelected, status) {
            var p = this.p, idsOfSelectedRows = p.idsOfSelectedRows, item = p.data[p._index[id]], i = $.inArray(id, idsOfSelectedRows);
            item.cb = isSelected;
            if (!isSelected && i >= 0) {
                idsOfSelectedRows.splice(i, 1); // remove id from the list
                recordids.splice(i, 1); // remove id from the list
                if (recordids.length == 1 || recordids.length == 0) {
                    //$('#edit_grid-table').show();
                }
                else {
                    //$('#edit_grid-table').hide();
                }

                if (recordids.length == 0) {
                    //$('#add_grid-table').show();
                }
                else {
                    //$('#add_grid-table').hide();
                }

            }
            else if (i < 0) {
                idsOfSelectedRows.push(id);
                var myGrid = $('#grid-table'),
                    selectedRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                    cellValue = myGrid.jqGrid('getCell', id, 'institutionid');
                recordids.push(cellValue);

                if (recordids.length == 1 || recordids.length == 0) {
                    //$('#edit_grid-table').show();
                }
                else {
                    //$('#edit_grid-table').hide();
                }

                if (recordids.length == 0) {
                    //$('#add_grid-table').show();
                }
                else {
                    //$('#add_grid-table').hide();
                }
            }


        },
        loadComplete: function () {
            var table = this;
            setTimeout(function () {
                //styleCheckbox(table);

                //updateActionIcons(table);
                //updatePagerIcons(table);
                //enableTooltips(table);
            }, 0);
        },


        //editurl: "DeleteRecord",//nothing is saved
        caption: "Registered Institutes"



    });

    $(window).triggerHandler('resize.jqGrid');//trigger window resize to make the grid get the correct size


    function aceSwitch(cellvalue, options, cell) {
        setTimeout(function () {
            $(cell).find('input[type=checkbox]')
                .addClass('ace ace-switch ace-switch-5')
                .after('<span class="lbl"></span>');

        }, 0);
    }
    //enable datepicker
    function pickDate(cellvalue, options, cell) {
        setTimeout(function () {
            $(cell).find('input[type=text]')
                .datepicker({ format: 'dd/MM/yyyy', autoclose: true });
        }, 0);
    }


    //navButtons
    jQuery(grid_selector).jqGrid('navGrid', pager_selector,
        { //navbar options
            edit: true,
            editicon: 'ace-icon fa fa-pencil blue',
            add: true,
            addicon: 'ace-icon fa fa-plus-circle purple',
            del: true,
            delicon: 'ace-icon fa fa-trash-o red',
            search: true,
            searchicon: 'ace-icon fa fa-search orange',
            refresh: true,
            refreshicon: 'ace-icon fa fa-refresh green',
            view: true,
            viewicon: 'ace-icon fa fa-search-plus grey',
            view: true,
            edit: true, add: true, del: true, view: true,
            editfunc: function () {
                var myGrid = $('#grid-table'),
                    selectedRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                    cellValue = myGrid.jqGrid('getCell', selectedRowId, 'institutionid');
                window.location = "../Ace/EditRecord?rowid=" + cellValue + "&operation=EditRecord";
            },
            addfunc: function () {
                var myGrid = $('#grid-table'),
                    selectedRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                    cellValue = myGrid.jqGrid('getCell', selectedRowId, 'institutionid');
                // Add();
                window.location = "../Ace/Aceadmin?operation=Addrecord";

            },
            delfunc: function (id, status, e) {

                $.alert.open({
                    type: 'confirm',
                    content: 'Do you want to delete the selected Institute?',
                    callback: function (button) {
                        if (button == 'yes') {
                            $.ajax({
                                type: "POST",
                                contentType: "application/json; charset=utf-8",
                                data: "{'recordid':'" + recordids + "'}",
                                url: "../Ace/DeleteRecord",
                                dataType: "html",
                                success: function (data) {
                                    var msg = jQuery.parseJSON(data);
                                    $('.deletealert').html('<button type="button" class="close" data-dismiss="alert">' + '<i class="ace-icon fa fa-times"></i>' +

                                        '</button>' + '<b>Success!</b>' + " " + msg.Message);
                                    $('.deletealert').css("display", "block"); window.setTimeout(function () { $('.deletealert').css("display", "none"); }, 5000);
                                    $('#edit_grid-table').show();
                                    $('#add_grid-table').show();
                                    $(grid_selector).jqGrid().setGridParam(
                                        {
                                            datatype: "json",
                                            page: 1,
                                            url: "GridRecords",
                                        }
                                    ).trigger("reloadGrid");
                                    recordids.splice(0, recordids.length);

                                },
                                error: function (xhr, ajaxOptions, thrownError) {
                                    //alert(thrownError);
                                    $.alert.open({
                                        title: 'Warning',
                                        type: 'warning',
                                        content: thrownError
                                    });
                                }
                            });
                        }

                    }
                });


            },

            viewfunc: function () {
                var myGrid = $('#grid-table'),
                    selectedRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                    cellValue = myGrid.jqGrid('getCell', selectedRowId, 'institutionid');
                window.location = "../Ace/EditRecord?rowid=" + cellValue + "&operation=ViewRecord";
            }

        },
        {

            recreateForm: false,

        },
        {

            closeAfterAdd: true,
            recreateForm: true,
            viewPagerButtons: false,
            beforeShowForm: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar')
                    .wrapInner('<div class="widget-header" />')
                style_edit_form(form);
            }
        },
        {
            //delete record form
            recreateForm: true,
            beforeShowForm: function (e) {
                var form = $(e[0]);
                if (form.data('styled')) return false;

                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_delete_form(form);

                form.data('styled', true);
            },
            onClick: function (e) {
                alert(1);
            }
        },
        {
            //search form
            recreateForm: true,
            afterShowSearch: function (e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
                style_search_form(form);

            }
        }
    );
});