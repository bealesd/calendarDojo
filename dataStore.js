class DataStore {
    static getJson() { return document.getElementById('dataStore').value; }

    static addJson(newJson) {
        var dataStore = document.getElementById('dataStore');
        var oldJson = dataStore.value;
        dataStore.value = DataStore.updateJson(oldJson, newJson);
    }

    static updateJson(oldJson, newJson) { return Object.assign({}, oldJson, newJson); }

    static getCurrentMonthCalendarRecords() { return DataStore.getJson().currentMonthCalendarRecords; }

    static addCurrentMonthCalendarRecords(json) { DataStore.addJson({ currentMonthCalendarRecords: json }); }
}