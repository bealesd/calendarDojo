function CallbackService() {
    var tabCallbacks = {};
    var subMenuCallbacks = {};
    function inner() {
        return {
            getSubMenuCallbacks: function () {
                return subMenuCallbacks;
            },
            getTabCallbacks: function () {
                return tabCallbacks;
            },
            registerSubMenuCallbacks: function (callbackFunction, name) {
                subMenuCallbacks[name] = callbackFunction;
            },
            triggerSubMenuCallback: function (callbackFunction) {
                subMenuCallbacks[callbackFunction]();
            },
            registerTabCallbacks: function (callbackFunction, name) {
                tabCallbacks[name] = callbackFunction;
            },
            triggerTabCallback: function (callbackFunction) {
                console.log('triggerTabCallback');
                tabCallbacks[callbackFunction]();
            }
        };
    }
    return inner();
}