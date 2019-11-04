export class CalendarRepo {
    constructor() {
        this.calendarRepoUrl = 'http://localhost:1337/';
    }

    getData() {
        return fetch(this.calendarRepoUrl)
        .then((response)=>{return response.json();})
    }

    postData(title, id = "", ticks) {
        const jsonData = {
            title: `${title}`,
            date: ticks,
            id: `${id}`
        };
        return fetch(this.calendarRepoUrl, {
            method: 'post',
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