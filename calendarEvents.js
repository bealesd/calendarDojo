import { DataStore } from './dataStore.js';
import { FormHelper } from './formHelper.js';
import { CustomEvents } from './customEvents.js';
import { DateHelper } from './dateHelper.js';
import { CalendarRepo } from './calendarRepo.js';

export class CalendarEvents {

    constructor() {
        this.customEvents = new CustomEvents();
        this.formHelper = new FormHelper();
        this.dateHelper = new DateHelper();

        this.calendarRecordForm = document.querySelector('#addOrEditCalendarEvents');
        this.calendarRecordFormTitle = document.querySelector('#formTitle');

        this.calendarRecordId = document.querySelector('#eventId');
        this.calendarRecordTitle = document.querySelector('#eventTitle');
        this.calendarRecordHour = document.querySelector('#hour');
        this.calendarRecordMinute = document.querySelector('#minute');

        this.calendarRecordMultipleDays = document.querySelector('#multipleDays');
        this.calendarRecordMultipleDaysCheckbox = document.querySelector('#eventMultipleDays');
        this.calendarRecordDateRange = document.querySelector('#dateRange');
        this.calendarRecordStartDate = document.querySelector('#eventFrom');
        this.calendarRecordEndDate = document.querySelector('#eventTo');

        this.calendarRecordAddOrUpdateButton = document.querySelector('#eventAddOrUpdateButton');
        this.calendarRecordDeleteButton = document.querySelector('#eventDelete');
        this.calendarRecordCloseButton = document.querySelector('#eventClose');
    }

    //calendar events
    onAddCalendarRecordClick() {
        document.querySelectorAll('.calendar > div > .block > .add').forEach((block) => {
            this.customEvents.overwriteEvents('mouseup', block, () => {
                this.openAddCalendarForm();
            });
        });
    }

    onUpdateCalendarRecordClick() {
        document.querySelectorAll('.calendar > div > .block .calendarEventTitle').forEach((calendarEventTitle) => {
            this.customEvents.overwriteEvents('mouseup', calendarEventTitle, () => {
                this.openUpdateCalendarForm();
            });
        });
    }

    //calendar event handlers
    openAddCalendarForm() {
        this.calendarRecordMultipleDaysCheckbox.checked = false;
        this.calendarRecordMultipleDays.style.display = 'block';
        this.calendarRecordDateRange.style.display = 'none';

        let day = event.srcElement.parentNode.dataset['day'];
        this.dateHelper.currentDay = day;

        this.formHelper.setCalendarFormType(FormHelper.FormType.add);
        this.formHelper.setCalendarFormValues(`Add event for day ${day}`, '', '10', '0', '', '', '');
        this.formHelper.setCalendarFormPosition();
        this.formHelper.showForm();
    }

    openUpdateCalendarForm() {
        const guid = event.currentTarget.dataset.guid;
        const calendarRecord = DataStore.getCalendarRecordById(guid);

        this.calendarRecordMultipleDays.style.display = 'none';
        this.calendarRecordDateRange.style.display = 'none';

        this.dateHelper.day = calendarRecord.day;

        this.formHelper.setCalendarFormType(FormHelper.FormType.update);
        this.formHelper.setCalendarFormValues(
            `Update event on ${calendarRecord.day}`,
            calendarRecord['title'],
            calendarRecord['hour'],
            calendarRecord['minute'],
            calendarRecord['guid']
        );
        this.formHelper.setCalendarFormPosition();
        this.formHelper.showForm();
    }

    //calender form events
    onCreateOrUpdateCalendarRecordClick(refreshCallback) {
        this.customEvents.overwriteEvents('mouseup', this.calendarRecordAddOrUpdateButton, () => {
            this.createOrUpdateCalendarRecord(refreshCallback)
        });
    }

    onDeleteCalendarRecordClick(refreshCallback) {
        this.customEvents.overwriteEvents('mouseup', this.calendarRecordDeleteButton, () => {
            this.deleteCalendarRecord(refreshCallback);
        });
    }

