import { DataStore } from './dataStore.js';
import { CustomEvents } from './customEvents.js';

export class MenuEvents {
    static setupMenuEvents() {
        document.querySelectorAll(`.navbar > a`).forEach(function (link) {
            CustomEvents.onClick(link, this.loadPage.bind(this), link);

            CustomEvents.onMouseOver(link, function () {
                link.style.backgroundColor = "black";
            });
            CustomEvents.onMouseOut(link, function () {
                if (DataStore.getValue('currentPage') === link.id)
                    link.style.backgroundColor = "darkred";
                if (DataStore.getValue('currentPage') !== link.id)
                    link.style.backgroundColor = "#333";
            });
        }.bind(this));
        this.onSubMenuLinkHover();
        this.clickCalendarMainMenu();
    }

    static clickCalendarMainMenu() {
        $('#calendar').change(function (link) {
            link.target.style.backgroundColor = "darkred";
            document.getElementsByClassName(`main ${link.target.id}`)[0].style.display = 'block'; 
        });
        $('#calendar').trigger('change');
        $('#calendar').off("change");
    }

    static getCurrentTab() {
        return document.querySelectorAll(`.navbar #${DataStore.getValue('currentPage')}`)[0];
    }

    static onSubMenuLinkHover() {
        document.querySelectorAll(`.subMenu > a`).forEach(function (link) {
            CustomEvents.onMouseOver(link, function () { link.style.backgroundColor = "blue"; });
            CustomEvents.onMouseOut(link, function () { link.style.backgroundColor = "#333"; });
        });
    }

    static loadPage(link) {
        this.updateCurrentPage(link.id);
        this.updateCurrentMainMenu(link);
        this.updateCurrentSubMenu(link.id);
        DataStore.addJson({ currentPage: link.id });
    }

    static updateCurrentMainMenu(mainMenuLink) {
        document.querySelectorAll(`.navbar > a`).forEach(function (link) { link.style.backgroundColor = '#333'; });
        mainMenuLink.style.backgroundColor = 'darkred';
    }

    static pdateCurrentPage(pageId) {
        document.querySelectorAll('.main').forEach((main) => { main.style.display = 'none'; });
        document.querySelectorAll(`.main.${pageId}`)[0].style.display = 'block';
    }

    static updateCurrentSubMenu(pageId) {
        document.querySelectorAll('.subMenu > a').forEach((subMenuElement) => { subMenuElement.style.display = 'none'; });
        document.querySelectorAll(`.subMenu > .${pageId}`).forEach((subMenuElement) => { subMenuElement.style.display = 'block'; });
    }
}