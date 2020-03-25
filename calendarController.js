import { CalendarEvents } from './calendarEvents.js';
import { CalendarRepo } from './calendarRepo.js'
import { DateHelper } from './dateHelper.js';
import { DataStore } from './dataStore.js';
import { DrawCalendar } from './drawCalendar.js';
import { CalendarMenu } from './calendarMenu.js';

export class CalendarController {
    static async main() {
        this.setCurrentMonth();
        await this.loadCalendarPage();
        CalendarMenu.setCalendarMenu(this.updateMonth);
    }

    static setCurrentMonth() {
        const year = DateHelper.getTodaysDate().year;
        const month = DateHelper.getTodaysDate().month;
        DataStore.setValue('year', year);
        DataStore.setValue('month', month);
    }

    static async loadCalendarPage() {
        await CalendarRepo.getData(DateHelper.getYear(), DateHelper.getMonth());
        DrawCalendar.drawCalendar();
        CalendarController.registerCalendarPageEventListeners();
    }

    static async refreshCalendarPage() {
        DrawCalendar.drawCalendar();
        CalendarController.registerCalendarPageEventListeners();
    }

    static registerCalendarPageEventListeners() {
        CalendarEvents.onAddCalendarClick();
        CalendarEvents.onUpdateCalendarEventClick();
        CalendarEvents.onDeleteCalendarEventClick(this.refreshCalendarPage);
        CalendarEvents.onCancelCalendarEventClick();
        CalendarEvents.onCreateOrUpdateCalendarEventClick(this.refreshCalendarPage);
        CalendarEvents.onMultipleCalendarDaysEventClick(this.refreshCalendarPage);
    }

    static async updateMonth(isNextMonth) {
        DateHelper.updateDate(isNextMonth);
        await CalendarController.loadCalendarPage();
    }
}