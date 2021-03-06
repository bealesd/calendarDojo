export class CalendarRepo {

    static getBaseUrl() {
        return 'https://calendarservicenodejs.azurewebsites.net/events'
        // return 'http://localhost:8080/events'
    }

    static async getRecords(year, month) {
        const response = await fetch(`${this.getBaseUrl()}?year=${year}&month=${month}`);
        return await response.json();
    }

    static postRecord(json) {
        return fetch(this.getBaseUrl(), {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(json)
        });
    }

    static updateRecord(json) {
        return fetch(`${this.getBaseUrl()}/${json['guid']}`, {
            method: 'put',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(json)
        });
    }

    static deleteRecord(guid) {
        return fetch(`${this.getBaseUrl()}/${guid}`, {
            method: 'delete',
        });
    }
}