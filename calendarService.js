import { DataStore } from './dataStore.js';
import { DateHelper } from './dateHelper.js';
import { CalendarRepo } from './calendarRepo.js';
import { DrawCalendar } from './drawCalendar.js';
import { CalendarController } from './calendarController.js';
import { MenuEvents } from './menuEvents.js';
import { CalendarSubMenu } from './calendarSubMenu.js';

export class CalendarService {
    constructor() {
        this.calendarRepo = new CalendarRepo();
    }

    get(year, month) {
        return new Promise(function (res, rej) {
            this.calendarRepo.getData(year, month).then(function (results) {
                results.forEach(element => {
                    element.day = new Date(element.date).getDate();
                });               
                this.setCalendarEventsForCurrentMonth(results);
                res();
            }.bind(this));
        }.bind(this));
    }

    parseDateFromString(ticks) {
        return new Date(Number.parseInt(ticks));
    }

    setCalendarEventsForCurrentMonth(results) {
        DataStore.setValue('currentMonthCalendarRecords', results);
        new CalendarController().loadCalendarPage();
        // new MenuEvents().setupMenuEvents();
        // new CalendarSubMenu().calendarSubMenuCallback();
    }

    drawCalendar() {
        DrawCalendar.clearCalendar();
        DrawCalendar.daysInMonth = DateHelper.getDaysInMonth();
        DrawCalendar.drawCalendarEvents(DateHelper.getDaysNames());

        if (DateHelper.getTodaysDate().month === DateHelper.getMonthNumber())
            DrawCalendar.highlightCurrentDay(DateHelper.getTodaysDate().day);

        DrawCalendar.updateCalendarColors();
        DrawCalendar.setMonthAndYearText(DateHelper.getMonthNumber(), DateHelper.getMonthName(), DateHelper.getYear());
        DrawCalendar.setCalendarBorder();
    }
}