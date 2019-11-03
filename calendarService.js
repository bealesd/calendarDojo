import { DataStore } from './dataStore.js';
import { DateHelper } from './dateHelper.js';
import { CalendarHelper } from './calendarHelper.js';
import { CalendarRepo } from './calendarRepo.js';
import { DrawCalendar } from './drawCalendar.js';

export class CalendarService {
    constructor() {
        this.drawCalendarService = new DrawCalendar;
        this.dateHelper = new DateHelper();
        this.calendarRepo = new CalendarRepo();
    }

    post(title, time, id) {
        return this.calendarRepo.postData(title, time, id, this.dateHelper.date, DataStore.getValue('day'));
    }

    postWithDate(title, time, id, day, month, year) {
        return this.calendarRepo.postDataWithDate(title, time, id, day, month, year);
    }

    delete(id) {
        return this.calendarRepo.deleteData(id);
    }

    get() {
        return new Promise(function (res, rej) {
            this.calendarRepo.getData().then(function (results) {
                DataStore.setValue('allCalendarRecords', results);
                this.setCalendarEventsForCurrentMonth(results);
                res(`'getData' retrieved: ${results.length} calendar events.`);
            }.bind(this));
        }.bind(this));
    }

    parseDateFromString(dateString) {
        let date = new Date();
        const year = dateString.split('/')[0];
        const month = dateString.split('/')[1] - 1;
        const day = dateString.split('/')[2];
        date.setFullYear(year, month, day);
        return date;
    }

    getCurrentMonthRecords(allCalendarRecords) {
        let currentMonthCalendarEvents = {};
        let eventsPerDay = {};
        for (let i = 0; i < allCalendarRecords.length; i++) {
            const calendarEventDate = this.parseDateFromString(allCalendarRecords[i].date);
            const eventIsCurrentMonth = calendarEventDate.getFullYear() === this.dateHelper.getYear() && calendarEventDate.getMonth() === this.dateHelper.getMonthNumber();
            if (eventIsCurrentMonth) {
                if (eventsPerDay[calendarEventDate.getDate()] === undefined)
                    eventsPerDay[calendarEventDate.getDate()] = 1;
                else
                    eventsPerDay[calendarEventDate.getDate()] += 1;

                const calendarEvent = {
                    'id': allCalendarRecords[i].id,
                    'title': allCalendarRecords[i].title,
                    'time': allCalendarRecords[i].time,
                    'day': calendarEventDate.getDate(),
                    'slot': eventsPerDay[calendarEventDate.getDate()]
                };
                currentMonthCalendarEvents[allCalendarRecords[i].id] = calendarEvent;
            }
        }
        return currentMonthCalendarEvents;
    }

    setCalendarEventsForCurrentMonth() {
        var currentMonthCalendarRecords = this.getCurrentMonthRecords(DataStore.getValue('allCalendarRecords'));
        DataStore.setValue('currentMonthCalendarRecords', this.sortCalendarEvents(currentMonthCalendarRecords));
    }

    sortCalendarEvents(calendarEventJson) {
        let calendarEventsArray = [];
        Object.keys(calendarEventJson).forEach(function (id) { calendarEventsArray.push(calendarEventJson[id]); });
        calendarEventsArray.sort(CalendarHelper.compareByTime);
        let soughtedCalendarEventJson = {};
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
    }

}