import { DataStore } from './dataStore.js';
import { WebTimeHelper } from './webTimeHelper.js';

export class DrawCalendar {
    constructor() {
        this.opacity = 0.3;
        this.colors = null;
        this.daysInMonth = null;
    }

    setCalendarBorder() {
        const calendarContainer = document.getElementById('calendarContainer');
        const blockWidth = document.getElementsByClassName('block')[0].offsetWidth;
        const blockCount = this.countCalendarColumns();
        const totalBlockWidth = blockCount * blockWidth;
        const gutter = (calendarContainer.parentNode.offsetWidth - totalBlockWidth) / 2;
        calendarContainer.style.marginLeft = `${gutter}px`;
    }

    setColors() { this.colors = ['#FF355E', '#FF6037', '#FFCC33', '#66FF66', '#50BFE6', '#FF00CC']; }

    setMonthAndYearText(month, monthName, year) {
        document.getElementById("date").innerHTML = `${monthName}  ${year}`;
        DataStore.setValue('year', year);
        DataStore.setValue('month', month);
    }

    drawCalendarEvents(dayNames) {
        const refNode = document.getElementById('calendarContainer');
        const style = `style='height:${this.calculateBlockHeight()}px;'`;
        let node = '';

        for (let day = 1; day <= this.daysInMonth; day++) {
            node = `<div id='${day}' class='block' ${style}><p class='add'>${day} - ${dayNames[day]}</p><table><tbody></tbody></table></div>`;
            refNode.innerHTML += node;
        }

        let calendarArray = DataStore.getValue('currentMonthCalendarRecords');
        const keys = Object.keys(calendarArray);
        for (let i = 0; i < keys.length; i++) {
            const calendarEvent = calendarArray[keys[i]];
            const dayRow = this.createCalendarDayRow(calendarEvent);
            document.querySelector(`[id='${calendarEvent.day}'] tbody`).innerHTML += dayRow;
        }

        this.setColors();
    }

    highlightCurrentDay(day) {
        document.getElementById(`${day}`).classList.add('highlightBlock');
    }

    calculateBlockHeight() {
        let calendarArray = DataStore.getValue('currentMonthCalendarRecords');
        let maxDaysCount = 0;
        let daysCount = {};
        for (let i = 0; i < this.daysInMonth; i++) {
            daysCount[i] = 0;
        }
        const calendarKeys = Object.keys(calendarArray);
        for (let j = 0; j < calendarKeys.length; j++) {
            daysCount[calendarArray[calendarKeys[j]].day]++;
        }
        for (let k = 0; k < Object.keys(daysCount).length; k++) {
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
        const calendarContainer = document.getElementById('calendarContainer');
        const totalWidth = calendarContainer.parentNode.offsetWidth;
        const blockWidth = document.getElementsByClassName('block')[0].offsetWidth;
        return Math.floor(totalWidth / blockWidth);
    }

    setCalendarColors(daysInMonth, colors) {
        for (let i = 0; i < daysInMonth; i++) {
            const node = document.getElementById(`${i + 1}`);
            node.style.border = `3px solid ${colors[i % colors.length]}`;
        }
    }

    clearCalendar() { document.getElementById('calendarContainer').innerHTML = ""; }//TODO: register id with generic clearer

    createCalendarSubMenu() {//TODO: move to generic sub menu creator
        const refNode = document.getElementsByClassName('subMenu')[0];
        const height = window.getComputedStyle(document.querySelectorAll('.navbar > a')[0]).height;
        const previousMonthHtml = `<a style='height:${height}'  class="navBar subMenuElement" id="nextMonth" onclick="calendarBackwards()"><span class="glyphicon glyphicon-menu-left"></span></a>`;
        const nextMonthHtml = `<a style='height:${height}'  class="navBar subMenuElement" id="previousMonth" onclick="calendarForwards()"><span class="glyphicon glyphicon-menu-right"></span></a>`;
        refNode.innerHTML = `${previousMonthHtml}${nextMonthHtml}`;
    }
}