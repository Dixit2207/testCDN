import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AilDate } from './ail-date';
import { AilDatepickerDayView } from './datepicker-day-view';
import { AilDatepickerI18n, AilDatepickerI18nDefault } from './datepicker-i18n';

function getElement(element: HTMLElement): HTMLElement {
    return <HTMLElement>element.querySelector('[ailDatepickerDayView]');
}

describe('ailDatepickerDayView', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, AilDatepickerDayView],
            providers: [{ provide: AilDatepickerI18n, useClass: AilDatepickerI18nDefault }]
        });
    });

    it('should display date', () => {
        const fixture = TestBed.createComponent(TestComponent);

        fixture.detectChanges();

        const el = getElement(fixture.nativeElement);
        expect(el.innerHTML).toBe('22');

        fixture.componentInstance.date = new AilDate(2016, 7, 25);
        fixture.detectChanges();
        expect(el.innerHTML).toBe('25');
    });
});

@Component({
    selector: 'test-cmp',
    template:
        '<div ailDatepickerDayView [date]="date" [currentMonth]="currentMonth" [selected]="selected" [disabled]="disabled"></div>'
})
class TestComponent {
    currentMonth = 7;
    date: AilDate = new AilDate(2016, 7, 22);
    disabled = false;
    selected = false;
}
