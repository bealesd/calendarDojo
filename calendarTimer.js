class CalendarTimer {
    constructor() {
        this.calendarTimerId = null;
        this.seconds = 0;
    }

    startGetCalendarTimer() {
        if (this.calendarTimerId === null) {
            this.calendarTimerId = setInterval(() => {
                this.setCalendarStatusText(`Loading Calendar...${this.seconds++} seconds`);
            }, 1000);
        }
    }

    stopGetCalendarTimer() {
        clearTimeout(this.calendarTimerId);
        this.calendarTimerId = null;
        this.setCalendarStatusText();
    }

    setCalendarStatusText(calendarStatusText = '') {
        document.getElementById('calendarStatus').innerHTML = calendarStatusText;
    }
}