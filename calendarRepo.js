export class CalendarRepo {
    constructor() {
        this.calendarRepoUrl = 'https://calservice.azurewebsites.net/';
    }

    getData() {
        return fetch(this.calendarRepoUrl)
        .then((response)=>{return response.json();})
    }

    postData(title, time, who, where, id = "", date, dayClicked) {
        const jsonData = {
            title: `${title}`,
            date: `${date.getFullYear()}/${date.getMonth() + 1}/${dayClicked}`,
            time: `${time}`,
            who: `${who}`,
            where: `${where}`,
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

    postDataWithDate(title, time, who, where, id = "", day, month, year) {
        const jsonData = {
            title: `${title}`,
            date: `${year}/${month}/${day}`,
            time: `${time}`,
            who: `${who}`,
            where: `${where}`,
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