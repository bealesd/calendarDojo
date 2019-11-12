import { DataStore } from './dataStore.js';
import { DateHelper } from './dateHelper.js';
import { CalendarRepo } from './calendarRepo.js';
import { DrawCalendar } from './drawCalendar.js';

export class CalendarService {

    get(year, month) {
        return new Promise(function (res, rej) {
            CalendarRepo.getData(year, month).then(function (results) {
                results.forEach(element => {
                    element.day = new Date(element.date).getDate();
                });               
                DataStore.setValue('currentMonthCalendarRecords', results);
                res();
            }.bind(this));
        }.bind(this));
    }

    drawCalendar() {
        DrawCalendar.clearCalendar();
        DrawCalendar.daysInMonth = DateHelper.getDaysInMonth();
        DrawCalendar.drawCalendarEvents(DateHelper.getDaysNames());

        if (DateHelper.getTodaysDate().month === DateHelper.getMonthNumber())
            DrawCalendar.highlightCurrentDay(DateHelper.getTodaysDate().day);

        DrawCalendar.updateCalendarColors();
        DrawCalendar.setMonthAndYearText(DateHelper.getMonthNumber(), DateHelper.getMonthName(), DateHelper.getYear());
        DrawCalendar.setCalendarBorder();
    }
}