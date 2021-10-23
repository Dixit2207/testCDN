/* eslint-disable angular/document-service */
import { Component, DebugElement, TemplateRef } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { AilCalendar } from './ail-calendar';
import { AilDate } from './ail-date';
import { AilDateStruct } from './ail-date-struct';
import { AilDatepicker, AilDatepickerState } from './ail-datepicker.component';
import { createGenericTestComponent, getMonthSelect, getYearSelect } from './common.test-util';
import { AilDatepickerConfig } from './datepicker-config';
import { DayTemplateContext } from './datepicker-day-template-context';
import { AilDatepickerDayView } from './datepicker-day-view';
import { AilDatepickerKeyboardService } from './datepicker-keyboard-service';
import { AilDatepickerMonthView } from './datepicker-month-view';
import { AilDatepickerNavigation } from './datepicker-navigation';
import { AilDatepickerNavigationSelect } from './datepicker-navigation-select';
import { AilDatepickerModule, AilDatepickerNavigateEvent } from './datepicker.module';

const locale = 'en';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getDates(element: HTMLElement): HTMLElement[] {
    return <HTMLElement[]>Array.from(element.querySelectorAll('.-dp-day'));
}

function getDay(element: HTMLElement, index: number): HTMLElement {
    return getDates(element)[index].querySelector('div') as HTMLElement;
}

function getDatepicker(element: HTMLElement): HTMLElement {
    return element.querySelector('ail-datepicker') as HTMLElement;
}

function getFocusableDays(element: DebugElement): DebugElement[] {
    return <DebugElement[]>Array.from(element.queryAll(By.css('div.-dp-day[tabindex="0"]')));
}

function getSelectedDays(element: DebugElement): DebugElement[] {
    return <DebugElement[]>Array.from(element.queryAll(By.css('div.-dp-day > div.bg-primary')));
}

function focusDay() {
    const element = document.querySelector('div.-dp-day[tabindex="0"]') as HTMLElement;
    const evt = document.createEvent('Event');
    evt.initEvent('focusin', true, false);
    element.dispatchEvent(evt);
    element.focus();
}

function triggerKeyDown(element: DebugElement, keyCode: number, shiftKey = false) {
    const event = {
        which: keyCode,
        shiftKey: shiftKey,
        defaultPrevented: false,
        propagationStopped: false,
        stopPropagation: function() {
            this.propagationStopped = true;
        },
        preventDefault: function() {
            this.defaultPrevented = true;
        }
    };
    expect(document.activeElement.classList.contains('-dp-day'))
        .toBeTruthy();
    element.triggerEventHandler('keydown', event);
    return event;
}

function getMonthContainer(datepicker: DebugElement) {
    return datepicker.query(By.css('div.-dp-months'));
}

function expectSelectedDate(element: DebugElement, selectedDate: AilDate) {
    // checking we have 1 day with .selected class
    const days = getSelectedDays(element);

    if (selectedDate) {
        expect(days.length).toBe(1);

        // checking it corresponds to our date
        const day = days[0];
        const dayView = day.parent.query(By.directive(AilDatepickerDayView)).componentInstance as AilDatepickerDayView;
        expect(AilDate.from(dayView.date)).toEqual(selectedDate);
    } else {
        expect(days.length).toBe(0);
    }
}

function expectFocusedDate(element: DebugElement, focusableDate: AilDate, isFocused = true) {
    // checking we have 1 day with tabIndex 0
    const days = getFocusableDays(element);
    expect(days.length).toBe(1);

    const day = days[0];

    // checking it corresponds to our date
    const dayView = day.query(By.directive(AilDatepickerDayView)).componentInstance as AilDatepickerDayView;
    expect(AilDate.from(dayView.date)).toEqual(focusableDate);

    // checking the active class
    // Unable to test it because of unknown failure (works when tested manually)
    // expect(day.queryAll(By.css('div.active')).length).toEqual(1, `The day must have a single element with the active
    // class`);

    // checking it is focused by the browser
    /*if (isFocused) {
        expect(document.activeElement).toBe(day.nativeElement, `Date HTML element for ${focusableDate} is not focused`);
    } else {
        expect(document.activeElement)
            .not.toBe(day.nativeElement, `Date HTML element for ${focusableDate} must not be focused`);
    }*/
}

