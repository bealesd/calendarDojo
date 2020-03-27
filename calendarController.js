import { CalendarEvents } from './calendarEvents.js';
import { CalendarRepo } from './calendarRepo.js'
import { DateHelper } from './dateHelper.js';
import { DataStore } from './dataStore.js';
import { DrawCalendar } from './drawCalendar.js';
import { CalendarMenu } from './calendarMenu.js';
import { CalendarHelper } from './calendarHelper.js';

export class CalendarController {
    static async main() {
        this.setCurrentYearAndMonth();
        await this.loadCalendarPage();
        CalendarMenu.setCalendarMenu(this.updateMonth);
        DrawCalendar.setupCalendarFormTimePicker();
    }

    static setCurrentYearAndMonth() {
        const year = DateHelper.getTodaysDate().year;
        const month = DateHelper.getTodaysDate().month;
        DataStore.setValue('year', year);
        DataStore.setValue('month', month);
    }

    static async loadCalendarPage() {
        let recordsArray = await CalendarRepo.getRecords(DateHelper.getYear(), DateHelper.getMonth());

        DataStore.storeRecords(recordsArray);

        CalendarController.refreshCalendarPage();
    }

    static async refreshCalendarPage() {
        DrawCalendar.drawCalendar();
        CalendarController.registerCalendarPageEventListeners();
    }

    static registerCalendarPageEventListeners() {
        CalendarEvents.onAddCalendarRecordClick();
        CalendarEvents.onUpdateCalendarRecordClick();
        CalendarEvents.onDeleteCalendarRecordClick(this.refreshCalendarPage);
        CalendarEvents.onCancelCalendarRecordClick();
        CalendarEvents.onCreateOrUpdateCalendarRecordClick(this.refreshCalendarPage);
        CalendarEvents.onMultipleCalendarDaysRecordClick(this.refreshCalendarPage);
    }

    static async updateMonth(isNextMonth) {
        DateHelper.changeMonth(isNextMonth);
        await CalendarController.loadCalendarPage();
    }
}