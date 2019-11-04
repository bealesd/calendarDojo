import { DataStore } from './dataStore.js';

export class DateHelper {
    static monthDictionary() {
        let months = [];
        months.push("January");
        months.push("February");
        months.push("March");
        months.push("April");
        months.push("May");
        months.push("June");
        months.push("July");
        months.push("August");
        months.push("September");
        months.push("October");
        months.push("November");
        months.push("December");
        return months;
    }

    static daysDictionary() {
        let days = [];
        days.push("Sunday");
        days.push("Monday");
        days.push("Tuesday");
        days.push("Wednesday");
        days.push("Thursday");
        days.push("Friday");
        days.push("Saturday");
        return days;
    }

    static updateDate(isNextMonth) {
        let month = DataStore.getValue('month');
        let year = DataStore.getValue('year');
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
        DataStore.setValue('month', month);
        DataStore.setValue('year', year);
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
        const daysInMonth = DateHelper.getDaysInMonth();
        let daysNames = new Array(daysInMonth);
        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(DateHelper.getYear(), DateHelper.getMonthNumber(), i).getDay();
            daysNames[i] = DateHelper.daysDictionary()[day % 7];
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

    static getMonthNumber() {
        return DataStore.getValue('month');
    }

    static getMonthName() {
        return DateHelper.monthDictionary()[DateHelper.getMonthNumber()];
    }

    static getYear() {
        return DataStore.getValue('year');
    }

    static getDay() {
        return DataStore.getValue('day');
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

    static getHour() {
        return DataStore.getValue('hour');
    }

    static getMinute() {
        return DataStore.getValue('minute');
    }
}