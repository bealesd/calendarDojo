class CustomEvents {
    static onClick(element, callback, callbackArgs) {
        var clickEvents = ["mousedown", "touchstart", "pointer.down"];
        clickEvents.forEach(function (event) {
            element.addEventListener(event, function () {
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