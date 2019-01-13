class MenuEvents {
    constructor() {
    }

    setupMenuEvents() {
        document.querySelectorAll(`.navbar > a`).forEach(function (link) {
            if (!link.classList.contains('subMenu')) {
                CustomEvents.onClick(link, this.pageLoader.bind(this), link.id);
            }
            CustomEvents.onMouseOver(link, function () { link.style.backgroundColor = "black"; });
            CustomEvents.onMouseOut(link, function () { link.style.backgroundColor = "#333"; });
        }.bind(this));
    }

    //onSubMenuLinkHover() {
    //    document.querySelectorAll(`.subMenu > a`).forEach(function (link) {
    //        CustomEvents.onMouseOver(link, function () { link.style.backgroundColor = "black"; });
    //        CustomEvents.onMouseOut(link, function () { link.style.backgroundColor = "#333"; });
    //    });
    //}

    pageLoader(id) {
        document.querySelectorAll('.main').forEach((main) => { main.style.display = 'none'; });
        document.querySelectorAll(`.main.${id}`)[0].style.display = 'block';
        document.querySelectorAll('.subMenuElement').forEach((subMenu) => { subMenu.style.display = 'none'; });
        //TODO ensure submenu added again
        //subMenuElement
        DataStore.addJson({ currentPage: id });
    }
}