export class WebTimeHelper {
    static webTimeToArray(time) {
        //format is "10:39 PM"
        var timeSplit = [parseInt(time.split(':')[0]), parseInt(time.split(':')[1].split(" ")[0]), time.split(':')[1].split(" ")[1]];
        var timeHours = timeSplit[2] === 'PM' && timeSplit[0] !== 12 ? timeSplit[0] + 12 : timeSplit[0];
        var timeMins = timeSplit[1];
        return [timeHours, timeMins];
    };

    static webTimeToString(date) {
        return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    };
};