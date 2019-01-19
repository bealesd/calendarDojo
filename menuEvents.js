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
        this.clickCalendarLink();
    }

    clickCalendarLink() {
        $('#calendar').change(function (link) {
            link.target.style.backgroundColor = "darkred";
            document.getElementsByClassName(`main ${link.target.id}`)[0].style.display = 'block'; 
        });
        $('#calendar').trigger('change');
        $('#calendar').off("change");
    }

    getCurrentTab() {
        return document.querySelectorAll(`.navbar #${DataStore.getJson('currentPage').currentPage}`)[0];
    }

    onSubMenuLinkHover() {
        document.querySelectorAll(`.subMenu > a`).forEach(function (link) {
            CustomEvents.onMouseOver(link, function () { link.style.backgroundColor = "blue"; });
            CustomEvents.onMouseOut(link, function () { link.style.backgroundColor = "#333"; });
        });
    }

    loadPage(link) {//not called on intial page load, only on subsequent page loads.
        document.querySelectorAll(`.navbar > a`).forEach(function (link) { link.style.backgroundColor = '#333'; });
        link.style.backgroundColor = 'darkred';
        var id = link.id;
        document.querySelectorAll('.main').forEach((main) => { main.style.display = 'none'; });//hide all pages
        document.querySelectorAll(`.main.${id}`)[0].style.display = 'block';//show current page
        document.querySelectorAll('.subMenuElement').forEach((subMenu) => { subMenu.style.display = 'none'; });//hide all sub menus
        document.querySelectorAll(`.subMenuElement.${id}`).forEach((subMenu) => { subMenu.style.display = 'block'; }); //show sub menu
        DataStore.addJson({ currentPage: id });
    }
}