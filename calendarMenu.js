import { CustomEvents } from './customEvents.js';

export class CalendarMenu {

    static setCalendarMenu(changeMonthCallabck) {
        this.onMainMenuLinkHover('calendar');
        this.placeSubMenu(this.calendarSubMenuHtml());
        this.onSubMenuLinkHover();

        new CustomEvents().overwriteEvents('click', document.querySelector('#nextMonth'), () => {
            changeMonthCallabck(true);
        });

        new CustomEvents().overwriteEvents('click', document.querySelector('#previousMonth'), () => {
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
        document.querySelector('.subMenu').innerHTML = subMenuHtml;
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