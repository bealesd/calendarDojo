import { DataStore } from './dataStore.js';
import { DateHelper } from './dateHelper.js';
import { CalendarHelper } from './calendarHelper.js';

export class FormHelper {
    constructor() {
        this.calendarRecordForm = document.querySelector('#addOrEditCalendarEvents');
        this.calendarRecordFormTitle = document.querySelector('#formTitle');

        this.calendarRecordId = document.querySelector('#eventId');
        this.calendarRecordTitle = document.querySelector('#eventTitle');
        this.calendarRecordHour = document.querySelector('#hour');
        this.calendarRecordMinute = document.querySelector('#minute');
        this.calendarRecordStartDate = document.querySelector('#eventFrom');
        this.calendarRecordEndDate = document.querySelector('#eventTo');

        this.calendarRecordAddOrUpdateButton = document.querySelector('#eventAddOrUpdateButton');
    }

    static get FormType() {
        const formTypeEnum = { "add": 1, "update": 2 };
        Object.freeze(formTypeEnum);
        return formTypeEnum;
    }

    hideForm() {
        this.calendarRecordForm.style.display = 'none';
    }

    showForm() {
        this.calendarRecordForm.style.display = 'block';
    }

    setCalendarFormType(formType) {
        switch (formType) {
            case FormHelper.FormType.add:
                this.calendarRecordAddOrUpdateButton.innerHTML = 'Add';
                break;
            case FormHelper.FormType.update:
                this.calendarRecordAddOrUpdateButton.innerHTML = 'Update';
                break;
            default:
                console.log(`Invalid form type: ${formType}`);;
        }
    }

    setCalendarFormValues(formTitle, eventTitle, hour, minute, guid) {
        this.calendarRecordId.value = guid;
        this.calendarRecordFormTitle.innerHTML = formTitle;
        this.calendarRecordTitle.value = eventTitle;
        this.calendarRecordTitle.placeholder = 'title';

        this.calendarRecordHour.value = CalendarHelper.padInt(hour, 2);
        this.calendarRecordMinute.value = CalendarHelper.padInt(minute, 2);

        const year = DateHelper.getYear();
        const month = CalendarHelper.padInt(DateHelper.getMonth() + 1, 2);
        const day = CalendarHelper.padInt(DateHelper.getDay(), 2);

        this.calendarRecordStartDate.value = `${year}-${month}-${day}`;
        this.calendarRecordEndDate.value = `${year}-${month}-${day}`;
    }

    setCalendarFormPosition() {
        const yOffset = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const formWidth = '298';
        const formHeight = '267.4';
        const style = this.calendarRecordForm.style;

        style.top = `${yOffset + (windowHeight - formHeight) / 2}px`;
        style.left = `${(windowWidth - formWidth) / 2}px`;
    }

    closeCalendarForm(currentMonthRecords, refreshCallback) {
        DataStore.setValue('currentMonthCalendarRecords', currentMonthRecords);
        this.hideForm();
        refreshCallback();
    }
};