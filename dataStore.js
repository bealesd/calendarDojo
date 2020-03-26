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

        DataStore.setValue('currentMonthCalendarRecords', records);
    }
}