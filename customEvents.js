class CustomEvents {
    static onClick(element, callback, callbackArgs) {
        var clickEvents = ["mousedown"/*, "touchstart", "pointer.down"*/];
        clickEvents.forEach(function (event) {
            $(element).on(event, function () {
                callback(callbackArgs);
            }.bind(this));
        });
    }

    static unregisterJqueryEvents(element) {
        $(element).off();
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
}