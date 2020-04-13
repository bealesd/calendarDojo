import { CustomEvents } from './customEvents.js';

export class CalendarMenu {
    constructor() {
        this.customEvents = new CustomEvents();
    }

    setCalendarMenu(changeMonthCallabck) {
        this.onMainMenuLinkHover('calendar');

        this.calendarSubMenuHtml();

        this.onSubMenuLinkHover();

        this.customEvents.overwriteEvents('click', document.querySelector('#nextMonth'), () => {
            changeMonthCallabck(true);
        });
        this.customEvents.overwriteEvents('click', document.querySelector('#previousMonth'), () => {
            changeMonthCallabck(false);
        });
    }

    calendarSubMenuHtml() {
        const height = window.getComputedStyle(document.querySelector('.navbar')).height;

        const previousMonthHtml = `<a style='height:${height};' id="previousMonth">backwards</a>`;
        const nextMonthHtml = `<a style='height:${height};' id="nextMonth"> forwards</a>`;
        document.querySelector('#subMenuLeft').innerHTML = previousMonthHtml;
        document.querySelector('#subMenuRight').innerHTML = nextMonthHtml;
    }


    onSubMenuLinkHover() {
        document.querySelectorAll(`.subMenu > a`).forEach((link) => {
            this.customEvents.overwriteEvents('mouseover', link, () => { link.style.backgroundColor = "blue"; });
            this.customEvents.overwriteEvents('mouseout', link, () => { link.style.backgroundColor = "#333"; });
        });
    }

    onMainMenuLinkHover(id) {
        document.querySelectorAll(`#${id}`).forEach((link) => {
            this.customEvents.overwriteEvents('mouseover', link, () => { link.style.backgroundColor = "darkred"; });
            this.customEvents.overwriteEvents('mouseout', link, () => { link.style.backgroundColor = "#333"; });
        });
    }
}