class EventListener {
    constructor() {
        this.resizeCallbacks = [];
    }

    //add resize callback
    add(cb) {
        this.resizeCallbacks.push(cb);
        console.log(this.resizeCallbacks[0]);
    }
    //remove resize callback

    registerResizeCallbacks() {
        window.addEventListener("resize", resizeThrottler, false);
        var resizeTimeout;
        function resizeThrottler() {
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(function () {
                    resizeTimeout = null;
                    console.log(this.resizeCallbacks);
                    if (this.resizeCallbacks !== undefined) {
                        this.resizeCallbacks.forEach(function (callback) {
                            callback();
                        });
                    }
                }, 66);
            }
        }
    }

}