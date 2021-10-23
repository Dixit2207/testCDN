import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AilDate } from './ail-date';
import { createGenericTestComponent } from './common.test-util';
import { AilDatepickerDayView } from './datepicker-day-view';
import { AilDatepickerMonthView } from './datepicker-month-view';
import { MonthViewModel } from './datepicker-view-model';

import { AilDatepickerModule } from './datepicker.module';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getWeekdays(element: HTMLElement): HTMLElement[] {
    return <HTMLElement[]>Array.from(element.querySelectorAll('.-dp-weekday'));
}

function getWeekNumbers(element: HTMLElement): HTMLElement[] {
    return <HTMLElement[]>Array.from(element.querySelectorAll('.-dp-week-number'));
}

function getDates(element: HTMLElement): HTMLElement[] {
    return <HTMLElement[]>Array.from(element.querySelectorAll('.-dp-day'));
}

function expectWeekdays(element: HTMLElement, weekdays: string[]) {
    const result = getWeekdays(element).map(td => td.innerText.trim());
    expect(result).toEqual(weekdays);
}

function expectWeekNumbers(element: HTMLElement, weeknumbers: string[]) {
    const result = getWeekNumbers(element).map(td => td.innerText.trim());
    expect(result).toEqual(weeknumbers);
}

function expectDates(element: HTMLElement, dates: string[]) {
    const result = getDates(element).map(td => td.innerText.trim());
    expect(result).toEqual(dates);
}

describe('ail-datepicker-month-view', () => {

    beforeEach(() => {
        TestBed.overrideModule(AilDatepickerModule, { set: { exports: [AilDatepickerMonthView, AilDatepickerDayView] } });
        TestBed.configureTestingModule({ declarations: [TestComponent], imports: [AilDatepickerModule] });
    });

    it('should add correct aria-label attribute', () => {
        const fixture = createTestComponent(`
        <ng-template #tpl let-date="date">{{ date.day }}</ng-template>
        <ail-datepicker-month-view [locale]="'en'" [month]="month" [dayTemplate]="tpl"></ail-datepicker-month-view>
    `);

        const dates = getDates(fixture.nativeElement);
        expect(dates[0].getAttribute('aria-label')).toBe('Monday');
    });
});

@Component({ selector: 'test-cmp', template: '' })
class TestComponent {
    month: MonthViewModel = {
        firstDate: new AilDate(2016, 8, 1),
        lastDate: new AilDate(2016, 8, 31),
        year: 2016,
        number: 8,
        weekdays: [1, 2],
        weeks: [
            // month: 7, 8
            {
                number: 1,
                days: [
                    {
                        date: new AilDate(2016, 7, 4),
                        context: {
                            currentMonth: 8,
                            currentYear: 2016,
                            $implicit: new AilDate(2016, 7, 4),
                            date: new AilDate(2016, 7, 4),
                            disabled: false,
                            focused: false,
                            selected: false,
                            today: false
                        },
                        tabindex: -1,
                        ariaLabel: 'Monday',
                        hidden: true
                    },
                    {
                        date: new AilDate(2016, 8, 1),
                        context: {
                            currentMonth: 8,
                            currentYear: 2016,
                            $implicit: new AilDate(2016, 8, 1),
                            date: new AilDate(2016, 8, 1),
                            disabled: false,
                            focused: false,
                            selected: false,
                            today: false
                        },
                        tabindex: -1,
                        ariaLabel: 'Monday',
                        hidden: false
                    }
                ],
                collapsed: false
            },
            // month: 8, 8
            {
                number: 2,
                days: [
                    {
                        date: new AilDate(2016, 8, 2),
                        context: {
                            currentMonth: 8,
                            currentYear: 2016,
                            $implicit: new AilDate(2016, 8, 2),
                            date: new AilDate(2016, 8, 2),
                            disabled: true,
                            focused: false,
                            selected: false,
                            today: true
                        },
                        tabindex: -1,
                        ariaLabel: 'Friday',
                        hidden: false
                    },
                    {
                        date: new AilDate(2016, 8, 3),
                        context: {
                            currentMonth: 8,
                            currentYear: 2016,
                            $implicit: new AilDate(2016, 8, 3),
                            date: new AilDate(2016, 8, 3),
                            disabled: false,
                            focused: false,
                            selected: false,
                            today: false
                        },
                        tabindex: -1,
                        ariaLabel: 'Saturday',
                        hidden: false
                    }
                ],
                collapsed: false
            },
            // month: 8, 9
            {
                number: 3,
                days: [
                    {
                        date: new AilDate(2016, 8, 4),
                        context: {
                            currentMonth: 8,
                            currentYear: 2016,
                            $implicit: new AilDate(2016, 8, 4),
                            date: new AilDate(2016, 8, 4),
                            disabled: false,
                            focused: false,
                            selected: false,
                            today: false
                        },
                        tabindex: -1,
                        ariaLabel: 'Sunday',
                        hidden: false
                    },
                    {
                        date: new AilDate(2016, 9, 1),
                        context: {
                            currentMonth: 8,
                            currentYear: 2016,
                            $implicit: new AilDate(2016, 9, 1),
                            date: new AilDate(2016, 9, 1),
                            disabled: false,
                            focused: false,
                            selected: false,
                            today: false
                        },
                        tabindex: -1,
                        ariaLabel: 'Saturday',
                        hidden: true
                    }
                ],
                collapsed: false
            },
            // month: 9, 9 -> to collapse
            {
                number: 4,
                days: [
                    {
                        date: new AilDate(2016, 9, 2),
                        context: {
                            currentMonth: 8,
                            currentYear: 2016,
                            $implicit: new AilDate(2016, 9, 2),
                            date: new AilDate(2016, 9, 2),
                            disabled: false,
                            focused: false,
                            selected: false,
                            today: false
                        },
                        tabindex: -1,
                        ariaLabel: 'Sunday',
                        hidden: true
                    },
                    {
                        date: new AilDate(2016, 9, 3),
                        context: {
                            currentMonth: 8,
                            currentYear: 2016,
                            $implicit: new AilDate(2016, 9, 3),
                            date: new AilDate(2016, 9, 3),
                            disabled: false,
                            focused: false,
                            selected: false,
                            today: false
                        },
                        tabindex: -1,
                        ariaLabel: 'Monday',
                        hidden: true
                    }
                ],
                collapsed: true
            }
        ]
    };

    showWeekdays = true;
    showWeekNumbers = true;
    outsideDays = 'visible';

    onClick = () => {
    };
}
