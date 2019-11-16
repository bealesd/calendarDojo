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
            $(block).off();
            CustomEvents.onClick($(block), this.openAddCalendarForm.bind(this), day);
        });
    }

    static onUpdateCalendarEventClick() {
        document.querySelectorAll('.calendar > div > .block .calendarEventTitle').forEach((calendarEventTitle) => {
            const calendarEvent = DataStore.getValue('currentMonthCalendarRecords').filter((row) => { return row.id === calendarEventTitle.id })[0]
            $(calendarEventTitle).off();
            CustomEvents.onClick($(calendarEventTitle), this.openUpdateCalendarForm.bind(this), calendarEvent);
        });
    }

    static onDeleteCalendarEventClick(cb) {
        $('#eventDelete').off();
        CustomEvents.onClick($('#eventDelete'), () => {
            this.deleteCalendarEvent(cb);
        });
    }

    static onCreateOrUpdateCalendarEventClick(cb) {
        $('#eventAddOrUpdateButton').off();
        CustomEvents.onClick($('#eventAddOrUpdateButton'), () => {
            this.createOrUpdateCalendarEvent(cb);
        });
    }

    static onCancelCalendarEventClick() {
        $('#eventClose').off();
        CustomEvents.onClick($('#eventClose'), () => { FormHelper.hideForm(this.calendarFormId()); });
    }

    static onMultipleCalendarDaysEventClick() {
        $('#eventMultipleDays').off();
        CustomEvents.onClick($('#eventMultipleDays'), this.multipleCalendarDaysEventClick.bind(this));
    }

    static multipleCalendarDaysEventClick() {
        $('#dateRange').toggle();
    }

    static deleteCalendarEvent(cb) {
        const id = document.getElementById('eventId').value;
        CalendarRepo.deleteData(id)
            .then(() => {
                return CalendarRepo.getData(DateHelper.getYear(), DateHelper.getMonth());
            })
            .then(() => {
                FormHelper.hideForm(this.calendarFormId());
                cb();
            });
    }

    static createOrUpdateCalendarEvent(cb) {
        const title = document.getElementById("eventTitle").value;
        const time = document.getElementById("eventTime").value;
        const id = document.getElementById("eventId").value;

        const hoursAndMinutesArray = WebTimeHelper.webTimeToArray(time);
        DateHelper.setHour(hoursAndMinutesArray[0]);
        DateHelper.setMinute(hoursAndMinutesArray[1]);

        const year = DateHelper.getYear();
        const month = DateHelper.getMonth();
        const day = DateHelper.getDay();
        const hours = DateHelper.getHour();
        const minutes = DateHelper.getMinute();
        let date = DateHelper.getDate(year, month, day, hours, minutes);

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
                CalendarRepo.postData(title, date.getTime())
                    .then(() => {
                        CalendarRepo.getData(year, month)
                            .then(() => {
                                FormHelper.hideForm(this.calendarFormId());
                                cb();
                            });
                    });
            }
            else {
                CalendarRepo.updateData(title, id, date.getTime())
                    .then(() => {
                        CalendarRepo.getData(year, month)
                            .then(() => {
                                FormHelper.hideForm(this.calendarFormId());
                                cb();
                            });
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

    static openUpdateCalendarForm(calendarEvent) {
        $('#multipleDays').hide();
        $('#dateRange').hide();

        DateHelper.setDay(calendarEvent.day);
        this.setCalendarFormType('Update');
        this.setCalendarFormValues(`Update event on ${calendarEvent.day}`,
            calendarEvent.title,
            WebTimeHelper.webTimeToString(new Date(calendarEvent.date)),
            calendarEvent.id);
        this.setCalendarFormPosition();
        FormHelper.showForm(this.calendarFormId());
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