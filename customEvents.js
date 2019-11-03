export class CustomEvents {
    static onClick(element, callback, callbackArgs) {
        const clickEvents = ["mousedown"];
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
        const clickEvents = ["mouseover"];
        clickEvents.forEach(function (event) {
            element.addEventListener(event, function () {
                callback(callbackArgs);
            });
        });
    }

    static onMouseOut(element, callback, callbackArgs) {
        const clickEvents = ["mouseout"];
        clickEvents.forEach(function (event) {
            element.addEventListener(event, function () {
                callback(callbackArgs);
            });
        });
    }
}