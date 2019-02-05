class CalendarRepo {
    constructor() {
        this.calendarRepoUrl = 'https://calservice.azurewebsites.net/';
    }

    getData(){
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', this.calendarRepoUrl, true);
        xhttp.timeout = 30000;
        xhttp.send();
        return new Promise(function (res, rej) {
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && (this.status === 200 || this.status === 201))
                    return res(JSON.parse(this.responseText));
                if (this.readyState === 4 && (this.status !== 200 || this.status !== 201))
                    return rej();
            };
        }.bind(this));
    }

    postData(title, time, who, where, id = "", date, dayClicked){
        var data = {
            title: `${title}`,
            date: `${date.getFullYear()}/${date.getMonth() + 1}/${dayClicked}`,
            time: `${time}`,
            who: `${who}`,
            where: `${where}`,
            id: `${id}`
        };
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", this.calendarRepoUrl, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(data));
        return new Promise(function (res, rej) {
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && (this.status === 200 || this.status === 201))
                    return res();
                if (this.readyState === 4 && (this.status !== 200 || this.status !== 201))
                    return rej();
            };
        }.bind(this));
    }

    postDataWithDate(title, time, who, where, id = "", day, month, year) {
        var data = {
            title: `${title}`,
            date: `${year}/${month}/${day}`,
            time: `${time}`,
            who: `${who}`,
            where: `${where}`,
            id: `${id}`
        };
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", this.calendarRepoUrl, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(data));
        return new Promise(function (res, rej) {
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && (this.status === 200 || this.status === 201))
                    return res();
                if (this.readyState === 4 && (this.status !== 200 || this.status !== 201))
                    return rej();
            };
        }.bind(this));
    }

    deleteData(id){
        var xhttp = new XMLHttpRequest();
        xhttp.open('DELETE', `${this.calendarRepoUrl}?id=${id}`, true);
        xhttp.send();
        return new Promise(function (res, rej) {
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && (this.status === 200 || this.status === 201))
                    return res();
                if (this.readyState === 4 && (this.status !== 200 || this.status !== 201))
                    return rej();
            };
        }.bind(this));
    }
}