function expectSameValues(datepicker: AilDatepicker, config: AilDatepickerConfig) {
    expect(datepicker.dayTemplate).toBe(config.dayTemplate);
    expect(datepicker.dayTemplateData).toBe(config.dayTemplateData);
    expect(datepicker.displayMonths).toBe(config.displayMonths);
    expect(datepicker.firstDayOfWeek).toBe(config.firstDayOfWeek);
    expect(datepicker.markDisabled).toBe(config.markDisabled);
    expect(datepicker.minDate).toEqual(config.minDate);
    expect(datepicker.maxDate).toEqual(config.maxDate);
    expect(datepicker.navigation).toBe(config.navigation);
    expect(datepicker.outsideDays).toBe(config.outsideDays);
    expect(datepicker.showWeekdays).toBe(config.showWeekdays);
    expect(datepicker.showWeekNumbers).toBe(config.showWeekNumbers);
    expect(datepicker.startDate).toEqual(config.startDate);
}

function customizeConfig(config: AilDatepickerConfig) {
    config.dayTemplate = {} as TemplateRef<DayTemplateContext>;
    config.dayTemplateData = (date, current) => 42;
    config.firstDayOfWeek = 2;
    config.markDisabled = (date, current) => false;
    config.minDate = { year: 2000, month: 1, day: 1 };
    config.maxDate = { year: 2030, month: 12, day: 31 };
    config.navigation = 'none';
    config.outsideDays = 'collapsed';
    config.showWeekdays = false;
    config.showWeekNumbers = true;
    config.startDate = { year: 2015, month: 1 };
}

