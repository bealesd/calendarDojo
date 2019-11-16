import { CalendarRepo } from './calendarRepo.js';
import { DateHelper } from './dateHelper.js';
import { CalendarController} from './calendarController.js';
import { DrawCalendar} from './drawCalendar.js';
import { CustomEvents} from './customEvents.js'; 

export class CalendarMenu {

    static calendarMenuCallback() {
        this.onMainMenuLinkHover('calendar');
        this.placeSubMenu(this.calendarSubMenuHtml());

        document.getElementById('nextMonth').addEventListener('click', this.calendarForwards.bind(this));
        document.getElementById('previousMonth').addEventListener('click', this.calendarBackwards.bind(this));

        this.onSubMenuLinkHover();
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

    static calendarBackwards() {
        //TODO simplify this to call update date only in controller?
        DateHelper.updateDate(false);
        const year = DateHelper.getYear();
        const month = DateHelper.getMonth();
        CalendarRepo.getData(year, month).then(() => {
            DrawCalendar.drawCalendar();
            CalendarController.registerCalendarPageEventListeners();
        })
    }

    static calendarForwards() {
        //TODO simplify this to call update date only in controller?
        DateHelper.updateDate(true);
        const year = DateHelper.getYear();
        const month = DateHelper.getMonth();
        CalendarRepo.getData(year, month).then(() => {
            DrawCalendar.drawCalendar();
            CalendarController.registerCalendarPageEventListeners();
        })
    }

    static onMainMenuLinkHover(id) {
        document.querySelectorAll(`#${id}`).forEach(function (link) {
            CustomEvents.onMouseOver(link, function () { link.style.backgroundColor = "darkred"; });
            CustomEvents.onMouseOut(link, function () { link.style.backgroundColor = "#333"; });
        });
    }
}