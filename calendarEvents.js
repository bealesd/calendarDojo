class CalendarEvents {
    constructor() {
        this.calendarFormId = 'addOrEditCalendarEvents';
    }

    //#region calendar events 
    onAddCalendarClick() {
        document.querySelectorAll('.calendar > div > .block > .add').forEach((block) => {
            var day = block.parentNode.id;
            $(block).off();
            CustomEvents.onClick($(block), this.openAddCalendarForm.bind(this), day);
        });
    }

    onUpdateCalendarEventClick() {
        document.querySelectorAll('.calendar > div > .block .calendarEventTitle').forEach( (calendarEventTitle) => {
            var calendarEvent = DataStore.getCurrentMonthCalendarRecords()[calendarEventTitle.id];
            $(calendarEventTitle).off();
            CustomEvents.onClick($(calendarEventTitle), this.openUpdateCalendarForm.bind(this), calendarEvent);

        });
    }

    onDeleteCalendarEventClick(self) {//erroring here, cant get loadpage
        $('#eventDelete').off();
        CustomEvents.onClick($('#eventDelete'), () => {
            this.deleteCalendarEvent(self);
        });
    }

    onCreateOrUpdateCalendarEventClick(self) {
        $('#eventAddOrUpdateButton').off();
        CustomEvents.onClick($('#eventAddOrUpdateButton'), ()=> {
            this.createOrUpdateCalendarEvent(self);
        });
    }

    onCancelCalendarEventClick() {
        $('#eventClose').off();
        CustomEvents.onClick($('#eventClose'), this.hideForm.bind(this));
    }

    onMultipleCalendarDaysEventClick() {
        $('#eventMultipleDays').off();
        CustomEvents.onClick($('#eventMultipleDays'), this.multipleCalendarDaysEventClick.bind(this));
    }

    multipleCalendarDaysEventClick() {
        $('#dateRange').toggle();
    }

    deleteCalendarEvent(self) {
        this.calendarController = self;
        var id = document.getElementById('eventId').value;
        this.calendarController.calendarService.delete(id).then(() => {
            this.calendarController.calendarService.get().then(() => {
                this.hideForm();
                this.calendarController.loadCalendarPage();
            });
        });
    }

    createOrUpdateCalendarEvent(self) {
        this.calendarController = self;
        var title = document.getElementById("eventTitle").value;
        var time = document.getElementById("eventTime").value;
        var who = document.getElementById("eventWho").value;
        var where = document.getElementById("eventWhere").value;
        var id = document.getElementById("eventId").value;

        if (title.trim().length === 0 || who.trim().length === 0 || where.trim().length === 0) {
            alert('form incomplete');
            return false;
        }
        var isValidDateRange = Date.parse(document.getElementById(`eventFrom`).value) < Date.parse(document.getElementById(`eventTo`).value);

        if (this.isMultipleDaysSelected() && !isValidDateRange) {
            alert('invalid date');
            return false;
        }

        if (this.isMultipleDaysSelected()) {
            var dates = this.getDates(new Date(document.getElementById(`eventFrom`).value), new Date(document.getElementById(`eventTo`).value));
            var index = 0;
            for (var i = 0; i < dates.length; i++) {
                index = i;
                var day = dates[i].getDate();
                var month = dates[i].getMonth() + 1;
                var year = dates[i].getFullYear();
                this.calendarController.calendarService.postWithDate(title, time, who, where, id, day, month, year).then(() => {
                    if (index === (dates.length - 1)) {
                        this.calendarController.calendarService.get().then(() => {
                            this.hideForm();
                            this.calendarController.loadCalendarPage();
                        });
                    }
                });
            }
        }
        else {
            this.calendarController.calendarService.post(title, time, who, where, id).then(()=> {
                this.calendarController.calendarService.get().then(()=> {
                    this.hideForm();
                    this.calendarController.loadCalendarPage();
                });
            });
        }
        return false;
    }

    getDateRange() {
        var from = document.getElementById(`eventFrom`).value;
        var dayFrom = parseInt(from.split('-')[2]);
        var monthFrom = parseInt(from.split('-')[1]);
        var yearFrom = parseInt(from.split('-')[0]);

        var to = document.getElementById(`eventTo`).value;
        var dayTo = parseInt(to.split('-')[2]);
        var monthTo = parseInt(to.split('-')[1]);
        var yearTo = parseInt(to.split('-')[0]);

        return {
            from: {
                day: dayFrom,
                month: monthFrom,
                year: yearFrom
            },
            to: {
                day: dayTo,
                month: monthTo,
                year: yearTo
            }
        };
    }

    getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(new Date(currentDate));
            currentDate = this.addDays(currentDate);
        }
        return dateArray;
    }

    addDays(date) {
        date.setDate(date.getDate() + 1);
        return date;
    }

    isMultipleDaysSelected() {
        return $('#eventMultipleDays')[0].checked;
    }

    openUpdateCalendarForm(calendarEvent) {
        $('#multipleDays').hide();
        $('#dateRange').hide();

        DataStore.addJson({ day: calendarEvent.day });
        this.setCalendarFormType('Update');
        this.setCalendarFormValues(`Update event on ${calendarEvent.day}`,
            calendarEvent.title,
            calendarEvent.time,
            calendarEvent.where,
            calendarEvent.who,
            calendarEvent.id);
        this.setCalendarFormPosition();
        this.showForm();
    }

    openAddCalendarForm(day) {
        $('#eventMultipleDays')[0].checked = false;
        $('#multipleDays').show();
        $('#dateRange').hide();

        document.getElementById('date').value = DataStore.addJson({ day: day });
        this.setCalendarFormType('Add');
        this.setCalendarFormValues(`Add event for day ${day}`, '', '10:00', '', '', '');
        this.setCalendarFormPosition();
        this.showForm();
    }

    setCalendarFormType(formType) {
        if (formType.toLowerCase() === 'update') {
            document.getElementById('eventAddOrUpdateButton').innerHTML = 'Update';
        }
        else if (formType.toLowerCase() === 'add') {
            document.getElementById('eventAddOrUpdateButton').innerHTML = 'Add';
        }
        else {
            console.log(`Invalid form type: ${formType}`);
        }
    }

    setCalendarFormValues(formTitle, eventTitle, time, where, who, id) {
        document.getElementById('eventId').value = id;
        document.getElementById('formTitle').innerHTML = formTitle;
        this.updateInputNode('eventTitle', eventTitle, 'title');
        this.updateInputNode('eventTime', time, '');
        this.updateInputNode('eventWhere', where, 'where');
        this.updateInputNode('eventWho', who, 'who');
    }

    setCalendarFormPosition() {
        var yOffset = window.pageYOffset;
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        var formWidth = '298';
        var formHeight = '267.4';
        var style = document.getElementById(this.calendarFormId).style;

        style.top = `${yOffset + (windowHeight - formHeight) / 2}px`;
        style.left = `${(windowWidth - formWidth) / 2}px`;
    }

    updateInputNode(id, value, placeholder) {
        var inputNode = document.getElementById(id);
        inputNode.value = value;
        inputNode.placeholder = placeholder;
    }

    hideForm() {
        document.getElementById(this.calendarFormId).style.display = 'none';
    }

    showForm() {
        document.getElementById(this.calendarFormId).style.display = 'block';
    }
    //#endregion

}