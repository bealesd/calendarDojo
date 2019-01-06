class CalendarService {
    constructor() {
        //classes
        this.drawCalendarService = null;
        this.dateHelper = null;
        this.calendarRepo = null;
        this.calendarTimer = null;
    }

    post(title, time, who, where, id) {
        console.log(`post for '${title}' with id: '${id}'`);
        return this.calendarRepo.postData(title, time, who, where, id, this.dateHelper.date, DataStore.getJson().day);
        //    .then(() => {
        //    console.log(`Inserted or updated calendar event: ${title}, id: ${id}`);
        //}
    }

    delete(id) {
        return this.calendarRepo.deleteData(id);
    }

    get() {//TODO: rename to start calendar, it gets and controls timer
        this.calendarTimer.startGetCalendarTimer();
        return new Promise(function (res, rej) {
            this.calendarRepo.getData().then(function (results) {
                DataStore.addJson({ allCalendarRecords: results });
                this.setCalendarEventsForCurrentMonth(results);
                this.calendarTimer.stopGetCalendarTimer();
                res(`'getData' retrieved: ${results.length} calendar events.`);
            }.bind(this), function (err) {
                this.calendarTimer.stopGetCalendarTimer();
                this.calendarTimer.setCalendarStatusText('Could not get calendar data.');
                rej(err);
            });

        }.bind(this));
    }

    parseDateFromString(dateString) {
        var date = new Date();
        var year = dateString.split('/')[0];
        var month = dateString.split('/')[1] - 1;
        var day = dateString.split('/')[2];
        date.setFullYear(year, month, day);
        return date;
    }

    getCurrentMonthRecords(allCalendarRecords) {
        var currentMonthCalendarEvents = {};
        var eventsPerDay = {};
        for (var i = 0; i < allCalendarRecords.length; i++) {
            var calendarEventDate = this.parseDateFromString(allCalendarRecords[i].date);
            var eventIsCurrentMonth = calendarEventDate.getFullYear() === this.dateHelper.getYear() && calendarEventDate.getMonth() === this.dateHelper.getMonthNumber();
            if (eventIsCurrentMonth) {
                if (eventsPerDay[calendarEventDate.getDate()] === undefined)
                    eventsPerDay[calendarEventDate.getDate()] = 1;
                else
                    eventsPerDay[calendarEventDate.getDate()] += 1;

                var calendarEvent = {
                    'id': allCalendarRecords[i].id,
                    'title': allCalendarRecords[i].title,
                    'time': allCalendarRecords[i].time,
                    'who': allCalendarRecords[i].who,
                    'where': allCalendarRecords[i].where,
                    'day': calendarEventDate.getDate(),
                    'slot': eventsPerDay[calendarEventDate.getDate()]
                };
                currentMonthCalendarEvents[allCalendarRecords[i].id] = calendarEvent;
            }
        }
        return currentMonthCalendarEvents;
    }

    setCalendarEventsForCurrentMonth() {
        var currentMonthCalendarRecords = this.getCurrentMonthRecords(DataStore.getJson()['allCalendarRecords']);
        DataStore.addCurrentMonthCalendarRecords(this.sortCalendarEvents(currentMonthCalendarRecords));
    }

    sortCalendarEvents(calendarEventJson) {
        var calendarEventsArray = [];
        Object.keys(calendarEventJson).forEach(function (id) { calendarEventsArray.push(calendarEventJson[id]); });
        calendarEventsArray.sort(CalendarHelper.compareByTime);
        var soughtedCalendarEventJson = {};
        calendarEventsArray.forEach(function (event) { soughtedCalendarEventJson[event.id] = event; });
        return soughtedCalendarEventJson;
    }

    drawCalendar() {
        this.drawCalendarService.clearCalendar();
        this.drawCalendarService.daysInMonth = this.dateHelper.getDaysInMonth();
        this.drawCalendarService.drawCalendarEvents(this.dateHelper.getDaysNames());

        if (this.dateHelper.getTodaysDate().day === this.dateHelper.getDay() &&
            this.dateHelper.getTodaysDate().month === this.dateHelper.getMonthNumber() &&
            this.dateHelper.getTodaysDate().year === this.dateHelper.getYear()) {
            this.drawCalendarService.highlightCurrentDay(this.dateHelper.getTodaysDate().day);
        }

        this.drawCalendarService.updateCalendarColors();
        this.drawCalendarService.setMonthAndYearText(this.dateHelper.getMonthNumber(), this.dateHelper.getMonthName(), this.dateHelper.getYear());
        this.drawCalendarService.setCalendarBorder();
        //this.drawCalendarService.createCalendarSubMenu();
    }

}