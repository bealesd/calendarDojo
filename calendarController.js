import { CalendarEvents } from './calendarEvents.js';
import { CalendarRepo } from './calendarRepo.js'
import { DateHelper } from './dateHelper.js';
import { DataStore } from './dataStore.js';
import { DrawCalendar } from './DrawCalendar.js';
import { MenuEvents } from './menuEvents.js';
import { CalendarSubMenu } from './calendarSubMenu.js';

export class CalendarController {
    static loadPage() {
        const year = DateHelper.getTodaysDate().year;
        const month = DateHelper.getTodaysDate().month;

        DataStore.setValue('year', year);
        DataStore.setValue('month', month);

        CalendarRepo.getData(year, month).then(() => {
            this.loadCalendarPage();
            MenuEvents.setupMenuEvents();
            CalendarSubMenu.calendarSubMenuCallback();
        })
    }

    static loadCalendarPage() {
        DrawCalendar.drawCalendar();
        this.registerCalendarPageEventListeners();
    }

    static registerCalendarPageEventListeners() {
        CalendarEvents.onAddCalendarClick();
        CalendarEvents.onUpdateCalendarEventClick();
        CalendarEvents.onDeleteCalendarEventClick(this);
        CalendarEvents.onCancelCalendarEventClick();
        CalendarEvents.onCreateOrUpdateCalendarEventClick(this);
        CalendarEvents.onMultipleCalendarDaysEventClick();
    }
}