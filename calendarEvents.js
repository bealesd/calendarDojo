import { DataStore } from './dataStore.js';
import { FormHelper } from './formHelper.js';
import { CustomEvents } from './customEvents.js';
import { DateHelper } from './dateHelper.js';
import { CalendarRepo } from './calendarRepo.js';

export class CalendarEvents {
    static calendarFormId() {
        return 'addOrEditCalendarEvents';
    }

    static onAddCalendarClick() {
        document.querySelectorAll('.calendar > div > .block > .add').forEach((block) => {
            new CustomEvents().overwriteEvents('mouseup', block, () => {
                this.openAddCalendarForm();
            });
        });
    }

    static onUpdateCalendarEventClick() {
        document.querySelectorAll('.calendar > div > .block .calendarEventTitle').forEach((calendarEventTitle) => {
            new CustomEvents().overwriteEvents('mouseup', calendarEventTitle, () => {
                this.openUpdateCalendarForm();
            });
        });
    }

    static onDeleteCalendarEventClick(refreshCallback) {
        const element = document.querySelector('#eventDelete');
        new CustomEvents().overwriteEvents('mouseup', element, () => {
            this.deleteCalendarEvent(refreshCallback);
        });
    }

    static onCreateOrUpdateCalendarEventClick(refreshCallback) {
        //TODO dry?
        const element = document.querySelector('#eventAddOrUpdateButton');
        document.querySelector('#eventAddOrUpdateButton').innerHTML.toLowerCase() === 'add';

        new CustomEvents().overwriteEvents('mouseup', element, () => {
            if (document.querySelector('#eventAddOrUpdateButton').innerHTML.toLowerCase() === 'add')
                this.createCalendarEvent(refreshCallback);
            else if (document.querySelector('#eventAddOrUpdateButton').innerHTML.toLowerCase() === 'update')
                this.updateCalendarEvent(refreshCallback);
        });
    }

    static onCancelCalendarEventClick() {
        const element = document.querySelector('#eventClose');
        new CustomEvents().overwriteEvents('mouseup', element, () => {
            FormHelper.hideForm(this.calendarFormId());
        });
    }

    static onMultipleCalendarDaysEventClick() {
        const element = document.querySelector('#eventMultipleDays');
        new CustomEvents().overwriteEvents('mouseup', element, () => {
            this.multipleCalendarDaysEventClick();
        });
    }

    static multipleCalendarDaysEventClick() {
        const dateRangeElement = document.querySelector('#dateRange');
        dateRangeElement.style.display = dateRangeElement.style.display === 'none' ?
            dateRangeElement.style.display = 'block' :
            dateRangeElement.style.display = 'none'
    }

    static async deleteCalendarEvent(refreshCallback) {
        const guid = document.querySelector('#eventId').value;
        await CalendarRepo.deleteRecord(guid);

        let currentMonthCalendarRecords = DataStore.getValue('currentMonthCalendarRecords');
        const filteredRecords = currentMonthCalendarRecords.filter((currentMonthCalendarRecords) => {
            return currentMonthCalendarRecords['guid'] !== guid;
        });

        this.closeCalendarForm(filteredRecords, refreshCallback);
    }

    static async updateCalendarEvent(refreshCallback) {
        const guid = document.getElementById("eventId").value;
        const calendarRecord = this.getCalendarRecordById(guid);

        const title = document.getElementById("eventTitle").value;
        const hour = document.querySelector('#hour').value;
        const minute = document.querySelector('#minute').value;

        const year = calendarRecord['year'];
        const month = calendarRecord['month'];
        const day = calendarRecord['day'];

        let json = {
            'guid': guid,
            'title': `${title}`,
            'year': `${year}`,
            'month': `${month}`,
            'day': `${day}`,
            'hour': `${hour}`,
            'minute': `${minute}`
        }

        if (title.trim().length === 0) {
            alert('form incomplete');
            return;
        }
        const currentMonthRecords = DataStore.getValue('currentMonthCalendarRecords');
        await CalendarRepo.updateRecord(json);

        let calendarRecordToUpdateIndex = currentMonthRecords.findIndex((x) => { return x['guid'] === guid; });
        currentMonthRecords[calendarRecordToUpdateIndex] = json;

        this.closeCalendarForm(currentMonthRecords, refreshCallback);
    }

