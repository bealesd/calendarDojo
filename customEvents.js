export class CustomEvents {
    constructor() {
        window.events = window.events || {};
    }

    overwriteEvents(eventType, element, callback, callbackArgs) {
        this.removeEvents(eventType, element);
        this.addEvent(eventType, element, callback, callbackArgs);
    }

    addEvent(eventType, element, callback, callbackArgs) {
        const id = element.id;
        window.events[id] = window.events[id] === undefined || window.events[id][eventType] === undefined ?
            { [eventType]: [callback] } :
            { [eventType]: [...window.events[id][eventType], callback] }

        element.addEventListener(eventType, callback, callbackArgs);
    }

    removeEvents(eventType, element) {
        const id = element.id;
        if (window.events[id] !== undefined && window.events[id][eventType] !== undefined) {
            for (let i = 0; i < window.events[id][eventType].length; i++) {
                element.removeEventListener(eventType, window.events[id][eventType][i]);
                window.events[id][eventType].pop(window.events[id][eventType][i]);
            }
        }
    }

    onClickOnce(element, callback, callbackArgs) {
        const once = {
            once: true
        };
        element.addEventListener("mouseup", function () {
            callback(callbackArgs);
        }.bind(this), once);
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