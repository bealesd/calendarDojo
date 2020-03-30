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
        this.calendarDate = document.getElementById("date");
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
        this.setMonthAndYearText(this.dateHelper.currentMonth, this.dateHelper.getMonthName(), this.dateHelper.currentYear);
        this.setCalendarBorder();
    }

    setCalendarBorder() {
        const blockWidth = document.querySelector('.block').offsetWidth;
        const blockCount = this.countCalendarColumns();
        const totalBlockWidth = blockCount * blockWidth;
        const gutter = (this.calendarContainer.parentNode.offsetWidth - totalBlockWidth) / 2;
        this.calendarContainer.style.marginLeft = `${gutter}px`;
    }

    setMonthAndYearText(month, monthName, year) {
        this.calendarDate.innerHTML = `${monthName}  ${year}`;
        DataStore.setValue('year', year);
        DataStore.setValue('month', month);
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
        const style = `style='height:${this.calculateBlockHeight()}px;'`;

        for (let day = 1; day <= this.daysInMonth; day++) {
            const recordContainerNode =
                `<div data-day='${day}' class='block' ${style}>` +
                `<p class='add'>${day} - ${dayNames[day]}</p>` +
                `<table>` +
                `<tbody>` +
                `</tbody>` +
                `</table>` +
                `</div>`;
            this.calendarContainer.innerHTML += recordContainerNode;
        }

        const calendarArray = DataStore.getValue('currentMonthCalendarRecords');
        for (let i = 0; i < calendarArray.length; i++) {
            const calendarRecord = calendarArray[i];
            const calendarRecordHtml = this.createCalendarDayRow(calendarRecord);
            document.querySelector(`[data-day='${calendarRecord["day"]}'] tbody`).innerHTML += calendarRecordHtml;
        }
    }

    highlightCurrentDay(day) {
        document.querySelector(`[data-day='${day}']`).classList.add('highlightBlock');
    }

    calculateBlockHeight() {
        const calendarArray = DataStore.getValue('currentMonthCalendarRecords');

        let recordsByDay = {};
        for (let dayInMonth = 0; dayInMonth < this.daysInMonth; dayInMonth++) {
            recordsByDay[dayInMonth] = 0;
        }
        calendarArray.forEach((record) => { recordsByDay[record.day]++; });

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
        const calendarColumns = this.countCalendarColumns();
        this.setCalendarColors(calendarColumns === 6 ? this.colors.slice(0, 5) : this.colors.slice(0, 6));
    }

    countCalendarColumns() {
        const totalWidth = this.calendarContainer.parentNode.offsetWidth;
        const blockWidth = document.getElementsByClassName('block')[0].offsetWidth;
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