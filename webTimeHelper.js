class WebTimeHelper {
    static webTimeToArray(time) {
        //format is "10:39 PM"
        var timeSplit = [parseInt(time.split(':')[0]), parseInt(time.split(':')[1].split(" ")[0]), time.split(':')[1].split(" ")[1]];
        var timeHours = timeSplit[2] === 'PM' && timeSplit[0] !== 12 ? timeSplit[0] + 12 : timeSplit[0];
        var timeMins = timeSplit[1];
        return [timeHours, timeMins];
    };

    static webTimeToString(time) {
        var timeHours = this.webTimeToArray(time)[0];
        var timeMins = this.webTimeToArray(time)[1];
        if (timeMins < 10) timeMins = `0${timeMins}`;
        if (timeHours < 10) return `0${timeHours}:${timeMins}`;
        return `${timeHours}:${timeMins}`;
    };
};