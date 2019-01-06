class CalendarHelper {
    static compareCalendarEventsByTime(calendarEventOne, calendarEventTwo) {
        var timeOneHours = WebTimeHelper.webTimeToString(calendarEventOne.time)[0];
        var timeOneMins = WebTimeHelper.webTimeToString(calendarEventOne.time)[1];
        var timeTwoHours = WebTimeHelper.webTimeToString(calendarEventTwo.time)[0];
        var timeTwoMins = WebTimeHelper.webTimeToString(calendarEventTwo.time)[1];

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

}