class MenuEvents {
    constructor() {
    }

    setupMenuEvents() {
        document.querySelectorAll(`.navbar > a`).forEach(function (link) {
            CustomEvents.onClick(link, this.loadPage.bind(this), link);

            CustomEvents.onMouseOver(link, function () {
                link.style.backgroundColor = "black";
            });
            CustomEvents.onMouseOut(link, function () {
                if (DataStore.getJson().currentPage === link.id)
                    link.style.backgroundColor = "darkred";
                if (DataStore.getJson().currentPage !== link.id)
                    link.style.backgroundColor = "#333";
            });
        }.bind(this));
        this.onSubMenuLinkHover();
        this.clickCalendarMainMenu();
    }

    clickCalendarMainMenu() {
        $('#calendar').change(function (link) {
            link.target.style.backgroundColor = "darkred";
            document.getElementsByClassName(`main ${link.target.id}`)[0].style.display = 'block'; 
        });
        $('#calendar').trigger('change');
        $('#calendar').off("change");
    }

    getCurrentTab() {//move to static helper
        return document.querySelectorAll(`.navbar #${DataStore.getJson('currentPage').currentPage}`)[0];
    }

    onSubMenuLinkHover() {
        document.querySelectorAll(`.subMenu > a`).forEach(function (link) {
            CustomEvents.onMouseOver(link, function () { link.style.backgroundColor = "blue"; });
            CustomEvents.onMouseOut(link, function () { link.style.backgroundColor = "#333"; });
        });
    }

    loadPage(link) {//not called on intial page load, only on subsequent page loads.
        this.updateCurrentPage(link.id);
        this.updateCurrentMainMenu(link);
        this.updateCurrentSubMenu(link.id);
        DataStore.addJson({ currentPage: link.id });
    }

    updateCurrentMainMenu(mainMenuLink) {
        document.querySelectorAll(`.navbar > a`).forEach(function (link) { link.style.backgroundColor = '#333'; });
        mainMenuLink.style.backgroundColor = 'darkred';
    }

    updateCurrentPage(pageId) {
        document.querySelectorAll('.main').forEach((main) => { main.style.display = 'none'; });
        document.querySelectorAll(`.main.${pageId}`)[0].style.display = 'block';
    }

    updateCurrentSubMenu(pageId) {
        document.querySelectorAll('.subMenu > a').forEach((subMenuElement) => { subMenuElement.style.display = 'none'; });
        document.querySelectorAll(`.subMenu > .${pageId}`).forEach((subMenuElement) => { subMenuElement.style.display = 'block'; });
    }
}