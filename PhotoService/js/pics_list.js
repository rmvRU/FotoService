(function () {
    window.pics_list = {

        show: function () {
            var location = window.location.toString();
            var template = kendo.template(app.applet.template_card);
            var dataItem = app.applet.currrentDataItem;

            var cardHTML = template(dataItem);
            $("#pics_list-card-container").html(cardHTML);
            $("#pics_list-view-data").kendoMobileListView({
                dataSource: app.applet.pics_datasource,
                template: app.applet.pics_template

            });
            //alert(app.applet.pics_datasource.transport.options.read.url);
            app.applet.pics_datasource.read();
        },
        refresh: function () {
            app.applet.pics_datasource.read();
        },

        addImage: function () {
            var success = function (data) {
                if (!pics_list.getComment()) return;
                var no = app.applet.currrentDataItem[app.applet.bound.from_column];
                var type = app.applet.type;
                var url = app.service_url + "/get_image.asp?action=upload&type=" + type + "&item_no=" + no + "&database_id=" + app.database_id + "&comment=" + app.applet.comment;
                pics_list.uploadPhoto(data, url);
            };
            var error = function () {
                navigator.notification.alert("Невозможно добавить изображение");
            };
            var config = {
                destinationType: Camera.DestinationType.FILE_URI
            };
            navigator.camera.getPicture(success, error, config);
        },
        addImage2: function () {
            //alert("zuzu");
            //alert(objToString(imagePicker);
            var success = function (data) {
                if (!pics_list.getComment()) return;
                var no = app.applet.currrentDataItem[app.applet.bound.from_column];
                var type = app.applet.type;
                var url = app.service_url + "/get_image.asp?action=upload&type=" + type + "&item_no=" + no + "&database_id=" + app.database_id + "&comment=" + app.applet.comment;
                //pics_list.uploadPhoto(data, url);
                //app.mobileApp.view.reload();
                for (var i = 0; i < data.length; i++) {
                    pics_list.uploadPhoto(data[i], url);
                }

            };
            var error = function () {
                navigator.notification.alert("Невозможно добавить изображение");
            };

            //alert(imagePicker);
            imagePicker.getPictures(
                success,
                error, {}
            );
        },

        getComment: function () {
            if (app.applet.need_comment) {
                if (typeof (app.applet.comment) == 'undefined')
                    app.applet.comment = '';
                var comment = prompt('Введите комментарий', app.applet.comment);
                if (comment == null) {
                    return false
                };
                app.applet.comment = comment;
                return true;
            };
            return true;
        },



        uploadPhoto: function (fileURI, url) {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);

            if (cordova.platformId == "android") {
                options.fileName += ".jpg"
            }

            options.mimeType = "image/jpeg";
            options.params = {}; // if we need to send parameters to the server request 
            options.headers = {
                Connection: "Close"
            };
            options.chunkedMode = false;
            url = encodeURI(url);
            var ft = new FileTransfer();
            ft.upload(
                fileURI,
                url,
                onFileUploadSuccess,
                onFileTransferFail,
                options);

            function onFileUploadSuccess(result) {
                console.log("FileTransfer.upload");
                console.log("Code = " + result.responseCode);
                console.log("Response = " + result.response);
                console.log("Sent = " + result.bytesSent);
                console.log("Link to uploaded file: http://www.filedropper.com" + result.response);
                navigator.camera.cleanup()
                app.mobileApp.view.reload();
            }

            function onFileTransferFail(error) {
                alert("Ошибка " + objToString(error));
                console.log("FileTransfer Error:");
                console.log("Code: " + error.code);
                console.log("Source: " + error.source);
                console.log("Target: " + error.target);
            }
        }


    };
}());