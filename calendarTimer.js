class CalendarTimer {
    constructor() {
        this.calendarTimerId = null;
        this.seconds = 0;
    }

    startGetCalendarTimer() {
        this.calendarTimerId = setInterval(() => { this.setCalendarStatusText(`Loading Calendar...${this.seconds++} seconds`); }, 1000);
    }

    stopGetCalendarTimer() {
        clearTimeout(this.calendarTimerId);
        this.setCalendarStatusText();
    }

    setCalendarStatusText(calendarStatusText = '') {
        document.getElementById('calendarStatus').innerHTML = calendarStatusText;
    }

}