import { DataStore } from './dataStore.js';

export class CalendarRepo {

    static getBaseUrl() {
        // return 'https://calservice.azurewebsites.net/'
        return 'http://127.0.0.1:5000/events'
    }

    static async getData(year, month) {
        const response = await fetch(`${this.getBaseUrl()}?year=${year}&month=${month}`);
        const json = await response.json();

        let jsonArray = [];
        json.forEach(row => {
            jsonArray.push({
                'guid': row[0],
                'title': row[1],
                'year': row[2],
                'month': row[3],
                'day': row[4],
                'hour': row[5],
                'minute': row[6]
            });
        });

        DataStore.setValue('currentMonthCalendarRecords', jsonArray);
        return jsonArray;
    }

    static postData(json) {
        return fetch(this.getBaseUrl(), {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(json)
        });
    }

    static updateData(json) {
        return fetch(`${this.getBaseUrl()}/${json['guid']}`, {
            method: 'put',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(json)
        });
    }

    static deleteData(guid) {
        return fetch(`${this.getBaseUrl()}/${guid}`, {
            method: 'delete',
        });
    }
}
