class DrawCalendar {
    constructor() {
        this.opacity = 0.3;
        this.colors = null;
        this.calendarArray = null;
        this.daysInMonth = null;
    }

    setCalendarBorder() {
        var calendarContainer = document.getElementById('calendarContainer');
        var totalWidth = calendarContainer.parentNode.offsetWidth;
        var blockWidth = document.getElementsByClassName('block')[0].offsetWidth;
        var blockCount = this.countCalendarColumns();
        var totalBlockWidth = blockCount * blockWidth;
        var gutter = (calendarContainer.parentNode.offsetWidth - totalBlockWidth) / 2;
        //console.log(`setCalendarBorder: ${JSON.stringify({
        //    totalWidth: totalWidth,
        //    columns: blockCount,
        //    columnWidth: blockWidth,
        //    totalBlockWidth: totalBlockWidth,
        //    margin: gutter,
        //})}`);
        calendarContainer.style.marginLeft = `${gutter}px`;
    }

    setColors() {
        var neonColors = ['#FF355E', '#FF6037', '	#FFCC33', '#66FF66', '#50BFE6', '#FF00CC'];
        this.colors = neonColors;
    }

    setMonthAndYearText(month, monthName, year) {
        document.getElementById("date").innerHTML = `${monthName}  ${year}`;
        addJson({
            year: year,
            month: month
        });
    }

    drawCalendarEvents(dayNames) {
        var refNode = document.getElementById('calendarContainer');
        var style = `style='height:${this.calculateBlockHeight()}px;'`;
        var node = '';
        for (var day = 1; day <= this.daysInMonth; day++) {
            if (this.calendarArray[day]) {
                var calendarDayRows = "";
                for (var slot = 0; slot < this.calendarArray[day].length; slot++) {
                    var calendarEvent = this.calendarArray[day][slot];
                    calendarDayRows += this.createCalendarDayRow(calendarEvent);
                }

                var calendarDayTable = `<table>${calendarDayRows}</table>`;
                node = `<div class='block' ${style}><p class='add' id='${day}'>${day} - ${dayNames[day]}</p>${calendarDayTable}</div>`;
            }
            else {
                node = `<div class='block' ${style}><p class='add' id='${day}'>${day} - ${dayNames[day]}</p></div>`;
            }
            refNode.innerHTML += node;
        }
        this.setColors();
    }
    highlightCurrentDay(day) {
        console.log(day);
        document.getElementById(`${day}`).parentElement.classList.add('highlightBlock');
    }

    calculateBlockHeight() {
        var maxRowCount = 0;
        for (var i = 1; i <= this.daysInMonth; i++) {
            var currentRowCount = 0;
            if (this.calendarArray[i]) {
                for (var j = 0; j < this.calendarArray[i].length; j++) {
                    currentRowCount++;
                }
            }
            if (currentRowCount > maxRowCount) maxRowCount = currentRowCount;
        }
        return 80 + (maxRowCount * 10);
    }

    createCalendarDayRow(calendarEvent) {
        return `<tr hidden><td class="calendarEventGuid">${calendarEvent.id}</td></tr>
                <tr><td class="calendarEventTitle">${WebTimeHelper.webTimeToString(calendarEvent.time)}&nbsp<em>${calendarEvent.title}</em>
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
            node.parentNode.style.border = `3px solid ${colors[i % colors.length]}`;
        }
    }

    clearCalendar() { document.getElementById('calendarContainer').innerHTML = ""; }

    createCalendarSubMenu() {
        var refNode = document.getElementsByClassName('subMenu')[0];
        var height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
        var previousMonthHtml = `<a style='height:${height}'  class="navBar subMenuElement" id="nextMonth" onclick="calendarBackwards()"><span class="glyphicon glyphicon-menu-left"></span></a>`;
        var nextMonthHtml = `<a style='height:${height}'  class="navBar subMenuElement" id="previousMonth" onclick="calendarForwards()"><span class="glyphicon glyphicon-menu-right"></span></a>`;
        refNode.innerHTML = `${previousMonthHtml}${nextMonthHtml}`;
    }
}