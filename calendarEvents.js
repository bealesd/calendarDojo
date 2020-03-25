import { DataStore } from './dataStore.js';
import { FormHelper } from './formHelper.js';
import { CustomEvents } from './customEvents.js';
import { DateHelper } from './dateHelper.js';
import { WebTimeHelper } from './webTimeHelper.js';
import { CalendarRepo } from './calendarRepo.js';

export class CalendarEvents {
    static calendarFormId() {
        return 'addOrEditCalendarEvents';
    }

    static onAddCalendarClick() {
        document.querySelectorAll('.calendar > div > .block > .add').forEach((block) => {
            const day = block.parentNode.id;
            new CustomEvents().overwriteEvents('mouseup', block, () => {
                this.openAddCalendarForm(day);
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
        const element = document.querySelector('#eventAddOrUpdateButton');
        new CustomEvents().overwriteEvents('mouseup', element, () => {
            this.createOrUpdateCalendarEvent(refreshCallback);
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
        $('#dateRange').toggle();
    }

    static async deleteCalendarEvent(refreshCallback) {
        const guid = document.getElementById('eventId').value;
        await CalendarRepo.deleteData(guid);

        FormHelper.hideForm(this.calendarFormId());

        let records = DataStore.getValue('currentMonthCalendarRecords');
        const filteredRecords = records.filter((record) => {
            return record['guid'] !== guid;
        });
        DataStore.setValue('currentMonthCalendarRecords', filteredRecords);

        refreshCallback();
    }

    static async createOrUpdateCalendarEvent(refreshCallback) {
        const guid = document.getElementById("eventId").value;
        const title = document.getElementById("eventTitle").value;

        const time = document.getElementById("eventTime").value;
        const hoursAndMinutesArray = WebTimeHelper.webTimeToArray(time);
        DateHelper.setHour(hoursAndMinutesArray[0]);
        DateHelper.setMinute(hoursAndMinutesArray[1]);

        const year = DateHelper.getYear();
        const month = DateHelper.getMonth();
        const day = DateHelper.getDay();
        const hour = DateHelper.getHour();
        const minute = DateHelper.getMinute();

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
            return false;
        }
        const isValidDateRange = Date.parse(document.getElementById(`eventFrom`).value) < Date.parse(document.getElementById(`eventTo`).value);

        if (this.isMultipleDaysSelected() && !isValidDateRange) {
            alert('invalid date');
            return false;
        }

        if (this.isMultipleDaysSelected())
            await this.createMultipleDaysCalendarEvent(title, refreshCallback);
        else {
            const currentMonthRecords = DataStore.getValue('currentMonthCalendarRecords');
            const isNewRecord = guid === undefined || guid === "" || guid === null;

            if (isNewRecord) {
                const response = await CalendarRepo.postData(json);

                const responseJson = await response.json();
                json['guid'] = responseJson['guid'];

                currentMonthRecords.push(json);
            }
            else {
                await CalendarRepo.updateData(json);

                let index = currentMonthRecords.findIndex((x) => { return x['guid'] === guid; });
                currentMonthRecords[index] = json;
            }

            DataStore.setValue('currentMonthCalendarRecords', currentMonthRecords);
            FormHelper.hideForm(this.calendarFormId());
            refreshCallback();
        }
        return false;
    }

    static async createMultipleDaysCalendarEvent(title, refreshCallback) {
        const startDate = new Date(document.getElementById(`eventFrom`).value);
        const endDate = new Date(document.getElementById(`eventTo`).value);
        const dates = DateHelper.getDatesFromDateRange(startDate, endDate);
        for (let i = 0; i < dates.length; i++) {
            const day = dates[i].getDate();
            const month = dates[i].getMonth();
            const year = dates[i].getFullYear();
            const hour = DateHelper.getHour();
            const minute = DateHelper.getMinute();

            let json = {
                'title': `${title}`,
                'year': `${year}`,
                'month': `${month}`,
                'day': `${day}`,
                'hour': `${hour}`,
                'minute': `${minute}`
            };
            await CalendarRepo.postData(json);
        }

        const year = DateHelper.getYear();
        const month = DateHelper.getMonth();
        await CalendarRepo.getData(year, month);
        FormHelper.hideForm(this.calendarFormId());
        refreshCallback();
    }

    static isMultipleDaysSelected() {
        return $('#eventMultipleDays')[0].checked;
    }

    static openUpdateCalendarForm() {
        const guid = event.currentTarget.id;
        const calendarRecord = this.getCalendarRecordById(guid);

        $('#multipleDays').hide();
        $('#dateRange').hide();

        let date = new Date();
        date.setFullYear(calendarRecord['year']);
        date.setMonth(calendarRecord['month'])
        date.setDate(calendarRecord['day']);
        date.setHours(calendarRecord['hour']);
        date.setMinutes(calendarRecord['minute']);

        DateHelper.setDay(calendarRecord.day);
        this.setCalendarFormType('Update');
        this.setCalendarFormValues(`Update event on ${calendarRecord.day}`,
            calendarRecord.title,
            WebTimeHelper.webTimeToString(date),
            calendarRecord.guid);
        this.setCalendarFormPosition();
        FormHelper.showForm(this.calendarFormId());
    }

    static getCalendarRecordById(guid) {
        return DataStore.getValue('currentMonthCalendarRecords').find((calendarRecord) => {return calendarRecord.guid === guid});
    }

    static openAddCalendarForm(day) {
        $('#eventMultipleDays')[0].checked = false;
        $('#multipleDays').show();
        $('#dateRange').hide();

        DateHelper.setDay(day);
        this.setCalendarFormType('Add');
        this.setCalendarFormValues(`Add event for day ${day}`, '', '10:00', '', '', '');
        this.setCalendarFormPosition();
        FormHelper.showForm(this.calendarFormId());
    }

    static setCalendarFormType(formType) {
        if (formType.toLowerCase() === 'update')
            document.getElementById('eventAddOrUpdateButton').innerHTML = 'Update';
        else if (formType.toLowerCase() === 'add')
            document.getElementById('eventAddOrUpdateButton').innerHTML = 'Add';
        else
            console.log(`Invalid form type: ${formType}`);
    }

    static setCalendarFormValues(formTitle, eventTitle, time, guid) {
        document.getElementById('eventId').value = guid;
        document.getElementById('formTitle').innerHTML = formTitle;
        this.updateInputNode('eventTitle', eventTitle, 'title');
        this.updateInputNode('eventTime', time, '');
    }

    static setCalendarFormPosition() {
        const yOffset = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const formWidth = '298';
        const formHeight = '267.4';
        const style = document.getElementById(this.calendarFormId()).style;

        style.top = `${yOffset + (windowHeight - formHeight) / 2}px`;
        style.left = `${(windowWidth - formWidth) / 2}px`;
    }

    static updateInputNode(id, value, placeholder) {
        const inputNode = document.getElementById(id);
        inputNode.value = value;
        inputNode.placeholder = placeholder;
    }
}