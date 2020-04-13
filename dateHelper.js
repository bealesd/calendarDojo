export class DateHelper {
    constructor() {
        if (!DateHelper.instance) {
            DateHelper.instance = this;

            this.currentMonth = this.getTodaysDate().month;
            this.currentYear = this.getTodaysDate().year;
            this.currentDay = this.getTodaysDate().day;

            this.currentHour = null;
            this.currentMinute = null;
        }
        return DateHelper.instance;
    }

    static get MonthsEnum() {
        //js months are 0 indexed
        const monthsEnum = {
            "January": 0,
            "February": 1,
            "March": 2,
            "April": 3,
            "May": 4,
            "June": 5,
            "July": 6,
            "August": 7,
            "September": 8,
            "October": 9,
            "November": 10,
            "December": 11
        };
        Object.freeze(monthsEnum);
        return monthsEnum;
    }

    static get DaysEnum() {
        //js days are 1 indexed
        const daysEnum = {
            "Sunday": 1,
            "Monday": 2,
            "Tuesday": 3,
            "Wednesday": 4,
            "Thursday": 5,
            "Friday": 6,
            "Saturday": 7
        };
        Object.freeze(daysEnum);
        return daysEnum;
    }

    getDatesFromDateRange(startDate, endDate) {
        const dateArray = new Array();
        let currentDate = startDate;
        while (currentDate <= endDate) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

    getTodaysDate() {
        let date = new Date();
        return { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
    }

    getMonthName() {
        return Object.keys(DateHelper.MonthsEnum)[this.currentMonth];
    }
    changeMonth(isNextMonth) {
        let year = this.currentYear;
        let month = this.currentMonth;

        let isNextYear = isNextMonth && month === DateHelper.MonthsEnum.December;
        let isPreviousYear = !isNextMonth && month === DateHelper.MonthsEnum.January;

        this.currentMonth = isNextYear ? DateHelper.MonthsEnum.January : isPreviousYear ? DateHelper.MonthsEnum.December : isNextMonth ? month + 1 : month - 1;
        this.currentYear = isNextYear ? year + 1 : isPreviousYear ? year - 1 : year;
    }

    getDaysInMonth() {
        //Month is 1 indexed when parsed in Date. yy-mm-dd.
        return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    }

    getDaysNames() {
        const daysInMonth = this.getDaysInMonth();
        let daysNames = new Array(daysInMonth);
        for (let dayInMonth = 1; dayInMonth <= daysInMonth; dayInMonth++) {
            const day = new Date(this.currentYear, this.currentMonth, dayInMonth).getDay();
            daysNames[dayInMonth] = Object.keys(DateHelper.DaysEnum)[day%7]
        }
        return daysNames;
    }
}