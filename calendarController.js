class CalendarController {
    constructor(registerSubMenuCallbacks, registerTabCallbacks) {
        this.calendarService = new CalendarService();
        this.calendarService.calendarRepo = new CalendarRepo();
        this.calendarService.drawCalendarService = new DrawCalendar();
        this.calendarService.dateHelper = new DateHelper();
        this.calendarService.calendarTimer = new CalendarTimer();
        this.registerTabCallbacks = registerTabCallbacks;
        this.registerSubMenuCallbacks = registerSubMenuCallbacks;
        this.calendarEventsRegistered = false;
        this.calendarFormId = 'addOrEditCalendarEvents';
        this.calendarEvents = new CalendarEvents();
    }

    registerCalendarCallbacks() {
        this.calendarSubMenu = CalendarSubMenu();
        this.registerTabCallbacks(this.calendarPageCallback.bind(this), 'calendar');
        this.registerSubMenuCallbacks(function() {
            this.calendarSubMenu.calendarSubMenuCallback.call(this);
        }.bind(this), 'calendar');
    }

    //#region calendar page setup
    calendarPageCallback() {
        if (DataStore.getJson().allCalendarRecords === undefined) {
            this.calendarService.get().then(() => {
                this.loadCalendarPage();
            });
        }
        else {
            this.loadCalendarPage();
        }
    }

    loadCalendarPage() {
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
    //#endregion
}