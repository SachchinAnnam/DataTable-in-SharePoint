$(document).ready(function() {
        loadListItems(); //to load list items
        getCount('Not-Started');
        getCount('In-Progress');
        getCount('On-Hold');
        getCount('Completed');
        getCount('Closed');

        $('.card-header').each(function() {
                $(this).prop('Counter', 0).animate({
                        Counter: $(this).text()
                }, {
                        duration: 1500,
                        easing: 'swing',
                        step: function(now) {
                                $(this).text(Math.ceil(now));
                        }
                });
        })


});




//click event for toggle
function addClickEvent() {



}


function loadListItems() {
        var oDataUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('ProjectDetails')/items?$select=ID,StartDate,EndDate,Title,Status,Description,Project_x0020_Summary,Project_x0020_Summary,EstimatedCost,StartDate,EndDate,ProjectManager/Title,Project_x0020_Sponsor/Title&$expand=ProjectManager,Project_x0020_Sponsor";
        console.log(_spPageContextInfo);
        $.ajax({
                url: oDataUrl,
                type: "GET",
                dataType: "json",
                headers: {
                        "accept": "application/json;odata=verbose"
                },
                success: successFunction,
                error: errorFunction
        });
}


function getCount(status) {
        //console.log(category);
        var listName = "ProjectDetails";
        var query = "$filter=(Status eq '" + status + "')";
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?" + query;

        getListItems(url, function(data) {
                var items = data.d.results;
                $('#' + status).text(items.length);
        });

}



function successFunction(data) {
        try {
                var dataTableExample = $('#pDashboard').DataTable();
                if (dataTableExample != 'undefined') {
                        dataTableExample.destroy();
                }

                dataTableExample = $('#pDashboard').DataTable({
                        //scrollY: "350px",
                        autoWidth: true,
                        dom: 'Blfrtip',
                        "pageLength": 5,
                        buttons: [
                                'copyHtml5',
                                'excelHtml5',
                                'csvHtml5',
                                'pdfHtml5'
                        ],
                        /* order: [
                      [0, 'desc'],
      
                     ],*/
                        columnDefs: [{
                                        "width": "3%",
                                        "targets": [0]
                                }, {
                                        "width": "3%",
                                        "targets": [1]
                                }, {
                                        "width": "20%",
                                        "targets": [2]
                                }, {
                                        "width": "6%",
                                        "targets": [3]
                                }, {
                                        "width": "10%",
                                        "targets": [4]
                                }, {
                                        "width": "10%",
                                        "targets": [5]
                                }

                        ],

                        "aaData": data.d.results,
                        "aoColumns": [{
                                "className": 'details-control',
                                "orderable": false,
                                "data": null,
                                "defaultContent": ''
                        }, {
                                "mData": "ID",
                                "render": function(mData, type, row, meta) {
                                        var returnText = "";
                                        var url = _spPageContextInfo.webAbsoluteUrl + "/Lists/ProjectDetails/DispForm.aspx?ID=" + mData;
                                        returnText = "<a target='_blank' href=" + url + ">" + mData + "</a>";
                                        return returnText;
                                }

                        }, {
                                "mData": "Title"

                        }, {
                                "mData": "Status",
                                "render": function(data) {

                                        if (data === null) return "";
                                        else
                                                return "<label class='badge1 badge-" + data + "'>" + data + "</label>"
                                }
                        }, {
                                "mData": "ProjectManager",
                                "render": function(mData, type, full, meta) {
                                        var returnText = "";
                                        if (mData.Title == undefined) return "";
                                        else return mData.Title;
                                        console.log(mData.Title);
                                }
                        }, {
                                "mData": "Project_x0020_Sponsor",
                                "render": function(mData, type, full, meta) {
                                        var returnText = "";
                                        if (mData.results == undefined) {
                                                returnText = "";
                                        } else {
                                                for (var i = 0; i <= mData.results.length - 1; i++) {
                                                        if (mData.results.length <= 1) {
                                                                returnText += mData.results[i].Title;
                                                        } else {
                                                                returnText += mData.results[i].Title + ";";
                                                        }
                                                }
                                        }

                                        return returnText;
                                }
                        }]

                });


                $('#pDashboard tbody').on('click', 'td.details-control', function() {
                        //alert('H');
                        var tr = $(this).closest('tr');
                        var row = dataTableExample.row(tr);

                        if (row.child.isShown()) {
                                // This row is already open - close it
                                row.child.hide();
                                tr.removeClass('shown');
                        } else {
                                // Open this row
                                row.child(format(row.data())).show();
                                tr.addClass('shown');
                        }
                });


                function format(d) {
                        // `d` is the original data object for the row
                        return '<table cellpadding="5" cellspacing="0" style="margin-left:-12px;width:100%;" border="0">' +
                                '<tr>' +
                                '<td><b>Description:</b></td>' +
                                '<td>' + d.Description + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td><b>Project Summary:</b></td>' +
                                '<td>' + d.Project_x0020_Summary + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td colspan="2"><table style="width: 101%;">' +
                                '<td><b>Start Date:</b></td>' +
                                '<td>' + getDates(d.StartDate) + '</td>' +
                                '<td><b>End Date:</b></td>' +
                                '<td>' + getDates(d.EndDate) + '</td>' +
                                '</td></table>'
                        '</tr>' +

                        '</table>';
                }



                //


        } catch (e) {
                //alert(e.message);  
        }
}




function errorFunction(data, errCode, errMessage) {
        Console.log("Error: " + errMessage);
}



function numberFormat(data) {
        var s = (data + ""),
                a = s.split(""),
                out = "",
                iLen = s.length;

        for (var i = 0; i < iLen; i++) {
                if (i % 3 === 0 && i !== 0) {
                        out = ',' + out;
                }
                out = a[iLen - i - 1] + out;
        }
        return out;
}


function getListItems(siteurl, success, failure) {
        $.ajax({
                url: siteurl,
                method: "GET",
                async: false,
                headers: {
                        "Accept": "application/json; odata=verbose"
                },
                success: function(data) {
                        success(data);
                },
                error: function(data) {
                        failure(data);
                }
        });
}

function getDates(data) {
        var retDate = "";
        if (data != null) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                //return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
                retDate = formatDate(date);
        }
        return retDate;

}

function formatDate(date) {
        //var today = new Date();
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!

        var yyyy = date.getFullYear();
        if (dd < 10) {
                dd = '0' + dd;
        }
        if (mm < 10) {
                mm = '0' + mm;
        }
        var formatedDate = mm + '/' + dd + '/' + yyyy;

        return formatedDate;
}