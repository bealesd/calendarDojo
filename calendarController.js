import { CalendarEvents } from './calendarEvents.js';
import { CalendarRepo } from './calendarRepo.js'
import { DateHelper } from './dateHelper.js';
import { DataStore } from './dataStore.js';
import { DrawCalendar } from './drawCalendar.js';
import { CalendarMenu } from './calendarMenu.js';

export class CalendarController {
    static loadCalendar() {
        const year = DateHelper.getTodaysDate().year;
        const month = DateHelper.getTodaysDate().month;
        DataStore.setValue('year', year);
        DataStore.setValue('month', month);

        CalendarRepo.getData(year, month)
            .then(() => {
                DrawCalendar.drawCalendar();
                this.registerCalendarPageEventListeners()
                CalendarMenu.calendarMenuCallback();
            })
    }

    static loadCalendarPage() {
        DrawCalendar.drawCalendar();
        this.registerCalendarPageEventListeners();
    }

    static registerCalendarPageEventListeners() {
        CalendarEvents.onAddCalendarClick();
        CalendarEvents.onUpdateCalendarEventClick();
        CalendarEvents.onDeleteCalendarEventClick();
        CalendarEvents.onCancelCalendarEventClick();
        CalendarEvents.onCreateOrUpdateCalendarEventClick();
        CalendarEvents.onMultipleCalendarDaysEventClick();
    }
}