import { DataStore } from './dataStore.js';
import { DateHelper } from './dateHelper.js';
import { CalendarHelper } from './calendarHelper.js';
import { CalendarRepo } from './calendarRepo.js';
import { DrawCalendar } from './drawCalendar.js';
import { WebTimeHelper } from './webTimeHelper.js';

export class CalendarService {
    constructor() {
        this.drawCalendarService = new DrawCalendar;
        this.calendarRepo = new CalendarRepo();
    }

    post(title, ticks, id) {
        return this.calendarRepo.postData(title, id, ticks);
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

    parseDateFromString(ticks) {
        return new Date(Number.parseInt(ticks));
    }

    getCurrentMonthRecords(allCalendarRecords) {
        let currentMonthCalendarEvents = {};
        let eventsPerDay = {};
        for (let i = 0; i < allCalendarRecords.length; i++) {
            const calendarEventDate = this.parseDateFromString(allCalendarRecords[i].date);
            const eventIsCurrentMonth = calendarEventDate.getFullYear() === DateHelper.getYear() && calendarEventDate.getMonth() === DateHelper.getMonthNumber();
            if (eventIsCurrentMonth) {
                if (eventsPerDay[calendarEventDate.getDate()] === undefined)
                    eventsPerDay[calendarEventDate.getDate()] = 1;
                else
                    eventsPerDay[calendarEventDate.getDate()] += 1;

                const calendarEvent = {
                    'id': allCalendarRecords[i].id,
                    'title': allCalendarRecords[i].title,
                    'time': WebTimeHelper.webTimeToString(calendarEventDate),
                    'day': calendarEventDate.getDate(),
                    'slot': eventsPerDay[calendarEventDate.getDate()]
                };
                currentMonthCalendarEvents[allCalendarRecords[i].id] = calendarEvent;
            }
        }
        return currentMonthCalendarEvents;
    }

    setCalendarEventsForCurrentMonth() {
        let currentMonthCalendarRecords = this.getCurrentMonthRecords(DataStore.getValue('allCalendarRecords'));
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
        this.drawCalendarService.daysInMonth = DateHelper.getDaysInMonth();
        this.drawCalendarService.drawCalendarEvents(DateHelper.getDaysNames());

        if (DateHelper.getTodaysDate().month === DateHelper.getMonthNumber())
            this.drawCalendarService.highlightCurrentDay(DateHelper.getTodaysDate().day);

        this.drawCalendarService.updateCalendarColors();
        this.drawCalendarService.setMonthAndYearText(DateHelper.getMonthNumber(), DateHelper.getMonthName(), DateHelper.getYear());
        this.drawCalendarService.setCalendarBorder();
    }
}