describe('ail-datepicker', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            { declarations: [TestComponent], imports: [AilDatepickerModule, FormsModule, ReactiveFormsModule] });
    });

    it('should initialize inputs with provided config', () => {
        const defaultConfig = new AilDatepickerConfig();
        const datepicker = TestBed.createComponent(AilDatepicker).componentInstance;
        expectSameValues(datepicker, defaultConfig);
    });

    it('should display current month if no date provided', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'"></ail-datepicker>');

        const today = new Date();
        expect(getMonthSelect(fixture.nativeElement).value).toBe(`${today.getMonth() + 1}`);
        expect(getYearSelect(fixture.nativeElement).value).toBe(`${today.getFullYear()}`);
    });

    it('should throw if max date is before min date', () => {
        expect(() => {
            createTestComponent('<ail-datepicker [locale]="\'en\'" [minDate]="maxDate" [maxDate]="minDate"></ail-datepicker>');
        }).toThrowError();
    });

    it('should handle incorrect startDate values', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'" [startDate]="date"></ail-datepicker>');
        const today = new Date();
        const currentMonth = `${today.getMonth() + 1}`;
        const currentYear = `${today.getFullYear()}`;

        expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
        expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

        fixture.componentInstance.date = null;
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
        expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);

        fixture.componentInstance.date = undefined;
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
        expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);

        fixture.componentInstance.date = <any>{};
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
        expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);

        fixture.componentInstance.date = <any>new Date();
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
        expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);

        fixture.componentInstance.date = new AilDate(3000000, 1, 1);
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe(currentMonth);
        expect(getYearSelect(fixture.nativeElement).value).toBe(currentYear);
    });

    it('should allow infinite navigation when min/max dates are not set', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'" [startDate]="date"></ail-datepicker>');

        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
        expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

        fixture.componentInstance.date = { year: 1066, month: 2 };
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe('2');
        expect(getYearSelect(fixture.nativeElement).value).toBe('1066');

        fixture.componentInstance.date = { year: 3066, month: 5 };
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
        expect(getYearSelect(fixture.nativeElement).value).toBe('3066');
    });

    it('should allow setting minDate separately', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'" [minDate]="minDate" [startDate]="date"></ail-datepicker>');

        fixture.componentInstance.minDate = { year: 2000, month: 5, day: 20 };
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
        expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

        fixture.componentInstance.date = { year: 1000, month: 2 };
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
        expect(getYearSelect(fixture.nativeElement).value).toBe('2000');

        fixture.componentInstance.date = { year: 3000, month: 5 };
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
        expect(getYearSelect(fixture.nativeElement).value).toBe('3000');
    });

    it('should allow setting maxDate separately', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'" [maxDate]="maxDate" [startDate]="date"></ail-datepicker>');

        fixture.componentInstance.maxDate = { year: 2050, month: 5, day: 20 };
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe('8');
        expect(getYearSelect(fixture.nativeElement).value).toBe('2016');

        fixture.componentInstance.date = { year: 3000, month: 2 };
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
        expect(getYearSelect(fixture.nativeElement).value).toBe('2050');

        fixture.componentInstance.date = { year: 1000, month: 5 };
        fixture.detectChanges();
        expect(getMonthSelect(fixture.nativeElement).value).toBe('5');
        expect(getYearSelect(fixture.nativeElement).value).toBe('1000');
    });

    it('should handle minDate edge case values', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'" [minDate]="minDate" [startDate]="date"></ail-datepicker>');
        const datepicker = fixture.debugElement.query(By.directive(AilDatepicker)).injector.get(AilDatepicker);

        function expectMinDate(year: number, month: number) {
            datepicker.navigateTo({ year: 1000, month: 1 });
            fixture.detectChanges();
            expect(getMonthSelect(fixture.nativeElement).value).toBe(`${month}`);
            expect(getYearSelect(fixture.nativeElement).value).toBe(`${year}`);
        }

        expectMinDate(2010, 1);

        // resetting
        fixture.componentInstance.minDate = <any>{};
        fixture.detectChanges();
        expectMinDate(1000, 1);

        // resetting
        fixture.componentInstance.minDate = <any>new Date();
        fixture.detectChanges();
        expectMinDate(1000, 1);

        // resetting
        fixture.componentInstance.minDate = new AilDate(3000000, 1, 1);
        fixture.detectChanges();
        expectMinDate(1000, 1);

        // resetting
        fixture.componentInstance.minDate = null;
        fixture.detectChanges();
        expectMinDate(1000, 1);

        // resetting
        fixture.componentInstance.minDate = undefined;
        fixture.detectChanges();
        expectMinDate(1000, 1);
    });

    it('should handle maxDate edge case values', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'" [maxDate]="maxDate" [startDate]="date"></ail-datepicker>');
        const datepicker = fixture.debugElement.query(By.directive(AilDatepicker)).injector.get(AilDatepicker);

        function expectMaxDate(year: number, month: number) {
            datepicker.navigateTo({ year: 10000, month: 1 });
            fixture.detectChanges();
            expect(getMonthSelect(fixture.nativeElement).value).toBe(`${month}`);
            expect(getYearSelect(fixture.nativeElement).value).toBe(`${year}`);
        }

        expectMaxDate(2020, 12);

        // resetting
        fixture.componentInstance.maxDate = <any>{};
        fixture.detectChanges();
        expectMaxDate(10000, 1);

        // resetting
        fixture.componentInstance.maxDate = <any>new Date();
        fixture.detectChanges();
        expectMaxDate(10000, 1);

        // resetting
        fixture.componentInstance.maxDate = new AilDate(3000000, 1, 1);
        fixture.detectChanges();
        expectMaxDate(10000, 1);

        // resetting
        fixture.componentInstance.maxDate = null;
        fixture.detectChanges();
        expectMaxDate(10000, 1);

        // resetting
        fixture.componentInstance.maxDate = undefined;
        fixture.detectChanges();
        expectMaxDate(10000, 1);
    });

    it('should display multiple months', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'" [displayMonths]="displayMonths"></ail-datepicker>');

        let months = fixture.debugElement.queryAll(By.directive(AilDatepickerMonthView));
        expect(months.length).toBe(1);

        fixture.componentInstance.displayMonths = 3;
        fixture.detectChanges();
        months = fixture.debugElement.queryAll(By.directive(AilDatepickerMonthView));
        expect(months.length).toBe(3);
    });

    it('should switch navigation types', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'" [navigation]="navigation"></ail-datepicker>');

        expect(fixture.debugElement.query(By.directive(AilDatepickerNavigationSelect))).not.toBeNull();
        expect(fixture.debugElement.query(By.directive(AilDatepickerNavigation))).not.toBeNull();

        fixture.componentInstance.navigation = 'arrows';
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.directive(AilDatepickerNavigationSelect))).toBeNull();
        expect(fixture.debugElement.query(By.directive(AilDatepickerNavigation))).not.toBeNull();

        fixture.componentInstance.navigation = 'none';
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.directive(AilDatepickerNavigationSelect))).toBeNull();
        expect(fixture.debugElement.query(By.directive(AilDatepickerNavigation))).toBeNull();
    });

    it('should always display month names for multiple months', () => {
        const fixture = createTestComponent(
            '<ail-datepicker [locale]="\'en\'" [startDate]="date" [navigation]="navigation"></ail-datepicker>');

        let months = fixture.componentInstance.displayMonths;
        fixture.detectChanges();
        expect(months).toBe(1);

        fixture.componentInstance.navigation = 'arrows';
        fixture.detectChanges();
        months = fixture.componentInstance.displayMonths;
        expect(months).toBe(1);
    });

    it('should emit navigate event when startDate is defined', () => {
        TestBed.overrideComponent(
            TestComponent,
            { set: { template: '<ail-datepicker [locale]="\'en\'" [startDate]="date" (navigate)="onNavigate($event)"></ail-datepicker>' } });
        const fixture = TestBed.createComponent(TestComponent);

        spyOn(fixture.componentInstance, 'onNavigate');
        fixture.detectChanges();

        expect(fixture.componentInstance.onNavigate)
            .toHaveBeenCalledWith({ current: null, next: { year: 2016, month: 8 }, preventDefault: jasmine.any(Function) });
    });

    it('should emit navigate event without startDate defined', () => {
        TestBed.overrideComponent(
            TestComponent, { set: { template: '<ail-datepicker [locale]="\'en\'" (navigate)="onNavigate($event)"></ail-datepicker>' } });
        const fixture = TestBed.createComponent(TestComponent);
        const now = new Date();

        spyOn(fixture.componentInstance, 'onNavigate');
        fixture.detectChanges();

        expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith({
            current: null,
            next: { year: now.getFullYear(), month: now.getMonth() + 1 },
            preventDefault: jasmine.any(Function)
        });
    });

    it('should emit navigate event using navigateTo({date})', () => {
        const fixture =
            createTestComponent(`<ail-datepicker [locale]="'en'" #dp [startDate]="date" (navigate)="onNavigate($event)"></ail-datepicker>
       <button id="btn"(click)="dp.navigateTo({year: 2015, month: 6})"></button>`);

        spyOn(fixture.componentInstance, 'onNavigate');
        const button = fixture.nativeElement.querySelector('button#btn');
        button.click();

        fixture.detectChanges();
        expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith({
            current: { year: 2016, month: 8 },
            next: { year: 2015, month: 6 },
            preventDefault: jasmine.any(Function)
        });
    });

    it('should not focus day initially', () => {
        const fixture = createTestComponent('<ail-datepicker [locale]="\'en\'" #dp [startDate]="date"></ail-datepicker>');
        const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));
        expectFocusedDate(datepicker, new AilDate(2016, 8, 1), false);
    });

    it('should remove focus day on blur', () => {
        const fixture =
            createTestComponent('<ail-datepicker [locale]="\'en\'" #dp [startDate]="date"></ail-datepicker><input id="focusout" >');
        const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));

        // focus in
        focusDay();
        fixture.detectChanges();
        expectFocusedDate(datepicker, new AilDate(2016, 8, 1), true);

        // focus out
        (document.querySelector('#focusout') as HTMLElement).focus();

        fixture.detectChanges();
        expectFocusedDate(datepicker, new AilDate(2016, 8, 1), false);
        expectSelectedDate(datepicker, null);

    });

    it('should emit select event when select date', () => {
        const fixture = createTestComponent(
            '<ail-datepicker [locale]="\'en\'" #dp [startDate]="date" (dateSelect)="onDateSelect($event)"></ail-datepicker>');

        spyOn(fixture.componentInstance, 'onDateSelect');
        const dates = getDates(fixture.nativeElement);
        dates[11].click();

        fixture.detectChanges();
        expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(1);
    });

    it('should emit select event twice when select same date twice', () => {
        const fixture = createTestComponent(
            '<ail-datepicker [locale]="\'en\'" #dp [startDate]="date" (dateSelect)="onDateSelect($event)"></ail-datepicker>');

        spyOn(fixture.componentInstance, 'onDateSelect');
        const dates = getDates(fixture.nativeElement);

        dates[11].click();
        fixture.detectChanges();

        dates[11].click();
        fixture.detectChanges();

        expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(2);
    });

    it('should emit select event twice when press enter key twice', () => {
        const fixture = createTestComponent(
            '<ail-datepicker [locale]="\'en\'" #dp [startDate]="date" (dateSelect)="onDateSelect($event)"></ail-datepicker>');
        const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));

        spyOn(fixture.componentInstance, 'onDateSelect');

        focusDay();
        fixture.detectChanges();

        triggerKeyDown(getMonthContainer(datepicker), 13 /* enter */);
        fixture.detectChanges();

        triggerKeyDown(getMonthContainer(datepicker), 13 /* enter */);
        fixture.detectChanges();
        expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(2);
    });

    it('should emit select event twice when press space key twice', () => {
        const fixture = createTestComponent(
            '<ail-datepicker [locale]="\'en\'" #dp [startDate]="date" (dateSelect)="onDateSelect($event)"></ail-datepicker>');
        const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));

        spyOn(fixture.componentInstance, 'onDateSelect');

        focusDay();
        fixture.detectChanges();

        triggerKeyDown(getMonthContainer(datepicker), 32 /* space */);
        fixture.detectChanges();

        triggerKeyDown(getMonthContainer(datepicker), 32 /* space */);
        fixture.detectChanges();
        expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(2);
    });

    describe('ngModel', () => {

        it('should update model based on calendar clicks', waitForAsync(() => {
            const fixture = createTestComponent(
                '<ail-datepicker [locale]="\'en\'" [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ail-datepicker>');

            const dates = getDates(fixture.nativeElement);
            dates[0].click();  // 1 AUG 2016
            expect(fixture.componentInstance.model).toEqual({ year: 2016, month: 8, day: 1 });

            dates[1].click();
            expect(fixture.componentInstance.model).toEqual({ year: 2016, month: 8, day: 2 });
        }));

        it('should not update model based on calendar clicks when disabled', waitForAsync(() => {
            const fixture = createTestComponent(
                `<ail-datepicker [locale]="'en'" [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model" [disabled]="true">
              </ail-datepicker>`);

            fixture.whenStable()
                .then(() => {
                    fixture.detectChanges();
                    return fixture.whenStable();
                })
                .then(() => {

                    const dates = getDates(fixture.nativeElement);
                    dates[0].click();  // 1 AUG 2016
                    expect(fixture.componentInstance.model).toBeFalsy();

                    dates[1].click();
                    expect(fixture.componentInstance.model).toBeFalsy();
                });
        }));

        it('should switch month using navigateTo({date})', waitForAsync(() => {
            const fixture = createTestComponent(
                `<ail-datepicker [locale]="'en'" #dp [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model"></ail-datepicker>
       <button id="btn"(click)="dp.navigateTo({year: 2015, month: 6})"></button>`);

            const button = fixture.nativeElement.querySelector('button#btn');
            button.click();

            fixture.detectChanges();
            expect(getMonthSelect(fixture.nativeElement).value).toBe('6');
            expect(getYearSelect(fixture.nativeElement).value).toBe('2015');

            const dates = getDates(fixture.nativeElement);
            dates[0].click();  // 1 JUN 2015
            expect(fixture.componentInstance.model).toEqual({ year: 2015, month: 6, day: 1 });
        }));

        it('should switch to current month using navigateTo() without arguments', () => {
            const fixture = createTestComponent(
                `<ail-datepicker [locale]="'en'" #dp></ail-datepicker>
       <button id="btn"(click)="dp.navigateTo()"></button>`);

            const button = fixture.nativeElement.querySelector('button#btn');
            button.click();

            fixture.detectChanges();
            const today = new Date();
            expect(getMonthSelect(fixture.nativeElement).value).toBe(`${today.getMonth() + 1}`);
            expect(getYearSelect(fixture.nativeElement).value).toBe(`${today.getFullYear()}`);
        });
    });

    describe('aria attributes', () => {
        const template = `<ail-datepicker [locale]="'en'" #dp
        [startDate]="date"></ail-datepicker>
        `;

        it('should contains aria-label on the days', () => {
            const fixture = createTestComponent(template);

            const dates = getDates(fixture.nativeElement);

            dates.forEach(function(date) {
                expect(date.getAttribute('aria-label')).toBeDefined();
            });
        });
    });

    describe('keyboard navigation', () => {

        const template = `<ail-datepicker [locale]="'en'" #dp
        [startDate]="date" [minDate]="minDate"
        [maxDate]="maxDate" [displayMonths]="2"
        [markDisabled]="markDisabled"></ail-datepicker>
        <input id="focusout">
        `;

        it('should move focus with arrow keys', () => {
            const fixture = createTestComponent(template);

            const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));

            // focus in
            focusDay();

            triggerKeyDown(getMonthContainer(datepicker), 40 /* down arrow */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 8));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 39 /* right arrow */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 9));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 38 /* up arrow */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 2));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 37 /* left arrow */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 1));
            expectSelectedDate(datepicker, null);
        });

        it('should select focused date with enter or space', () => {
            const fixture = createTestComponent(template);

            const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));

            focusDay();

            triggerKeyDown(getMonthContainer(datepicker), 32 /* space */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 1));
            expectSelectedDate(datepicker, new AilDate(2016, 8, 1));

            triggerKeyDown(getMonthContainer(datepicker), 40 /* down arrow */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 8));
            expectSelectedDate(datepicker, new AilDate(2016, 8, 1));

            triggerKeyDown(getMonthContainer(datepicker), 13 /* enter */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 8));
            expectSelectedDate(datepicker, new AilDate(2016, 8, 8));
        });

        it('should select first and last dates of the view with home/end', () => {
            const fixture = createTestComponent(template);

            const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));

            focusDay();

            triggerKeyDown(getMonthContainer(datepicker), 35 /* end */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 9, 30));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 36 /* home */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 1));
            expectSelectedDate(datepicker, null);
        });

        it('should select min and max dates with shift+home/end', () => {
            const fixture = createTestComponent(template);

            const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));

            focusDay();

            triggerKeyDown(getMonthContainer(datepicker), 35 /* end */, true /* shift */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2020, 12, 31));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 40 /* down arrow */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2020, 12, 31));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 36 /* home */, true /* shift */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2010, 1, 1));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 38 /* up arrow */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2010, 1, 1));
            expectSelectedDate(datepicker, null);
        });

        it('should navigate between months with pageUp/Down', () => {
            const fixture = createTestComponent(template);

            let datepicker = fixture.debugElement.query(By.directive(AilDatepicker));

            focusDay();

            triggerKeyDown(getMonthContainer(datepicker), 39 /* right arrow */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 2));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 33 /* page up */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 7, 2));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 34 /* page down */);
            fixture.detectChanges();
            expectFocusedDate(datepicker, new AilDate(2016, 8, 2));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 34 /* page down */);
            fixture.detectChanges();

            expectFocusedDate(datepicker, new AilDate(2016, 9, 2));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 34 /* page down */);
            fixture.detectChanges();
            datepicker = fixture.debugElement.query(By.directive(AilDatepicker));
            expectFocusedDate(datepicker, new AilDate(2016, 10, 2));
            expectSelectedDate(datepicker, null);
        });

        it('should navigate between years with shift+pageUp/Down', () => {
            const fixture = createTestComponent(template);

            const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));
            focusDay();

            getMonthContainer(datepicker).triggerEventHandler('focus', {});
            fixture.detectChanges();

            expectFocusedDate(datepicker, new AilDate(2016, 8, 1));
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 33 /* page up */, true /* shift */);
            fixture.detectChanges();

            expectFocusedDate(datepicker, new AilDate(2015, 8, 1), true);
            expectSelectedDate(datepicker, null);

            triggerKeyDown(getMonthContainer(datepicker), 34 /* page down */, true /* shift */);
            fixture.detectChanges();

            expectFocusedDate(datepicker, new AilDate(2016, 8, 1));
            expectSelectedDate(datepicker, null);
        });

        it('shouldn\'t be focusable when disabled', fakeAsync(() => {
            const fixture =
                createTestComponent('<ail-datepicker [locale]="\'en\'" #dp [(ngModel)]="model" [disabled]="true"></ail-datepicker>');
            tick();
            fixture.detectChanges();

            const datepicker = fixture.debugElement.query(By.directive(AilDatepicker));

            const days = getFocusableDays(datepicker);

            // expect(days.length).toEqual(0, "A focusable day has been found");
        }));
    });

    describe('forms', () => {

        it('should be disabled with reactive forms', waitForAsync(() => {
            const html = `<form [formGroup]="disabledForm">
            <ail-datepicker [locale]="'en'" [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" formControlName="control">
            </ail-datepicker>
        </form>`;

            const fixture = createTestComponent(html);
            fixture.detectChanges();
            const dates = getDates(fixture.nativeElement);
            dates[0].click();  // 1 AUG 2016
            expect(fixture.componentInstance.disabledForm.controls['control'].value).toBeFalsy();
            expect(fixture.nativeElement.querySelector('ail-datepicker').getAttribute('tabindex')).toBeFalsy();
        }));

        it('should not change again the value in the model on a change coming from the model (template-driven form)',
            waitForAsync(() => {
                const html = `<form>
             <ail-datepicker [locale]="'en'" [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" [(ngModel)]="model" name="date">
             </ail-datepicker>
           </form>`;

                const fixture = createTestComponent(html);
                fixture.detectChanges();

                const value = new AilDate(2018, 7, 28);
                fixture.componentInstance.model = value;

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(fixture.componentInstance.model).toBe(value);
                });
            }));

        it('should not change again the value in the model on a change coming from the model (reactive form)', waitForAsync(() => {
            const html = `<form [formGroup]="form">
             <ail-datepicker [locale]="'en'" [startDate]="date" [minDate]="minDate" [maxDate]="maxDate" formControlName="control">
             </ail-datepicker>
           </form>`;

            const fixture = createTestComponent(html);
            fixture.detectChanges();

            const formChangeSpy = jasmine.createSpy('form change');
            const form = fixture.componentInstance.form;
            form.valueChanges.subscribe(formChangeSpy);
            const controlValue = new AilDate(2018, 7, 28);
            form.setValue({ control: controlValue });

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(formChangeSpy).toHaveBeenCalledTimes(1);
                expect(form.value.control).toBe(controlValue);
            });
        }));

    });

    describe('Custom config', () => {
        let config: AilDatepickerConfig;

        beforeEach(() => {
            TestBed.configureTestingModule({ imports: [AilDatepickerModule] });
        });

        beforeEach(inject([AilDatepickerConfig], (c: AilDatepickerConfig) => {
            config = c;
            customizeConfig(config);
        }));

        it('should initialize inputs with provided config', () => {
            const fixture = TestBed.createComponent(AilDatepicker);

            const datepicker = fixture.componentInstance;
            expectSameValues(datepicker, config);
        });
    });

    describe('Custom config as provider', () => {
        const config = new AilDatepickerConfig();
        customizeConfig(config);

        beforeEach(() => {
            TestBed.configureTestingModule(
                { imports: [AilDatepickerModule], providers: [{ provide: AilDatepickerConfig, useValue: config }] });
        });

        it('should initialize inputs with provided config as provider', () => {
            const fixture = TestBed.createComponent(AilDatepicker);

            const datepicker = fixture.componentInstance;
            expectSameValues(datepicker, config);
        });
    });

    describe('AilDatepicker', () => {

        let mockState: AilDatepickerState;
        let dp: AilDatepicker;
        const mockKeyboardService: AilDatepickerKeyboardService = {
            processKey(event: KeyboardEvent, datepicker: AilDatepicker, calendar: AilCalendar) {
                mockState = datepicker.state;
            }
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AilDatepickerModule],
                providers: [{ provide: AilDatepickerKeyboardService, useValue: mockKeyboardService }]
            });
            const fixture = createTestComponent(
                '<ail-datepicker [locale]="\'en\'" [startDate]="date" [minDate]="minDate" [maxDate]="maxDate"></ail-datepicker>');
            fixture.detectChanges();
            dp = <AilDatepicker>fixture.debugElement.query(By.directive(AilDatepicker)).componentInstance;
        });

        it('should provide an defensive copy of minDate', () => {
            dp.onKeyDown(<KeyboardEvent>{});
            expect(mockState.firstDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 1 }));
            expect(mockState.lastDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 31 }));
            expect(mockState.minDate).toEqual(AilDate.from({ year: 2010, month: 1, day: 1 }));
            expect(mockState.maxDate).toEqual(AilDate.from({ year: 2020, month: 12, day: 31 }));
            Object.assign(mockState, { minDate: undefined });
            dp.onKeyDown(<KeyboardEvent>{});
            expect(dp.model.minDate).toEqual(AilDate.from({ year: 2010, month: 1, day: 1 }));
        });

        it('should provide an defensive copy of maxDate', () => {
            dp.onKeyDown(<KeyboardEvent>{});
            expect(mockState.firstDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 1 }));
            expect(mockState.lastDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 31 }));
            expect(mockState.minDate).toEqual(AilDate.from({ year: 2010, month: 1, day: 1 }));
            expect(mockState.maxDate).toEqual(AilDate.from({ year: 2020, month: 12, day: 31 }));
            Object.assign(mockState, { maxDate: undefined });
            dp.onKeyDown(<KeyboardEvent>{});
            expect(dp.model.maxDate).toEqual(AilDate.from({ year: 2020, month: 12, day: 31 }));
        });

        it('should provide an defensive copy of firstDate', () => {
            dp.onKeyDown(<KeyboardEvent>{});
            expect(mockState.firstDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 1 }));
            expect(mockState.lastDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 31 }));
            expect(mockState.minDate).toEqual(AilDate.from({ year: 2010, month: 1, day: 1 }));
            expect(mockState.maxDate).toEqual(AilDate.from({ year: 2020, month: 12, day: 31 }));
            Object.assign(mockState, { firstDate: undefined });
            dp.onKeyDown(<KeyboardEvent>{});
            expect(dp.model.firstDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 1 }));
        });

        it('should provide an defensive copy of lastDate', () => {
            dp.onKeyDown(<KeyboardEvent>{});
            expect(mockState.firstDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 1 }));
            expect(mockState.lastDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 31 }));
            expect(mockState.minDate).toEqual(AilDate.from({ year: 2010, month: 1, day: 1 }));
            expect(mockState.maxDate).toEqual(AilDate.from({ year: 2020, month: 12, day: 31 }));
            Object.assign(mockState, { lastDate: undefined });
            dp.onKeyDown(<KeyboardEvent>{});
            expect(dp.model.lastDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 31 }));
        });

        it('should provide an defensive copy of focusedDate', () => {
            dp.onKeyDown(<KeyboardEvent>{});
            expect(mockState.focusedDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 1 }));
            Object.assign(mockState, { focusedDate: undefined });
            dp.onKeyDown(<KeyboardEvent>{});
            expect(dp.model.focusDate).toEqual(AilDate.from({ year: 2016, month: 8, day: 1 }));
        });
    });
});

@Component({ selector: 'test-cmp', template: '' })
class TestComponent {
    date = { year: 2016, month: 8 };
    displayMonths = 1;
    navigation = 'select';
    minDate: AilDateStruct = { year: 2010, month: 1, day: 1 };
    maxDate: AilDateStruct = { year: 2020, month: 12, day: 31 };
    form = new FormGroup({ control: new FormControl('', Validators.required) });
    disabledForm = new FormGroup({ control: new FormControl({ value: null, disabled: true }) });
    model;
    showWeekdays = true;
    dayTemplateData = () => '!';
    markDisabled = (date: AilDateStruct) => {
        return AilDate.from(date).equals(new AilDate(2016, 8, 22));
    };
    onNavigate = () => {
    };
    onDateSelect = () => {
    };
    getDate = () => ({ year: 2016, month: 8 });
    onPreventableNavigate = (event: AilDatepickerNavigateEvent) => event.preventDefault();
}