    static async createCalendarEvent(refreshCallback) {
        const title = document.querySelector("#eventTitle").value;

        const hour = document.querySelector('#hour').value;
        const minute = document.querySelector('#minute').value;

        if (title.trim().length === 0) {
            alert('Title is empty!');
            throw Error('Message: Title is empty!. \nMethod: createCalendarEvent');
        }

        const isValidDateRange = Date.parse(document.querySelector(`#eventFrom`).value) <= Date.parse(document.querySelector(`#eventTo`).value);
        if (!isValidDateRange) {
            alert('Invalid date range!');
            throw Error('Message: Date range is invalid!.\nMethod: createCalendarEvent');
        }

        const currentMonthRecords = DataStore.getValue('currentMonthCalendarRecords');
        const startDate = new Date(document.querySelector(`#eventFrom`).value);
        const endDate = new Date(document.querySelector(`#eventTo`).value);
        const dates = DateHelper.getDatesFromDateRange(startDate, endDate);

        for (let i = 0; i < dates.length; i++) {
            const year = dates[i].getFullYear();
            const month = dates[i].getMonth();
            const day = dates[i].getDate();

            let json = {
                'title': `${title}`,
                'year': `${year}`,
                'month': `${month}`,
                'day': `${day}`,
                'hour': `${hour}`,
                'minute': `${minute}`
            };

            const response = await CalendarRepo.postRecord(json);
            const responseJson = await response.json();
            json['guid'] = responseJson['guid'];
            currentMonthRecords.push(json);
        }

        document.querySelector('#eventMultipleDays').checked = false;

        this.closeCalendarForm(currentMonthRecords, refreshCallback);
    }

    static closeCalendarForm(currentMonthRecords, refreshCallback) {
        DataStore.setValue('currentMonthCalendarRecords', currentMonthRecords);
        FormHelper.hideForm(this.calendarFormId());
        refreshCallback();
    }

    static isMultipleDaysSelected() {
        return document.querySelector('#eventMultipleDays').checked;
    }

    static openUpdateCalendarForm() {
        const guid = event.currentTarget.dataset.guid;
        const calendarRecord = this.getCalendarRecordById(guid);

        document.querySelector('#multipleDays').style.display = 'none';
        document.querySelector('#dateRange').style.display = 'none';

        DateHelper.setDay(calendarRecord.day);
        this.setCalendarFormType('Update');
        this.setCalendarFormValues(
            `Update event on ${calendarRecord.day}`,
            calendarRecord['title'],
            calendarRecord['hour'],
            calendarRecord['minute'],
            calendarRecord['guid']
        );
        this.setCalendarFormPosition();
        FormHelper.showForm(this.calendarFormId());
    }

    static getCalendarRecordById(guid) {
        return DataStore.getValue('currentMonthCalendarRecords').find((calendarRecord) => { return calendarRecord.guid === guid });
    }

    static setCalenderFormDateRange() {
        //TODO - DRY
        const year = DateHelper.getYear();
        let month = DateHelper.getMonth();
        let day = DateHelper.getDay();

        month = parseInt(month) + 1;
        month = (month < 10) ? ("0" + month) : month;

        day = parseInt(day);
        day = (day < 10) ? ("0" + day) : day;

        document.querySelector(`#eventFrom`).value = `${year}-${month}-${day}`;
        document.querySelector(`#eventTo`).value = `${year}-${month}-${day}`;
    }

    static openAddCalendarForm() {
        document.querySelector('#eventMultipleDays').checked = false;
        document.querySelector('#multipleDays').style.display = 'block';
        document.querySelector('#dateRange').style.display = 'none';

        let day = event.srcElement.parentNode.dataset['day'];
        DateHelper.setDay(day);

        this.setCalenderFormDateRange();

        this.setCalendarFormType('Add');
        this.setCalendarFormValues(`Add event for day ${day}`, '', '10', '0', '', '', '');
        this.setCalendarFormPosition();
        FormHelper.showForm(this.calendarFormId());
    }

    static setCalendarFormType(formType) {
        if (formType.toLowerCase() === 'update')
            document.querySelector('#eventAddOrUpdateButton').innerHTML = 'Update';
        else if (formType.toLowerCase() === 'add')
            document.querySelector('#eventAddOrUpdateButton').innerHTML = 'Add';
        else
            console.log(`Invalid form type: ${formType}`);
    }

    static setCalendarFormValues(formTitle, eventTitle, hour, minute, guid) {
        document.querySelector('#eventId').value = guid;
        document.querySelector('#formTitle').innerHTML = formTitle;
        this.updateInputNode('eventTitle', eventTitle, 'title');
        hour = parseInt(hour);
        document.querySelector('#hour').value = (hour < 10) ? ("0" + hour) : hour;
        minute = parseInt(minute);
        document.querySelector('#minute').value = (minute < 10) ? ("0" + minute) : minute;
    }

    static setCalendarFormPosition() {
        const yOffset = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const formWidth = '298';
        const formHeight = '267.4';
        const style = document.querySelector(`#${this.calendarFormId()}`).style;

        style.top = `${yOffset + (windowHeight - formHeight) / 2}px`;
        style.left = `${(windowWidth - formWidth) / 2}px`;
    }

    static updateInputNode(id, value, placeholder) {
        const inputNode = document.querySelector(`#${id}`);
        inputNode.value = value;
        inputNode.placeholder = placeholder;
    }
}