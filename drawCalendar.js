import { DataStore } from './dataStore.js';
import { DateHelper } from './dateHelper.js';
import { CalendarHelper } from './calendarHelper.js';

export class DrawCalendar {
    constructor() {
        this.dateHelper = new DateHelper();

        this.opacity = 0.3;
        this.colors = ['#FF355E', '#FF6037', '#FFCC33', '#66FF66', '#50BFE6', '#FF00CC'];
        this.daysInMonth = null;

        this.calendarContainer = document.querySelector('#calendarContainer');
        this.calendarDate = document.querySelector("#date");
        this.calendarRecordHour = document.querySelector('#hour');
        this.calendarRecordMinute = document.querySelector('#minute');
    }

    drawCalendar() {
        this.clearCalendar();
        this.daysInMonth = this.dateHelper.getDaysInMonth();
        this.drawCalendarEvents(this.dateHelper.getDaysNames());

        if (this.dateHelper.getTodaysDate().month === this.dateHelper.currentMonth)
            this.highlightCurrentDay(this.dateHelper.getTodaysDate().day);

        this.updateCalendarColors();
        this.setMonthAndYearText(this.dateHelper.getMonthName(), this.dateHelper.currentYear);
        this.setCalendarBorder();
    }

    setCalendarBorder() {
        const blockWidth = document.querySelector('.block').offsetWidth;
        const blockCount = this.countCalendarColumns();
        const totalBlockWidth = blockCount * blockWidth;
        const gutter = (this.calendarContainer.parentNode.offsetWidth - totalBlockWidth) / 2;
        this.calendarContainer.style.marginLeft = `${gutter}px`;
    }

    setMonthAndYearText(monthName, year) {
        this.calendarDate.innerHTML = `${monthName}  ${year}`;
    }

    setupCalendarFormTimePicker() {
        const populate = {
            hours: () => {
                for (let hour = 0; hour <= 23; hour++) {
                    let option = document.createElement('option');
                    option.textContent = CalendarHelper.padInt(hour, 2);
                    this.calendarRecordHour.appendChild(option);
                }
            },
            minutes: () => {
                for (let minute = 0; minute <= 59; minute = minute + 15) {
                    let option = document.createElement('option');
                    option.textContent = CalendarHelper.padInt(minute, 2);
                    this.calendarRecordMinute.appendChild(option);
                }
            }
        };
        populate.hours();
        populate.minutes();
    }

    drawCalendarEvents(dayNames) {
        const calendarBlockStyle = `style='height:${this.calculateBlockHeight()}px;'`;

        for (let day = 1; day <= this.daysInMonth; day++) {
            const calendarRecordContainerNode =
                `<div data-day='${day}' class='block' ${calendarBlockStyle}>` +
                `<p class='add'>${day} - ${dayNames[day]}</p>` +
                `<table>` +
                `<tbody>` +
                `</tbody>` +
                `</table>` +
                `</div>`;
            this.calendarContainer.innerHTML += calendarRecordContainerNode;
        }

        const calendarRecords = DataStore.getValue('currentMonthCalendarRecords');
        for (let i = 0; i < calendarRecords.length; i++) {
            const calendarRecord = calendarRecords[i];
            const calendarRecordHtml = this.createCalendarDayRow(calendarRecord);
            document.querySelector(`[data-day='${calendarRecord["day"]}'] tbody`).innerHTML += calendarRecordHtml;
        }
    }

    highlightCurrentDay(day) {
        document.querySelector(`[data-day='${day}']`).classList.add('highlightBlock');
    }

    calculateBlockHeight() {
        const calendarRecords = DataStore.getValue('currentMonthCalendarRecords');

        const recordsByDay = {};
        Array.apply(null, new Array(this.daysInMonth)).forEach((_, i)=>{recordsByDay[i] = 0})

        calendarRecords.forEach((record) => { recordsByDay[record.day]++; });

        const maxDaysCount = Math.max(...Object.values(recordsByDay).filter((num) => { return num >= 0; }))
        return 80 + maxDaysCount * 10;
    }

    createCalendarDayRow(calendarEvent) {
        const hour = CalendarHelper.padInt(calendarEvent['hour'], 2);
        const minute = CalendarHelper.padInt(calendarEvent['minute'], 2);

        return `<tr><td class="calendarEventTitle" data-guid='${calendarEvent["guid"]}'>` +
            `${hour}:${minute}&nbsp<em>${calendarEvent["title"]}</em>` +
            `</td></tr>`;
    }

    updateCalendarColors() {
        this.setCalendarColors(this.countCalendarColumns() === 6 ? this.colors.slice(0, 5) : this.colors.slice(0, 6));
    }

    countCalendarColumns() {
        const totalWidth = this.calendarContainer.parentNode.offsetWidth;
        const blockWidth = document.querySelector('.block').offsetWidth;
        return Math.floor(totalWidth / blockWidth);
    }

    setCalendarColors(colors) {
        for (let dayInMonth = 0; dayInMonth < this.daysInMonth; dayInMonth++) {
            const node = document.querySelector(`[data-day='${dayInMonth + 1}']`)
            node.style.border = `3px solid ${colors[dayInMonth % colors.length]}`;
        }
    }

    clearCalendar() { this.calendarContainer.innerHTML = ""; }
}