class DrawCalendar {
    constructor() {
        this.opacity = 0.3;
        this.colors = null;
        this.daysInMonth = null;
    }

    setCalendarBorder() {
        var calendarContainer = document.getElementById('calendarContainer');
        var blockWidth = document.getElementsByClassName('block')[0].offsetWidth;
        var blockCount = this.countCalendarColumns();
        var totalBlockWidth = blockCount * blockWidth;
        var gutter = (calendarContainer.parentNode.offsetWidth - totalBlockWidth) / 2;
        calendarContainer.style.marginLeft = `${gutter}px`;
    }

    setColors() { this.colors = ['#FF355E', '#FF6037', '#FFCC33', '#66FF66', '#50BFE6', '#FF00CC']; }

    setMonthAndYearText(month, monthName, year) {
        document.getElementById("date").innerHTML = `${monthName}  ${year}`;
        DataStore.addJson({
            year: year,
            month: month
        });
    }

    drawCalendarEvents(dayNames) {
        var refNode = document.getElementById('calendarContainer');
        var style = `style='height:${this.calculateBlockHeight()}px;'`;
        var node = '';

        for (var day = 1; day <= this.daysInMonth; day++) {
            node = `<div id='${day}' class='block' ${style}><p class='add'>${day} - ${dayNames[day]}</p><table><tbody></tbody></table></div>`;
            refNode.innerHTML += node;
        }

        var calendarArray = DataStore.getCurrentMonthCalendarRecords();
        var keys = Object.keys(calendarArray);
        for (var i = 0; i < keys.length; i++) {
            var calendarEvent = calendarArray[keys[i]];
            var dayRow = this.createCalendarDayRow(calendarEvent);
            document.querySelector(`[id='${calendarEvent.day}'] tbody`).innerHTML += dayRow;
        }

        this.setColors();
    }

    highlightCurrentDay(day) {
        document.getElementById(`${day}`).classList.add('highlightBlock');
    }

    calculateBlockHeight() {
        var calendarArray = DataStore.getCurrentMonthCalendarRecords();
        var maxDaysCount = 0;
        var daysCount = {};
        for (var i = 0; i < this.daysInMonth; i++) {
            daysCount[i] = 0;
        }
        var calendarKeys = Object.keys(calendarArray);
        for (var j = 0; j < calendarKeys.length; j++) {
            daysCount[calendarArray[calendarKeys[j]].day]++;
        }
        for (var k = 0; k < Object.keys(daysCount).length; k++) {
            if (daysCount[k] > maxDaysCount)
                maxDaysCount = daysCount[k];
        }
        return 80 + maxDaysCount * 10;
    }

    createCalendarDayRow(calendarEvent) {
        return `<tr><td class="calendarEventTitle" id='${calendarEvent.id}'>
                ${WebTimeHelper.webTimeToString(calendarEvent.time)}&nbsp<em>${calendarEvent.title}</em>
                </td></tr>`;
    }

    updateCalendarColors() {
        let calendarColumns = this.countCalendarColumns();
        if (calendarColumns === 6) this.setCalendarColors(this.daysInMonth, this.colors.slice(0, 5));
        else this.setCalendarColors(this.daysInMonth, this.colors.slice(0, 6));
    }

    countCalendarColumns() {
        var calendarContainer = document.getElementById('calendarContainer');
        var totalWidth = calendarContainer.parentNode.offsetWidth;
        var blockWidth = document.getElementsByClassName('block')[0].offsetWidth;
        return Math.floor(totalWidth / blockWidth);
    }

    setCalendarColors(daysInMonth, colors) {
        for (var i = 0; i < daysInMonth; i++) {
            var node = document.getElementById(`${i + 1}`);
            node.style.border = `3px solid ${colors[i % colors.length]}`;
        }
    }

    clearCalendar() { document.getElementById('calendarContainer').innerHTML = ""; }//TODO: register id with generic clearer

    createCalendarSubMenu() {//TODO: move to generic sub menu creator
        var refNode = document.getElementsByClassName('subMenu')[0];
        var height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
        var previousMonthHtml = `<a style='height:${height}'  class="navBar subMenuElement" id="nextMonth" onclick="calendarBackwards()"><span class="glyphicon glyphicon-menu-left"></span></a>`;
        var nextMonthHtml = `<a style='height:${height}'  class="navBar subMenuElement" id="previousMonth" onclick="calendarForwards()"><span class="glyphicon glyphicon-menu-right"></span></a>`;
        refNode.innerHTML = `${previousMonthHtml}${nextMonthHtml}`;
    }
}