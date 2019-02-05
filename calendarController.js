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
        this.registerTabCallbacks(this.calendarPageCallback.bind(this), 'calendar');
        this.registerSubMenuCallbacks(this.calendarSubMenuCallback.bind(this), 'calendar');
    }

    //#region calendar page
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
        this.registerCalendarEventListeners();
    }

    registerCalendarEventListeners() {
        this.calendarEvents.onAddCalendarClick();
        this.calendarEvents.onUpdateCalendarEventClick();
        this.calendarEvents.onDeleteCalendarEventClick(this);
        this.calendarEvents.onCancelCalendarEventClick();
        this.calendarEvents.onCreateOrUpdateCalendarEventClick(this);
        this.calendarEvents.onMultipleCalendarDaysEventClick();
    }
    //#endregion

    //#region submenu  
    calendarSubMenuHtml() {
        var height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
        var previousMonthHtml = `<a style='height:${height}'  class="calendar" id="nextMonth"><span class="glyphicon glyphicon-menu-left"></span></a>`;
        var nextMonthHtml = `<a style='height:${height}'  class="calendar" id="previousMonth"><span class="glyphicon glyphicon-menu-right"></span></a>`;
        return previousMonthHtml + nextMonthHtml;
    }

    placeSubMenu(subMenuHtml) {
        document.getElementsByClassName('subMenu')[0].innerHTML = subMenuHtml;
    }

    calendarSubMenuCallback() {
        var subMenuHtml = this.calendarSubMenuHtml();
        this.placeSubMenu(subMenuHtml);
        document.getElementById('nextMonth').addEventListener('click', this.calendarForwards.bind(this));
        document.getElementById('previousMonth').addEventListener('click', this.calendarBackwards.bind(this));
    }

    calendarBackwards() {
        this.calendarService.dateHelper.updateDate(true);
        this.calendarService.setCalendarEventsForCurrentMonth();
        this.loadCalendarPage();
    }

    calendarForwards() {
        this.calendarService.dateHelper.updateDate(false);
        this.calendarService.setCalendarEventsForCurrentMonth();
        this.loadCalendarPage();
    }
    //#endregion
}