class CalendarHelper {
    static compareCalendarEvents(calendarEventOne, calendarEventTwo) {
        var timeOneHours = WebTimeHelper.webTimeToString(calendarEventOne.time)[0];
        var timeOneMins = WebTimeHelper.webTimeToString(calendarEventOne.time)[1];
        var timeTwoHours = WebTimeHelper.webTimeToString(calendarEventTwo.time)[0];
        var timeTwoMins = WebTimeHelper.webTimeToString(calendarEventTwo.time)[1];

        if (timeOneHours < timeTwoHours) return -1;
        else if (timeOneHours > timeTwoHours) return 1;
        else if (timeOneHours === timeTwoHours && timeOneMins > timeTwoMins) return 1;
        else if (timeOneHours === timeTwoHours && timeOneMins < timeTwoMins) return -1;
        return 0;
    };
};