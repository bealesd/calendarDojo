class CalendarController {
    constructor(registerSubMenuCallbacks, registerTabCallbacks) {
        this.calendarService = new CalendarService();
        this.calendarService.calendarRepo = new CalendarRepo();
        this.calendarService.drawCalendarService = new DrawCalendar();
        this.calendarService.dateHelper = new DateHelper();
        this.calendarService.calendarTimer = new CalendarTimer();
        this.registerTabCallbacks = registerTabCallbacks;
        this.registerSubMenuCallbacks = registerSubMenuCallbacks;
        this.calendarEventsRegistered = false;
        this.calendarFormId = 'addOrEditCalendarEvents';
    }

    registerCalendarCallbacks() {
        this.registerTabCallbacks(this.calendarPageCallback.bind(this), 'calendar');
        this.registerSubMenuCallbacks(this.calendarSubMenuCallback.bind(this), 'calendar');
    }

    //#region calendar page
    calendarPageCallback() {
        if (DataStore.getJson().allCalendarRecords === undefined) {
            this.calendarService.get().then(() => {
                this.loadCalendarPage();
            });
        }
        else {
            this.loadCalendarPage();
        }
    }

    loadCalendarPage() {
        this.calendarService.drawCalendar();
        this.registerCalendarEventListeners();
    }
    //#endregion

    //#region calendar events 
    registerCalendarEventListeners() {
        this.onAddCalendarClick();
        this.onUpdateCalendarEventClick();
        this.onDeleteCalendarEventClick();
        this.onCancelCalendarEventClick();
        this.onCreateOrUpdateCalendarEventClick();
        this.onMultipleCalendarDaysEventClick();
    }

    onAddCalendarClick() {
        document.querySelectorAll('.calendar > div > .block > .add').forEach(function (block) {
            var day = block.parentNode.id;
            $(block).off();
            CustomEvents.onClick($(block), this.openAddCalendarForm.bind(this), day);
        }.bind(this));
    }

    onUpdateCalendarEventClick() {
        document.querySelectorAll('.calendar > div > .block .calendarEventTitle').forEach(function (calendarEventTitle) {
            var calendarEvent = DataStore.getCurrentMonthCalendarRecords()[calendarEventTitle.id];
            $(calendarEventTitle).off();
            CustomEvents.onClick($(calendarEventTitle), this.openUpdateCalendarForm.bind(this), calendarEvent);

        }.bind(this));
    }

    onDeleteCalendarEventClick() {
        $('#eventDelete').off();
        CustomEvents.onClick($('#eventDelete'), this.deleteCalendarEvent.bind(this));

    }

    onCancelCalendarEventClick() {
        $('#eventClose').off();
        CustomEvents.onClick($('#eventClose'), this.hideForm.bind(this));
    }

    onCreateOrUpdateCalendarEventClick() {
        $('#eventAddOrUpdateButton').off();
        CustomEvents.onClick($('#eventAddOrUpdateButton'), this.createOrUpdateCalendarEvent.bind(this));
    }

    onMultipleCalendarDaysEventClick() {
        $('#eventMultipleDays').off();
        this.i = 0;
        CustomEvents.onClick($('#eventMultipleDays'), this.multipleCalendarDaysEventClick.bind(this));
    }

    multipleCalendarDaysEventClick() {
        console.log(`multipleCalendarDaysEventClick ${this.i++}`);
        $('#dateRange').toggle();
    }

    deleteCalendarEvent() {
        var id = document.getElementById('eventId').value;
        this.calendarService.delete(id).then(() => {
            this.calendarService.get().then(() => {
                this.hideForm();
                this.loadCalendarPage();
            });
        });
    }

    createOrUpdateCalendarEvent() {//work in here
        var title = document.getElementById("eventTitle").value;
        var time = document.getElementById("eventTime").value;
        var who = document.getElementById("eventWho").value;
        var where = document.getElementById("eventWhere").value;
        var id = document.getElementById("eventId").value;
        
        if (title.trim().length === 0 || who.trim().length === 0 || where.trim().length === 0) {
            alert('form incomplete');
            return false;
        }
        var isValidDateRange = Date.parse(document.getElementById(`eventFrom`).value) < Date.parse(document.getElementById(`eventTo`).value)

        if (this.isMultipleDaysSelected() && !isValidDateRange){
            alert('invalid date');
            return false;
        }

        if (this.isMultipleDaysSelected()) {
            var dateRange = this.getDateRange();
            var month = dateRange.from.month;
            var year = dateRange.from.year;
            var dayRange = dateRange.to.day - dateRange.from.day;

            for (var i = 0; i <= dayRange; i++) {
                var day = dateRange.from.day + i;
                this.calendarService.postWithDate(title, time, who, where, id, day, month, year).then(function () {
                    if (day === dateRange.to.day) {
                        this.calendarService.get().then(() => {
                            this.hideForm();
                            this.loadCalendarPage();
                        });
                    }
                }.bind(this));
            }
        }

        else {
            this.calendarService.post(title, time, who, where, id).then(() => {
                this.calendarService.get().then(() => {
                    this.hideForm();
                    this.loadCalendarPage();
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

    isMultipleDaysSelected() {
        return $('#eventMultipleDays')[0].checked;
    }

    openUpdateCalendarForm(calendarEvent) {
        $('#multipleDays').hide();
        $('#dateRange').hide();

        DataStore.addJson({ day: calendarEvent.day });
        this.setCalendarFormType('Update');
        this.setCalendarFormValues(`Update event on ${calendarEvent.day}`, calendarEvent.title, calendarEvent.time, calendarEvent.where, calendarEvent.who, calendarEvent.id);
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

    //#region submenu  
    calendarSubMenuHtml() {
        var height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
        var previousMonthHtml = `<a style='height:${height}'  class="calendar" id="nextMonth"><span class="glyphicon glyphicon-menu-left"></span></a>`;
        var nextMonthHtml = `<a style='height:${height}'  class="calendar" id="previousMonth"><span class="glyphicon glyphicon-menu-right"></span></a>`;
        return previousMonthHtml + nextMonthHtml;
    }

    placeSubMenu(subMenuHtml) {
        document.getElementsByClassName('subMenu')[0].innerHTML = subMenuHtml;
    }

    calendarSubMenuCallback() {
        var subMenuHtml = this.calendarSubMenuHtml();
        this.placeSubMenu(subMenuHtml);
        document.getElementById('nextMonth').addEventListener('click', this.calendarForwards.bind(this));
        document.getElementById('previousMonth').addEventListener('click', this.calendarBackwards.bind(this));
    }

    calendarBackwards() {
        this.calendarService.dateHelper.updateDate(true);
        this.calendarService.setCalendarEventsForCurrentMonth();
        this.loadCalendarPage();
    }

    calendarForwards() {
        this.calendarService.dateHelper.updateDate(false);
        this.calendarService.setCalendarEventsForCurrentMonth();
        this.loadCalendarPage();
    }
    //#endregion
}