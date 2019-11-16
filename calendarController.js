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
                CalendarMenu.setCalendarMenu(this.updateMonth);
            })
    }

    static loadCalendarPage() {
        DrawCalendar.drawCalendar();
        CalendarController.registerCalendarPageEventListeners();
    }

    static registerCalendarPageEventListeners() {
        CalendarEvents.onAddCalendarClick();
        CalendarEvents.onUpdateCalendarEventClick();
        CalendarEvents.onDeleteCalendarEventClick(this.loadCalendarPage);
        CalendarEvents.onCancelCalendarEventClick();
        CalendarEvents.onCreateOrUpdateCalendarEventClick(this.loadCalendarPage);
        CalendarEvents.onMultipleCalendarDaysEventClick(this.loadCalendarPage);
    }

    static updateMonth(isNextMonth){
        DateHelper.updateDate(isNextMonth);
        const year = DateHelper.getYear();
        const month = DateHelper.getMonth();
        CalendarRepo.getData(year, month).then(() => {
            DrawCalendar.drawCalendar();
            CalendarController.registerCalendarPageEventListeners();
        })
    }
}