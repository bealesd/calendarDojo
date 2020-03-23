import { DataStore } from './dataStore.js';
import { FormHelper } from './formHelper.js';
import { CustomEvents } from './customEvents.js';
import { DateHelper } from './dateHelper.js';
import { WebTimeHelper } from './webTimeHelper.js';
import { CalendarRepo } from './calendarRepo.js'

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

    static onDeleteCalendarEventClick(cb) {
        const element = document.querySelector('#eventDelete');
        new CustomEvents().overwriteEvents('mouseup', element, () => {
            this.deleteCalendarEvent(cb);
        });

    }

    static onCreateOrUpdateCalendarEventClick(cb) {
        const element = document.querySelector('#eventAddOrUpdateButton');
        new CustomEvents().overwriteEvents('mouseup', element, () => {
            this.createOrUpdateCalendarEvent(cb);
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

    static deleteCalendarEvent(cb) {
        const id = document.getElementById('eventId').value;
        CalendarRepo.deleteData(id)
            .then(() => {
                FormHelper.hideForm(this.calendarFormId());
                cb();
            });
    }

    static createOrUpdateCalendarEvent(cb) {
        const id = document.getElementById("eventId").value;
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
            'guid': id,
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
            this.createMultipleDaysCalendarEvent(title, id, cb);
        else {
            if (id === undefined || id === "" || id === null) {
                CalendarRepo.postData(json)
                    .then(() => {
                        FormHelper.hideForm(this.calendarFormId());
                        cb();
                    });
            }
            else {
                CalendarRepo.updateData(json)
                    .then(() => {
                        FormHelper.hideForm(this.calendarFormId());
                        cb();
                    });
            }
        }
        return false;
    }

    static createMultipleDaysCalendarEvent(title, id, cb) {
        const startDate = new Date(document.getElementById(`eventFrom`).value);
        const endDate = new Date(document.getElementById(`eventTo`).value);
        const dates = this.getDatesFromDateRange(startDate, endDate);
        for (let i = 0; i < dates.length; i++) {
            const day = dates[i].getDate();
            const month = dates[i].getMonth();
            const year = dates[i].getFullYear();
            const hours = DateHelper.getHour();
            const minutes = DateHelper.getMinute();
            let date = DateHelper.getDate(year, month, day, hours, minutes);

            CalendarRepo.postData(title, id, date.getTime())
                .then(() => {
                    if (i === (dates.length - 1)) {
                        const year = DateHelper.getYear();
                        const month = DateHelper.getMonth();
                        CalendarRepo.getData(year, month)
                            .then(() => {
                                FormHelper.hideForm(this.calendarFormId());
                                cb();
                            });
                    }
                });
        }
    }

    static isMultipleDaysSelected() {
        return $('#eventMultipleDays')[0].checked;
    }

    static openUpdateCalendarForm() {
        const id = event.currentTarget.id;
        const calendarRecord = this.getCalendarRecordById(id);

        $('#multipleDays').hide();
        $('#dateRange').hide();

        let t = new Date();
        t.setFullYear(calendarRecord['year']);
        t.setMonth(calendarRecord['month'])
        t.setDate(calendarRecord['day']);
        t.setHours(calendarRecord['hour']);
        t.setMinutes(calendarRecord['minute']);

        DateHelper.setDay(calendarRecord.day);
        this.setCalendarFormType('Update');
        this.setCalendarFormValues(`Update event on ${calendarRecord.day}`,
            calendarRecord.title,
            WebTimeHelper.webTimeToString(t),
            calendarRecord.id);
        this.setCalendarFormPosition();
        FormHelper.showForm(this.calendarFormId());
    }

    static getCalendarRecordById(id) {
        return DataStore.getValue('currentMonthCalendarRecords').find((calendarRecord) => calendarRecord.id === event.currentTarget.id);
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

    static setCalendarFormValues(formTitle, eventTitle, time, id) {
        document.getElementById('eventId').value = id;
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