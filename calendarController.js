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
    }

    registerCalendarCallbacks() {
        console.log('registerCalendarCallbacks was called again');
        this.registerTabCallbacks(this.calendarPageCallback.bind(this), 'calendar');
        this.registerSubMenuCallbacks(this.calendarSubMenuCallback.bind(this), 'calendar');
    }

    //#region calendar page
    calendarPageCallback() {
        this.calendarService.get().then((result) => {
            this.loadCalendarPage();
        });
    }

    loadCalendarPage() {
        this.calendarService.drawCalendar();
        this.setCalendarEventsFormPosition();
        this.registerCalendarEventListeners();
    }
    //#endregion

    //#region calendar events 
    setCalendarEventsFormPosition() {
        var eventForm = document.getElementById('addOrEditCalendarEvents');
        eventForm.style.left = (window.innerWidth - parseInt(eventForm.style.width, 10)) / 2 + 'px';
        eventForm.style.top = (window.innerHeight - parseInt(eventForm.style.height, 10)) / 2 + 'px';
    }

    registerCalendarEventListeners() {
        this.onAddCalendarClick();
        this.onUpdateCalendarEventClick();
        this.onDeleteCalendarEventClick();
        this.onCancelCalendarEventClick();
        this.onCreateOrUpdateCalendarEventClick();
    }

    onAddCalendarClick() {
        document.querySelectorAll('.calendar > div > .block > .add').forEach(function (block) {
            var day = block.parentNode.id;

            $(block).off();

            //$(block).on('click', function () {
            //    console.log(`clicked ${day}`);
            //    this.openAddCalendarForm(day);
            //}.bind(this));

            //CustomEvents.unregisterOnClick(block, this.openAddCalendarForm.bind(this), day);
            //CustomEvents.onClick(block, this.openAddCalendarForm.bind(this), day);
            CustomEvents.onClick($(block), this.openAddCalendarForm.bind(this), day);
        }.bind(this));
    }

    onUpdateCalendarEventClick() {
        document.querySelectorAll('.calendar > div > .block .calendarEventTitle').forEach(function (calendarEventTitle) {
            var calendarEvent = DataStore.getCurrentMonthCalendarRecords()[calendarEventTitle.id];
            //CustomEvents.onClick(calendarEventTitle, this.openUpdateCalendarForm.bind(this), calendarEvent);

            $(calendarEventTitle).off();
            //$(calendarEventTitle).on('click', function () {
            //    this.openUpdateCalendarForm(calendarEvent);
            //}.bind(this));

            CustomEvents.onClick($(calendarEventTitle), this.openUpdateCalendarForm.bind(this), calendarEvent);

        }.bind(this));
    }

    onDeleteCalendarEventClick() {
        //var calendarEventDelete = document.getElementById('eventDelete');
        //CustomEvents.onClick(calendarEventDelete, this.deleteCalendarEvent.bind(this));

        $('#eventDelete').off();
        //$('#eventDelete').on('click', function () {
        //    this.deleteCalendarEvent();
        //}.bind(this));

        CustomEvents.onClick($('#eventDelete'), this.deleteCalendarEvent.bind(this));

    }

    deleteCalendarEvent() {
        var id = document.getElementById('eventId').value;

        this.calendarService.delete(id).then(() => {
            this.calendarService.get().then((result) => {
            }).then(() => {
                this.hideDialog();
                this.loadCalendarPage();
            });
        });
    }

    onCancelCalendarEventClick() {
        //var calendarEventClose = document.getElementById('eventClose');

        $('#eventClose').off();
        //$('#eventClose').on('click', function () {
        //    this.hideDialog();
        //}.bind(this));

        CustomEvents.onClick($('#eventClose'), this.hideDialog.bind(this));
    }

    onCreateOrUpdateCalendarEventClick() {
        $('#eventAddOrUpdateButton').off();
        //$('#eventAddOrUpdateButton').on('click', function () {
        //    this.createOrUpdateCalendarEvent();
        //}.bind(this));

        //called multile times
        //var calendarEventCreateOrUpdate = document.getElementById('eventAddOrUpdateButton');
        CustomEvents.onClick($('#eventAddOrUpdateButton'), this.createOrUpdateCalendarEvent.bind(this));
    }

    createOrUpdateCalendarEvent() {
        var title = document.getElementById("eventTitle").value;
        var time = document.getElementById("eventTime").value;
        var who = document.getElementById("eventWho").value;
        var where = document.getElementById("eventWhere").value;
        var id = document.getElementById("eventId").value;
        if (title.length < 2 || who.length < 2 || where.length < 2) {
            alert('all values must be more than 2 characters');
        }
        else {
            this.calendarService.post(title, time, who, where, id).then(() => {
                this.calendarService.get().then(() => {
                    this.hideDialog();
                    this.loadCalendarPage();
                });
            });
        }
        return false;
    }

    openUpdateCalendarForm(calendarEvent) {
        DataStore.addJson({ day: calendarEvent.day });

        document.getElementById('eventId').value = calendarEvent.id;
        document.getElementById('eventAddOrUpdateButton').innerHTML = 'Update';
        document.getElementById('formTitle').innerHTML = `Add event on ${calendarEvent.day}`;

        this.updateInputNode('eventTitle', calendarEvent.title, 'title');
        this.updateInputNode('eventTime', calendarEvent.time, '');
        this.updateInputNode('eventWhere', calendarEvent.time, '');
        this.updateInputNode('eventWhere', calendarEvent.where, 'where');
        this.updateInputNode('eventWho', calendarEvent.who, 'who');

        document.getElementById('addOrEditCalendarEvents').style.display = "block";
    }

    openAddCalendarForm(day) {
        document.getElementById('date').value = DataStore.addJson({ day: day });

        document.getElementById('eventAddOrUpdateButton').innerHTML = 'Add';
        document.getElementById('formTitle').innerHTML = `Add event for day ${day}`;

        this.updateInputNode('eventTitle', '', 'title');
        this.updateInputNode('eventTime', '10:00', 'time');
        this.updateInputNode('eventWhere', '', 'where');
        this.updateInputNode('eventWho', '', 'who');
        this.updateInputNode('eventId', '', '');

        document.getElementById('addOrEditCalendarEvents').style.display = "block";
    }

    updateInputNode(id, value, placeholder) {
        var inputNode = document.getElementById(id);
        inputNode.value = value;
        inputNode.placeholder = placeholder;
    }

    hideDialog() {
        document.getElementById("addOrEditCalendarEvents").style.display = 'none';
    }
    //#endregion

    //#region submenu  
    calendarSubMenuHtml() {
        var height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
        var previousMonthHtml = `<a style='height:${height}'  class="navBar subMenuElement" id="nextMonth"><span class="glyphicon glyphicon-menu-left"></span></a>`;
        var nextMonthHtml = `<a style='height:${height}'  class="navBar subMenuElement" id="previousMonth"><span class="glyphicon glyphicon-menu-right"></span></a>`;
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