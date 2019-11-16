import { CalendarRepo } from './calendarRepo.js';
import { DateHelper } from './dateHelper.js';
import { CalendarController} from './calendarController.js';
import { DrawCalendar} from './drawCalendar.js';
import { MenuEvents} from './menuEvents.js'; 

export class CalendarSubMenu {
    static calendarSubMenuHtml() {
        const height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
        const previousMonthHtml = `<a style='height:${height}' class="calendar" id="previousMonth"><span class="glyphicon glyphicon-menu-left"></span></a>`;
        const nextMonthHtml = `<a style='height:${height}' class="calendar" id="nextMonth"><span class="glyphicon glyphicon-menu-right"></span></a>`;
        return previousMonthHtml + nextMonthHtml;
    }

    static placeSubMenu(subMenuHtml) {
        document.getElementsByClassName('subMenu')[0].innerHTML = subMenuHtml;
    }

    static calendarSubMenuCallback() {
        this.placeSubMenu(this.calendarSubMenuHtml());
        document.getElementById('nextMonth').addEventListener('click', this.calendarForwards.bind(this));
        document.getElementById('previousMonth').addEventListener('click', this.calendarBackwards.bind(this));
    }

    static calendarBackwards() {
        DateHelper.updateDate(false);
        const year = DateHelper.getYear();
        const month = DateHelper.getMonthNumber();
        CalendarRepo.getData(year, month).then(() => {
            DrawCalendar.drawCalendar();
            CalendarController.registerCalendarPageEventListeners();
            MenuEvents.setupMenuEvents();
            CalendarSubMenu.calendarSubMenuCallback();
        })
    }

    static calendarForwards() {
        DateHelper.updateDate(true);
        const year = DateHelper.getYear();
        const month = DateHelper.getMonthNumber();
        CalendarRepo.getData(year, month).then(() => {
            DrawCalendar.drawCalendar();
            CalendarController.registerCalendarPageEventListeners();
            MenuEvents.setupMenuEvents();
            CalendarSubMenu.calendarSubMenuCallback();
        })
    }
}