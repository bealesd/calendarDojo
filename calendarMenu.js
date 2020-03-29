import { CustomEvents } from './customEvents.js';

export class CalendarMenu {
    constructor() {
        this.customEvents = new CustomEvents();
    }

    setCalendarMenu(changeMonthCallabck) {
        this.onMainMenuLinkHover('calendar');
        this.placeSubMenu(this.calendarSubMenuHtml());
        this.onSubMenuLinkHover();

        this.customEvents.overwriteEvents('click', document.querySelector('#nextMonth'), () => {
            changeMonthCallabck(true);
        });
        this.customEvents.overwriteEvents('click', document.querySelector('#previousMonth'), () => {
            changeMonthCallabck(false);
        });
    }

    calendarSubMenuHtml() {
        const height = window.getComputedStyle(document.querySelector('.navbar > a')).height;
        // const previousMonthHtml = `<img style='height:${height}' class="calendar" id="previousMonth" src="./fonts/back.svg" alt="previous month">`;

        const previousMonthHtml = `<a style='height:${height}; background: url(./fonts/back.svg) no-repeat center;' class="calendar" id="previousMonth"></a>`;
        const nextMonthHtml = `<a style='height:${height}; background: url(./fonts/next.svg) no-repeat center;' class="calendar" id="nextMonth"></a>`;

        // read in svg
        // <svg style="width: 20px;" viewBox="0 0 20 20">
        //     <use href="./fonts/back.svg#one"></use>
        // </svg>

        return previousMonthHtml + nextMonthHtml;
    }

    placeSubMenu(subMenuHtml) {
        document.querySelector('.subMenu').innerHTML = subMenuHtml;
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