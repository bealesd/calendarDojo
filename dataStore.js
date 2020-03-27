import {CalendarHelper} from './calendarHelper.js'

export class DataStore {
    static getValue(key) { return JSON.parse(localStorage.getItem(key)); }

    static setValue(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

    static async storeRecords(recordsArray) {
        let records = [];
        recordsArray.forEach(row => {
            records.push({
                'guid': row[0],
                'title': row[1],
                'year': row[2],
                'month': row[3],
                'day': row[4],
                'hour': row[5],
                'minute': row[6]
            });
        });

        records = records.sort(CalendarHelper.compareByTime);

        DataStore.setValue('currentMonthCalendarRecords', records);
    }

    static getCalendarRecordById(guid) {
        return DataStore.getValue('currentMonthCalendarRecords').find((calendarRecord) => { return calendarRecord.guid === guid });
    }
}