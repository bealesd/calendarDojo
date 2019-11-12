export class CalendarRepo {

    static getBaseUrl(){
        return 'https://calservice.azurewebsites.net/'
        return 'http://localhost:1337/'
    }

    static getData(year, month) {
        return fetch(this.getBaseUrl() + `events?year=${year}&month=${month}`)
        .then((response)=>{
            return response.json();
        })
        .then((json)=>{
            return JSON.parse(json);
        })
    }

    static postData(title, ticks) {
        const jsonData = {
            title: title,
            date: ticks,
        };
        return fetch(this.getBaseUrl(), {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(jsonData)
        });
    }

    static updateData(title, id, ticks) {
        const jsonData = {
            title: title,
            date: ticks,
            id: id
        };
        return fetch(this.getBaseUrl(), {
            method: 'put',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(jsonData)
        });
    }

    static deleteData(id){
        return fetch(`${this.getBaseUrl()}?id=${id}`, {
            method: 'delete',
        });
    }
}
