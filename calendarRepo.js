export class CalendarRepo {
    constructor() {
        // this.calendarRepoUrl = 'http://localhost:1337/';
        this.calendarRepoUrl = 'https://calservice.azurewebsites.net/';
    }

    getData(year, month) {
        return fetch(this.calendarRepoUrl + `events?year=${year}&month=${month}`)
        .then((response)=>{
            return response.json();
        })
        .then((json)=>{
            return JSON.parse(json);
        })
    }

    postData(title, ticks) {
        const jsonData = {
            title: title,
            date: ticks,
        };
        return fetch(this.calendarRepoUrl, {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(jsonData)
        });
    }

    updateData(title, id, ticks) {
        const jsonData = {
            title: title,
            date: ticks,
            id: id
        };
        return fetch(this.calendarRepoUrl, {
            method: 'put',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(jsonData)
        });
    }

    deleteData(id){
        return fetch(`${this.calendarRepoUrl}?id=${id}`, {
            method: 'delete',
        });
    }
}