    onCancelCalendarRecordClick() {
        this.customEvents.overwriteEvents('mouseup', this.calendarRecordCloseButton, () => {
            this.formHelper.hideForm();
        });
    }

    onMultipleCalendarDaysRecordClick() {
        this.customEvents.overwriteEvents('mouseup', this.calendarRecordMultipleDaysCheckbox, () => {
            this.multipleCalendarDaysRecordClick();
        });
    }

    //calendar form event handlers
    createOrUpdateCalendarRecord(refreshCallback) {
        const calendarFormType = FormHelper.FormType[this.calendarRecordAddOrUpdateButton.innerHTML.toLowerCase()];
        switch (calendarFormType) {
            case FormHelper.FormType.add:
                this.createCalendarRecord(refreshCallback);
                break;
            case FormHelper.FormType.update:
                this.updateCalendarRecord(refreshCallback)
                break;
            default:
                throw Error(`Message: Invalid form type: ${calendarFormType}.` +
                    `\nMethod: getCalendarFormType.`);
        }
    }

    async createCalendarRecord(refreshCallback) {
        const title = this.calendarRecordTitle.value;

        const hour = this.calendarRecordHour.value;
        const minute = this.calendarRecordMinute.value;

        if (title.trim().length === 0) {
            alert('Title is empty!');
            throw Error('Message: Title is empty!. \nMethod: createCalendarRecord');
        }

        const isValidDateRange = Date.parse(document.querySelector(`#eventFrom`).value) <= Date.parse(document.querySelector(`#eventTo`).value);
        if (!isValidDateRange) {
            alert('Invalid date range!');
            throw Error('Message: Date range is invalid!.\nMethod: createCalendarRecord');
        }

        const currentMonthRecords = DataStore.getValue('currentMonthCalendarRecords');
        const startDate = new Date(this.calendarRecordStartDate.value);
        const endDate = new Date(this.calendarRecordEndDate.value);
        const dates = this.dateHelper.getDatesFromDateRange(startDate, endDate);

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

        this.calendarRecordMultipleDaysCheckbox.checked = false;

        this.formHelper.closeCalendarForm(currentMonthRecords, refreshCallback);
    }

    async updateCalendarRecord(refreshCallback) {
        const guid = this.calendarRecordId.value;
        const calendarRecord = DataStore.getCalendarRecordById(guid);

        const title = this.calendarRecordTitle.value;
        const hour = this.calendarRecordHour.value;
        const minute = this.calendarRecordMinute.value;

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
            alert('Title is empty!');
            throw Error('Message: Title is empty!. \nMethod: updateCalendarRecord.');
        }
        const currentMonthRecords = DataStore.getValue('currentMonthCalendarRecords');
        await CalendarRepo.updateRecord(json);

        let calendarRecordToUpdateIndex = currentMonthRecords.findIndex((record) => { return record['guid'] === guid; });
        currentMonthRecords[calendarRecordToUpdateIndex] = json;

        this.formHelper.closeCalendarForm(currentMonthRecords, refreshCallback);
    }

    async deleteCalendarRecord(refreshCallback) {
        const guid = this.calendarRecordId.value;
        await CalendarRepo.deleteRecord(guid);

        let currentMonthCalendarRecords = DataStore.getValue('currentMonthCalendarRecords');
        const filteredRecords = currentMonthCalendarRecords.filter((currentMonthCalendarRecords) => {
            return currentMonthCalendarRecords['guid'] !== guid;
        });

        this.formHelper.closeCalendarForm(filteredRecords, refreshCallback);
    }

    multipleCalendarDaysRecordClick() {
        this.calendarRecordDateRange.style.display = this.calendarRecordDateRange.style.display === 'none' ?
            this.calendarRecordDateRange.style.display = 'block' :
            this.calendarRecordDateRange.style.display = 'none'
    }
}