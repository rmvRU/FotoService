'use strict';

(function () {
    var app = {
        data: {}
    };

    var bootstrap = function () {
        $(function () {
            var s = window.localStorage;
            app.service_url = (s.getItem("service-url") != null) ? s.getItem("service-url") : "http://10.8.1.53:8003";

            app.database_id = (s.getItem("database-id") != null) ? s.getItem("database-id") : 0;
            var type = (s.getItem("applet-type") != null) ? s.getItem("applet-type") : 0;
            if (type == 0) {
                app.applet_def = image_applets[0];
            } else {
                app.applet_def = get_image_applet_by_type(type);
            };
            var config
            $.ajax({
                    url: app.service_url + '/config.json',
                    dataType: "json",
                    async: false
                })
                .done(function (data) {
                    config = data;
                })
                .fail(function (data, status, error) {
                    alert("Ошибка " + error + " при чтении конфигурации сервиса " + app.service_url + '/config.json. Проверьте настройки сервиса');
                    app.invalid_service_url = true;
                });

            app.config = config;
            app.database_id = (s.getItem("database-id") != null) ? s.getItem("database-id") : 0;
            app.image_applets = image_applets;
            if (!app.invalid_service_url) {

                app.image_Applet = new Image_applet(app.applet_def);

            }


            //alert(image_applets);
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'none',
                skin: 'nova',
                init: function () {
                    if (app.invalid_service_url) {
                        app.mobileApp.navigate("Views/settings.html");
                    } else {
                        app.mobileApp.navigate('Views/list.html?type=' + app.image_Applet.type);
                    }
                }
            });

        });
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function (url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };




    // start kendo binders
    // end kendo binders
    app.showFileUploadName = function (itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function (event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function (formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function (key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };

    app.quit = function () {
        var s = window.localStorage;
        app.saveSettings();
        navigator.app.exitApp();
    };

    app.saveSettings = function () {
        var s = window.localStorage;
        s.setItem("service-url", app.service_url);
        if (typeof (app.database_id != 'undefined')) {
            s.setItem("database-id", app.database_id);
        }
        if (typeof (app.applet.type != 'undefined')) {
            s.setItem("applet-type", app.applet.type);
        }
        //alert("settings are saved");
    };




}());

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes




//шаблоны для показа и обработки изображений
var image_applets = [
    {
        name: "МЗК",
        type: "request",
        datasource_url: "/Datasources/picture.request.list.json",
        template_url: "/Templates/picture.request.list-mobile.htm",
        template_card_url: "/Templates/picture.request.list-mobile.htm",
        caption: "Список МЗК",
        hint: "Введите первые несколько цифр номера МЗК",
        pics_datasource_url: "/Datasources/picture.request.picture.list.json",
        pics_template_url: "/Templates/picture.request.picture.list-mobile.htm",
        bound: {
            from_column: "id",
            to_column: "request_id"

        },
        need_comment: true

		},

    {
        name: "СЗ",
        type: "wo",
        datasource_url: "/Datasources/picture.wo.list.json",
        template_url: "/Templates/picture.wo.list-mobile.htm",
        template_card_url: "/Templates/picture.wo.card-mobile.htm",

        caption: "Список СЗ",
        hint: "Введите первые несколько цифр номера СЗ или КЛД",
        pics_datasource_url: "/Datasources/picture.wo.picture.list.json",
        pics_template_url: "/Templates/picture.wo.picture.list-mobile.htm",
        bound: {
            from_column: "no",
            to_column: "wo_no"
        },
        need_comment: true

		},

    {
        name: "Товары",
        type: "item",
        datasource_url: "/Datasources/picture.item.list.json",
        template_url: "/Templates/picture.item.list-mobile.htm",
        template_card_url: "/Templates/picture.item.card-mobile.htm",
        pics_datasource_url: "/Datasources/picture.item.picture.list.json",
        pics_template_url: "/Templates/picture.item.picture.list-mobile.htm",

        bound: {
            from_column: "item_no",
            to_column: "item_no"

        },
        caption: "Список Товаров",
        hint: "Введите артикул ШК или описание",
        need_comment: false

		},

    {
        name: "Серийные номера",
        type: "sn",
        datasource_url: "/Datasources/picture.sn.list.json",
        template_url: "/Templates/picture.sn.list-mobile.htm",
        template_card_url: "/Templates/picture.sn.card-mobile.htm",
        pics_datasource_url: "/Datasources/picture.sn.picture.list.json",
        pics_template_url: "/Templates/picture.sn.picture.list-mobile.htm",
        bound: {
            from_column: "sn",
            to_column: "sn"

        },
        caption: "Серийные номера",
        hint: "Введите первые несколько символов СН",
        need_comment: true

		}

		];

function get_image_applet_by_type(type) {
    for (var i = 0; i < image_applets.length; i++) {
        if (image_applets[i].type == type)
            return image_applets[i];
    }
    return undefined

}

function Image_applet(data) {
    this.getJSON = function (url) {
        $.ajaxSetup({
            "async": false
        });
        var result;
        $.ajax({
                url: app.service_url + url,
                dataType: "json"
            })
            .done(function (data) {
                result = data;
            })
            .fail(function () {
                console.log("error on loading resource " + url);
            });
        $.ajaxSetup({
            "async": true
        });
        return (result);
    };
    this.get = function (url) {
        $.ajaxSetup({
            "async": false
        });
        var result;
        $.get(app.service_url + url, function () {})
            .done(function (data) {
                result = data;
            })
            .fail(function () {
                console.log("error on loading resource " + url);
            });
        $.ajaxSetup({
            "async": true
        });
        return (result);
    };

    this.name = data.name;
    this.type = data.type;
    this.template = this.get(data.template_url);
    this.template_card = this.get(data.template_card_url);

    this.datasource = new kendo.data.DataSource(this.getJSON(data.datasource_url));
    this.datasource.transport.options.read.url = app.service_url + '/' + this.datasource.transport.options.read.url
    this.datasource.transport.options.read.base_url = this.datasource.transport.options.read.url;
    this.pics_datasource = new kendo.data.DataSource(this.getJSON(data.pics_datasource_url));
    this.pics_datasource.transport.options.read.url = app.service_url + '/' + this.pics_datasource.transport.options.read.url;
    this.pics_datasource.transport.options.read.base_url = this.pics_datasource.transport.options.read.url;
    this.pics_template = this.get(data.pics_template_url);

    this.bound = data.bound;
    this.need_comment = data.need_comment;

    //alert(this.datasource.transport.options.read.url);		

};




function objToString(obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}

// END_CUSTOM_CODE_kendoUiMobileApp