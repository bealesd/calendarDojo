import { WebTimeHelper } from './webTimeHelper.js';

export class CalendarHelper {
    static compareCalendarEventsByTime(calendarEventOne, calendarEventTwo) {
        let timeOneHours = WebTimeHelper.webTimeToString(calendarEventOne.time)[0];
        let timeOneMins = WebTimeHelper.webTimeToString(calendarEventOne.time)[1];
        let timeTwoHours = WebTimeHelper.webTimeToString(calendarEventTwo.time)[0];
        let timeTwoMins = WebTimeHelper.webTimeToString(calendarEventTwo.time)[1];

        if (timeOneHours < timeTwoHours) return -1;
        else if (timeOneHours > timeTwoHours) return 1;
        else if (timeOneHours === timeTwoHours && timeOneMins > timeTwoMins) return 1;
        else if (timeOneHours === timeTwoHours && timeOneMins < timeTwoMins) return -1;
        return 0;
    }

    static compareByTime(calendarEventOne, calendarEventTwo) {
        if (calendarEventOne.time < calendarEventTwo.time) return -1;
        else if (calendarEventTwo.time > calendarEventOne.time) return 1;
        return 0;
    }

    static removeSubMenu() {
        document.getElementsByClassName('subMenu')[0].innerHTML = '';
    }

    static resizeThrottler(callback) {
        let resizeTimeout;
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                callback();
            }.bind(this), 66);
        }
    }
}