function CallbackController() {
    function main() {
        return {
            intialize: function (callbackService) {
                this.callbackService = callbackService;
                this.menuEvents = new MenuEvents();
                this.onLoad();
                this.onResize();
            },

            resizeThrottler: function () {
                var resizeTimeout;
                if (!resizeTimeout) {
                    resizeTimeout = setTimeout(function () {
                        resizeTimeout = null;
                        this.loadTab();
                    }.bind(this), 66);
                }
            },

            loadTab: function () {
                var currentTab = this.getCurrentTab();
                var tabKeys = Object.keys(this.callbackService.getTabCallbacks());
                for (var i = 0; i < tabKeys.length; i++) {
                    if (tabKeys[i] === currentTab.id) {
                        CalendarHelper.removeSubMenu();
                        this.callbackService.triggerTabCallback(tabKeys[i]);
                        this.callbackService.triggerSubMenuCallback(tabKeys[i]);
                    }
                }
                this.menuEvents.setupMenuEvents();
            },

            getCurrentTab: function () {
                return document.querySelectorAll(`.navbar #${DataStore.getJson('currentPage').currentPage}`)[0];
            },

            onLoad: function () {
                window.addEventListener("load", this.loadTab.bind(this), false);
            },

            onResize: function () {
                window.addEventListener("resize", this.resizeThrottler.bind(this), false);
            }
        };
    }
    return main();
}