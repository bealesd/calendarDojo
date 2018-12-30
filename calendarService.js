class CalendarService {
    constructor() {
        //classes
        this.drawCalendarService = null;
        this.dateHelper = null;
        this.calendarRepo = null;
        this.calendarTimer = null;
        //properties
        this.currentMonthCalendarArray = null;
        this.calendarJson = null;
    }

    post(title, time, who, where, id) {
        console.log(`post for '${title}' with id: '${id}'`);
        return this.calendarRepo.postData(title, time, who, where, id, this.dateHelper.date, getJson().day);
        //    .then(() => {
        //    console.log(`Inserted or updated calendar event: ${title}, id: ${id}`);
        //}
    }

    delete(id) {
        return this.calendarRepo.deleteData(id);
    }

    get() {
        this.calendarTimer.startGetCalendarTimer();
        return new Promise(function (res, rej) {
            this.calendarRepo.getData().then(function(result) {
                console.log(result);
                this.calendarJson = result;
                this.setCalendarEventsForCurrentMonth();
                this.calendarTimer.stopGetCalendarTimer();
                res(`'getData' retrieved: ${result.length} calendar events.`);
            }.bind(this), function(err) {
                this.calendarTimer.stopGetCalendarTimer();
                this.calendarTimer.setCalendarStatusText('Could not get calendar data.');
                rej(err);
                });

        }.bind(this));
    }

    setCalendarEventsForCurrentMonth() {
        this.currentMonthCalendarArray = new Array();
        for (var i = 0; i < this.calendarJson.length; i++) {
            var date = new Date();
            date.setFullYear(this.calendarJson[i].date.split('/')[0], this.calendarJson[i].date.split('/')[1] - 1, this.calendarJson[i].date.split('/')[2]);
            if (date.getFullYear() === this.dateHelper.getYear() && date.getMonth() === this.dateHelper.getMonthNumber()) {
                var calendarEvent = {
                    "id": this.calendarJson[i].id,
                    "title": this.calendarJson[i].title,
                    "time": this.calendarJson[i].time,
                    "who": this.calendarJson[i].who,
                    "where": this.calendarJson[i].where,
                };
                if (!this.currentMonthCalendarArray[`${date.getDate()}`]) this.currentMonthCalendarArray[`${date.getDate()}`] = [calendarEvent];
                else this.currentMonthCalendarArray[`${date.getDate()}`].push(calendarEvent);
            }
        }
        this.drawCalendarService.calendarArray = this.currentMonthCalendarArray;
        this.sortCalendarEvents();
    }

    sortCalendarEvents() {
        for (var i = 0; i < this.currentMonthCalendarArray.length; i++) {
            if (this.currentMonthCalendarArray[i]) this.currentMonthCalendarArray[i].sort(CalendarHelper.compareCalendarEvents);
        }
    }

    drawCalendar() {
        this.drawCalendarService.clearCalendar();
        this.drawCalendarService.daysInMonth = this.dateHelper.getDaysInMonth();
        this.drawCalendarService.drawCalendarEvents(this.dateHelper.getDaysNames());

        if (this.dateHelper.getTodaysDate().day === this.dateHelper.getDay() &&
            this.dateHelper.getTodaysDate().month === this.dateHelper.getMonthNumber() &&
            this.dateHelper.getTodaysDate().year === this.dateHelper.getYear()) {
            this.drawCalendarService.highlightCurrentDay(this.dateHelper.getTodaysDate().day);
        };

        this.drawCalendarService.updateCalendarColors();
        this.drawCalendarService.setMonthAndYearText(this.dateHelper.getMonthNumber(), this.dateHelper.getMonthName(), this.dateHelper.getYear());
        this.drawCalendarService.setCalendarBorder();
        //this.drawCalendarService.createCalendarSubMenu();
    }

}