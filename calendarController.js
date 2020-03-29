import { CalendarEvents } from './calendarEvents.js';
import { CalendarRepo } from './calendarRepo.js'
import { DateHelper } from './dateHelper.js';
import { DataStore } from './dataStore.js';
import { DrawCalendar } from './drawCalendar.js';
import { CalendarMenu } from './calendarMenu.js';

export class CalendarController {
    constructor() {
        this.calendarEvents = new CalendarEvents();
        this.calendarMenu = new CalendarMenu();
        this.drawCalendar = new DrawCalendar();
    }

    async main() {
        this.setCurrentYearAndMonth();
        await this.loadCalendarPage();
        this.calendarMenu.setCalendarMenu((isNextMonth) => {this.updateMonth(isNextMonth)});
        this.drawCalendar.setupCalendarFormTimePicker();
    }

    setCurrentYearAndMonth() {
        const year = DateHelper.getTodaysDate().year;
        const month = DateHelper.getTodaysDate().month;
        DataStore.setValue('year', year);
        DataStore.setValue('month', month);
    }

    async loadCalendarPage() {
        let recordsArray = await CalendarRepo.getRecords(DateHelper.getYear(), DateHelper.getMonth());
        DataStore.storeRecords(recordsArray);

        this.refreshCalendarPage();
    }

    refreshCalendarPage() {
        this.drawCalendar.drawCalendar();
        this.registerCalendarPageEventListeners();
    }

    registerCalendarPageEventListeners() {
        this.calendarEvents.onAddCalendarRecordClick();
        this.calendarEvents.onUpdateCalendarRecordClick();
        this.calendarEvents.onDeleteCalendarRecordClick(() => { this.refreshCalendarPage(); });
        this.calendarEvents.onCancelCalendarRecordClick();
        this.calendarEvents.onCreateOrUpdateCalendarRecordClick(() => { this.refreshCalendarPage(); });
        this.calendarEvents.onMultipleCalendarDaysRecordClick(() => { this.refreshCalendarPage(); });
    }

    async updateMonth(isNextMonth) {
        DateHelper.changeMonth(isNextMonth);
        await this.loadCalendarPage();
    }
}