import { DataStore } from './dataStore.js';

export class DateHelper {
    static monthDictionary() {
        let months = new Array(12);
        months[0] = "January";
        months[1] = "February";
        months[2] = "March";
        months[3] = "April";
        months[4] = "May";
        months[5] = "June";
        months[6] = "July";
        months[7] = "August";
        months[8] = "September";
        months[9] = "October";
        months[10] = "November";
        months[11] = "December";
        return months;
    }

    static daysDictionary() {
        let days = new Array(7);
        days[0] = "Sunday";
        days[1] = "Monday";
        days[2] = "Tuesday";
        days[3] = "Wednesday";
        days[4] = "Thursday";
        days[5] = "Friday";
        days[6] = "Saturday";
        return days;
    }

    static changeMonth(isNextMonth) {
        let month = this.getMonth();
        let year = this.getYear();
        if (isNextMonth) {
            if (month === 11) {
                month = 0;
                year += 1;
            }
            else month += 1;
        }
        else {
            if (month === 0) {
                month = 11;
                year -= 1;
            }
            else month -= 1;
        }
        this.setMonth(month);
        this.setYear(year);
    }

    static getDate(year, month, day, hours, minutes) {
        let date = new Date();
        date.setMinutes(minutes);
        date.setHours(hours);
        date.setDate(day);
        date.setMonth(month);
        date.setFullYear(year);
        return date;
    }

    static getDaysNames() {
        const daysInMonth = this.getDaysInMonth();
        let daysNames = new Array(daysInMonth);
        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(this.getYear(), this.getMonth(), i).getDay();
            daysNames[i] = this.daysDictionary()[day % 7];
        }
        return daysNames;
    }

    static getTodaysDate() {
        let date = new Date();
        return { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
    }

    static getDaysInMonth() {
        return new Date(DataStore.getValue('year'), DataStore.getValue('month') + 1, 0).getDate();
    }

    static getYear() {
        return DataStore.getValue('year');
    }

    static getMonth() {
        return DataStore.getValue('month');
    }

    static getMonthName() {
        return DateHelper.monthDictionary()[this.getMonth()];
    }

    static getDay() {
        return DataStore.getValue('day');
    }

    static getHour() {
        return DataStore.getValue('hour');
    }

    static getMinute() {
        return DataStore.getValue('minute');
    }

    static setYear(year) {
        DataStore.setValue('year', year);
    }

    static setMonth(month) {
        DataStore.setValue('month', month);
    }

    static setDay(day) {
        DataStore.setValue('day', day);
    }

    static setHour(hour) {
        DataStore.setValue('hour', hour);
    }

    static setMinute(minutes) {
        DataStore.setValue('minute', minutes);
    }

    static getDatesFromDateRange(startDate, endDate) {
        const dateArray = new Array();
        let currentDate = startDate;
        while (currentDate <= endDate) {
            dateArray.push(new Date(currentDate));
            currentDate = this.addDays(currentDate, 1);
        }
        return dateArray;
    }

    static addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
}