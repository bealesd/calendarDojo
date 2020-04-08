import {CalendarHelper} from './calendarHelper.js'

export class DataStore {
    static getValue(key) { return JSON.parse(localStorage.getItem(key)); }

    static setValue(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

    static async storeRecords(recordsArray) {

        let records = recordsArray;
        records = records.sort(CalendarHelper.compareByTime);

        DataStore.setValue('currentMonthCalendarRecords', records);
    }

    static getCalendarRecordById(guid) {
        return DataStore.getValue('currentMonthCalendarRecords').find((calendarRecord) => { return calendarRecord.guid === guid });
    }
}