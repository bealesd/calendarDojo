import { CalendarService } from './calendarService.js';
import { CalendarController } from './calendarController.js';
import { DateHelper } from './dateHelper.js';

export class CalendarSubMenu {
    constructor() {
        this.calendarService = new CalendarService();
        this.calendarController = new CalendarController();
    }

    calendarSubMenuHtml() {
        const height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
        const previousMonthHtml = `<a style='height:${height}' class="calendar" id="previousMonth"><span class="glyphicon glyphicon-menu-left"></span></a>`;
        const nextMonthHtml = `<a style='height:${height}' class="calendar" id="nextMonth"><span class="glyphicon glyphicon-menu-right"></span></a>`;
        return previousMonthHtml + nextMonthHtml;
    }

    placeSubMenu(subMenuHtml) {
        document.getElementsByClassName('subMenu')[0].innerHTML = subMenuHtml;
    }

    calendarSubMenuCallback() {
        this.placeSubMenu(this.calendarSubMenuHtml());
        document.getElementById('nextMonth').addEventListener('click', this.calendarForwards.bind(this));
        document.getElementById('previousMonth').addEventListener('click', this.calendarBackwards.bind(this));
    }

    calendarBackwards() {
        DateHelper.updateDate(false);
        const year = DateHelper.getYear();
        const month = DateHelper.getMonthNumber();
        new CalendarService().get(year, month);
        // this.calendarService.setCalendarEventsForCurrentMonth();
    }

    calendarForwards() {
        DateHelper.updateDate(true);
        const year = DateHelper.getYear();
        const month = DateHelper.getMonthNumber();
        new CalendarService().get(year, month);
        // this.calendarService.setCalendarEventsForCurrentMonth();
    }
}