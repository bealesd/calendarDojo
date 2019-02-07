function CalendarSubMenu() {
    function main() {
        return {
            calendarSubMenuHtml: function () {
                var height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
                var previousMonthHtml = `<a style='height:${height}'  class="calendar" id="nextMonth"><span class="glyphicon glyphicon-menu-left"></span></a>`;
                var nextMonthHtml = `<a style='height:${height}'  class="calendar" id="previousMonth"><span class="glyphicon glyphicon-menu-right"></span></a>`;
                return previousMonthHtml + nextMonthHtml;
            },

            placeSubMenu: function (subMenuHtml) {
                document.getElementsByClassName('subMenu')[0].innerHTML = subMenuHtml;
            },

            calendarSubMenuCallback: function () {
                var subMenuHtml = this.calendarSubMenu.calendarSubMenuHtml();
                this.calendarSubMenu.placeSubMenu(subMenuHtml);
                document.getElementById('nextMonth').addEventListener('click', this.calendarSubMenu.calendarForwards.bind(this));
                document.getElementById('previousMonth').addEventListener('click', this.calendarSubMenu.calendarBackwards.bind(this));
            },

            calendarBackwards: function () {
                this.calendarService.dateHelper.updateDate(true);
                this.calendarService.setCalendarEventsForCurrentMonth();
                this.loadCalendarPage();
            },

            calendarForwards: function () {
                this.calendarService.dateHelper.updateDate(false);
                this.calendarService.setCalendarEventsForCurrentMonth();
                this.loadCalendarPage();
            }
        };
    }
    return main();
}