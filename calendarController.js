import { CalendarEvents } from './calendarEvents.js';
import { CalendarRepo } from './calendarRepo.js'
import { DateHelper } from './dateHelper.js';
import { DataStore } from './dataStore.js';
import { DrawCalendar } from './drawCalendar.js';
import { CalendarMenu } from './calendarMenu.js';

export class CalendarController {
    static async main() {
        this.setCurrentYearAndMonth();
        await this.loadCalendarPage();
        CalendarMenu.setCalendarMenu(this.updateMonth);
    }

    static setCurrentYearAndMonth() {
        const year = DateHelper.getTodaysDate().year;
        const month = DateHelper.getTodaysDate().month;
        DataStore.setValue('year', year);
        DataStore.setValue('month', month);
    }

    static async loadCalendarPage() {
        const recordsArray = await CalendarRepo.getRecords(DateHelper.getYear(), DateHelper.getMonth());
        DataStore.storeRecords(recordsArray);

        CalendarController.refreshCalendarPage();
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
        DateHelper.changeMonth(isNextMonth);
        await CalendarController.loadCalendarPage();
    }
}