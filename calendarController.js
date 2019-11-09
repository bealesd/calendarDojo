import { CalendarEvents } from './calendarEvents.js';
import { CalendarService } from './calendarService.js'
import { MenuEvents } from './menuEvents.js';
import { CalendarSubMenu } from './calendarSubMenu.js';
import { DateHelper } from './dateHelper.js';

export class CalendarController {
    constructor() {
        if (!CalendarController.instance) {
            CalendarController.instance = this;

            this.calendarService = new CalendarService();
            this.calendarEventsRegistered = false;
            this.calendarFormId = 'addOrEditCalendarEvents';
            this.calendarEvents = new CalendarEvents();
        }
        return CalendarController.instance;
    }

    loadPage() {
        const year = DateHelper.getTodaysDate().year;
        const month = DateHelper.getTodaysDate().month;
        this.calendarService.get(year, month)
            .then(() => {
                this.loadCalendarPage();
                new MenuEvents().setupMenuEvents();
                new CalendarSubMenu().calendarSubMenuCallback();
            })
    }

    loadCalendarPage(){
        this.calendarService.drawCalendar();
        this.registerCalendarPageEventListeners();
    }

    registerCalendarPageEventListeners() {
        this.calendarEvents.onAddCalendarClick();
        this.calendarEvents.onUpdateCalendarEventClick();
        this.calendarEvents.onDeleteCalendarEventClick(this);
        this.calendarEvents.onCancelCalendarEventClick();
        this.calendarEvents.onCreateOrUpdateCalendarEventClick(this);
        this.calendarEvents.onMultipleCalendarDaysEventClick();
    }
}