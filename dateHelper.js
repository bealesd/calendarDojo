class DateHelper {
    constructor() {
        this.initializeMonthDictionary();
        this.initializeDaysDictionary();
        this.date = new Date();
    }

    initializeMonthDictionary() {
        this.monthDictionary = new Array(12);
        this.monthDictionary[0] = "January";
        this.monthDictionary[1] = "February";
        this.monthDictionary[2] = "March";
        this.monthDictionary[3] = "April";
        this.monthDictionary[4] = "May";
        this.monthDictionary[5] = "June";
        this.monthDictionary[6] = "July";
        this.monthDictionary[7] = "August";
        this.monthDictionary[8] = "September";
        this.monthDictionary[9] = "October";
        this.monthDictionary[10] = "November";
        this.monthDictionary[11] = "December";
    }

    initializeDaysDictionary() {
        this.daysDictionary = new Array(7);
        this.daysDictionary[0] = "Sunday";
        this.daysDictionary[1] = "Monday";
        this.daysDictionary[2] = "Tuesday";
        this.daysDictionary[3] = "Wednesday";
        this.daysDictionary[4] = "Thursday";
        this.daysDictionary[5] = "Friday";
        this.daysDictionary[6] = "Saturday";
    }

    updateDate(isNextMonth) {
        var month = this.date.getMonth();
        var year = this.date.getFullYear();
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
        this.date.setMonth(month);
        this.date.setFullYear(year);
    }

    getDaysNames() {
        var daysInMonth = this.getDaysInMonth();
        var daysNames = new Array(daysInMonth);
        for (var i = 1; i <= daysInMonth; i++) {
            var day = new Date(this.getYear(), this.getMonthNumber(), i).getDay();
            daysNames[i] = this.daysDictionary[day % 7];
        }
        return daysNames;
    }

    getTodaysDate() {
        var date = new Date();
        return { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
    }

    getDaysInMonth() {
        return new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    }

    getMonthNumber() {
        return this.date.getMonth();
    }

    getMonthName() {
        return this.monthDictionary[this.getMonthNumber()];
    }

    getYear() {
        return this.date.getFullYear();
    }

    getDay() {
        return this.date.getDate();
    }
}