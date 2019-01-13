class CustomEvents {
    static onClick(element, callback, callbackArgs) {
        var clickEvents = ["mousedown", "touchstart", "pointer.down"];

        //$("body").on("click", element, function () {
        //    callback(callbackArgs);
        //});

        clickEvents.forEach(function (event) {
            $(element).on(event, function () {
                callback(callbackArgs);
            }.bind(this));
        });

        //$(element).on('click', function () {
        //    callback(callbackArgs);
        //}.bind(this));

        //clickEvents.forEach(function (event) {
        //    element.addEventListener(event, function () {
        //        callback(callbackArgs);
        //    }, {passive: true});
        //});
    }

    static unregisterOnClick(element, callback, callbackArgs) {
        var clickEvents = ["mousedown", "touchstart", "pointer.down"];
        //$("body").off();
        $("body").off("click", element, function () {
            callback(callbackArgs);
        });

        clickEvents.forEach(function (event) {
            element.removeEventListener(event, function () {
                callback(callbackArgs);
            });
        });
    }

    static onMouseOver(element, callback, callbackArgs) {
        var clickEvents = ["mouseover"];
        clickEvents.forEach(function (event) {
            element.addEventListener(event, function () {
                callback(callbackArgs);
            });
        });
    }

    static onMouseOut(element, callback, callbackArgs) {
        var clickEvents = ["mouseout"];
        clickEvents.forEach(function (event) {
            element.addEventListener(event, function () {
                callback(callbackArgs);
            });
        });
    }

    //static onResize() {
    //    window.addEventListener("resize", resizeThrottler, false);
    //}

    //resizeThrottler() {
    //    var resizeTimeout;
    //    if (!resizeTimeout) {
    //        resizeTimeout = setTimeout(function () {
    //            resizeTimeout = null;
    //            this.loadCalendarPage();
    //        }, 66);
    //    }
    //}
}