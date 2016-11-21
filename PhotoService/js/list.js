(function () {
    var currentList;
    window.list = {

        search: function (e) {
            app.applet.searchString = document.getElementById("list-search").value;
            window.list.reload();
        },

        reload: function () {
            app.applet.datasource.transport.options.read.url = app.applet.datasource.transport.options.read.base_url + "&search=" + app.applet.searchString + "&database_id=" + app.database_id
            //alert(app.applet.datasource.transport.options.read.url);
            app.applet.datasource.read();
        },

        show: function () {
            var location = window.location.toString();
            var type = location.substring(location.lastIndexOf('?') + 6);
            //alert(location);
            if (typeof(app.requested_type)!='undefined'){
                type=app.requested_type;                
            }
            var needLoadApplet = typeof (app.applet) == 'undefined';
            if (!needLoadApplet) needLoadApplet = app.applet.type != type;
            if (!needLoadApplet) return;
            if (needLoadApplet) {
                app.applet_def = get_image_applet_by_type(type);
                app.applet = new Image_applet(app.applet_def);
                var view = $('#list-view').data("kendoMobileView");
            }
            if (typeof (app.applet.searchString) != 'undefined') {
                document.getElementById("list-search").value = app.applet.searchString;
            }
            kendo.bind($("#list-view"), app.applet_def);
            $("#list-search").attr("placeholder", app.applet_def.hint);
            //$('#list-view').data().title="zuzu";
            //alert(objToString(navbar));
            //alert(app.applet.datasource.transport.options.read.url);
            //kendo.bind($("list-tabstrip"), app.config.database);

            //$("#tabstrip").getKendoTabStrip().select(app.database_id);
            var template = kendo.template($("#database-template").html());
            var html = '';
            for (var i = 0; i < app.config.database.length; i++) {
                html += template(app.config.database[i]);
            };
            $("#list-tabstrip").append(html);
            var ts = $("#list-tabstrip").kendoMobileTabStrip({
                selectedIndex: app.database_id,
                select: function (e) {
                    var i = $(e.item).index();
                    app.database_id = i;
                    app.applet.searchString='';
                    document.getElementById("list-search").value='';
                    window.list.reload();
                }
            });
            app.applet.datasource.transport.options.read.url = app.applet.datasource.transport.options.read.base_url + "&search=" + app.applet.searchString + "&database_id=" + app.database_id
            //app.applet.datasource.transport.options.read.url = app.applet.datasource.transport.options.read.base_url + "&database_id=" + app.database_id
            $("#list-view-data").kendoMobileListView({
                dataSource: app.applet.datasource,
                template: app.applet.template,

            });
        },
        quit:function(){
          app.quit();
        },
        
        
        click: function (e) {
            e.preventDefault();
            var i = $(e.item).index();
            var d = app.applet.datasource;
            var di = d.at(i);
            var selected = di[app.applet.bound.from_column];
            app.applet.currrentDataItem = di;
            app.applet.pics_datasource.transport.options.read.url = app.applet.pics_datasource.transport.options.read.base_url + "&" + app.applet.bound.to_column + '=' + selected + "&database_id=" + app.database_id
            app.mobileApp.navigate("Views/pics_list.html");
        }
        



    };
}());