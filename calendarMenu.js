import { CustomEvents } from './customEvents.js';

export class CalendarMenu {

    static setCalendarMenu(changeMonthCallabck) {
        this.onMainMenuLinkHover('calendar');
        this.placeSubMenu(this.calendarSubMenuHtml());
        this.onSubMenuLinkHover();
        document.getElementById('nextMonth').addEventListener('click', () => {
            changeMonthCallabck(true);
        });
        document.getElementById('previousMonth').addEventListener('click', () => {
            changeMonthCallabck(false);
        });
    }

    static calendarSubMenuHtml() {
        const height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
        const previousMonthHtml = `<a style='height:${height}' class="calendar" id="previousMonth"><span class="glyphicon glyphicon-menu-left"></span></a>`;
        const nextMonthHtml = `<a style='height:${height}' class="calendar" id="nextMonth"><span class="glyphicon glyphicon-menu-right"></span></a>`;
        return previousMonthHtml + nextMonthHtml;
    }

    static placeSubMenu(subMenuHtml) {
        document.getElementsByClassName('subMenu')[0].innerHTML = subMenuHtml;
    }

    static onSubMenuLinkHover() {
        document.querySelectorAll(`.subMenu > a`).forEach(function (link) {
            CustomEvents.onMouseOver(link, function () { link.style.backgroundColor = "blue"; });
            CustomEvents.onMouseOut(link, function () { link.style.backgroundColor = "#333"; });
        });
    }

    static onMainMenuLinkHover(id) {
        document.querySelectorAll(`#${id}`).forEach(function (link) {
            CustomEvents.onMouseOver(link, function () { link.style.backgroundColor = "darkred"; });
            CustomEvents.onMouseOut(link, function () { link.style.backgroundColor = "#333"; });
        });
    }
}