export class CalendarHelper {

    static compareByTime(a, b) {
        let is_hour_a_before_b = a.hour < b.hour ? true : (a.hour === b.hour ? null : false);
        let is_minute_a_before_b = a.minute < b.minute ? true : (a.minute === b.minute ? null : false);
        
        let is_a_before_b = is_hour_a_before_b || (is_hour_a_before_b === null && is_minute_a_before_b);
        let is_a_same_as_b = is_hour_a_before_b === null && is_minute_a_before_b === null;

        return is_a_before_b ? -1 : (is_a_same_as_b ? 1 : 0);
    }

    static removeSubMenu() {
        document.querySelector('.subMenu').innerHTML = '';
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

    static padInt(number, padLength) {
        let safeNumber = parseInt(number);
        if (isNaN(safeNumber))
            throw Error(`Message: number is not an int: ${number}!\nMethod: padInteger!`)

        let safePadLength = parseInt(padLength);
        if (isNaN(safePadLength))
            throw Error(`Message: padLength is not an int: ${padLength}!\nMethod: padInteger!`)

        let numberLength = `${safeNumber}`.length;
        let paddingZeros = '0'.repeat(safePadLength - numberLength);
        let paddedNumber = `${paddingZeros}${safeNumber}`;
        return paddedNumber;
    }
}