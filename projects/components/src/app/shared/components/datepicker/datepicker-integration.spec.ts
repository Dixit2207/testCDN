import { Component, Injectable, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AilCalendar } from './ail-calendar';
import { AilDate } from './ail-date';
import { AilDatepicker } from './ail-datepicker.component';
import { AilDatepickerI18n, AilDatepickerI18nDefault } from './datepicker-i18n';
import { AilDatepickerKeyboardService } from './datepicker-keyboard-service';
import { AilDatepickerModule, AilDateStruct } from './datepicker.module';
import { Key } from './util/key';

describe('ail-datepicker integration', () => {

    beforeEach(
        () => {
            TestBed.configureTestingModule({ declarations: [TestComponent], imports: [AilDatepickerModule] });
        });

    describe('i18n', () => {

        const ALPHABET = 'ABCDEFGHIJKLMNOPRSTQUVWXYZ';

        @Injectable()
        class CustomI18n extends AilDatepickerI18nDefault {
            // alphabetic days: 1 -> A, 2 -> B, etc
            getDayNumerals(date: AilDateStruct) {
                return ALPHABET[date.day - 1];
            }

            // alphabetic months: Jan -> A, Feb -> B, etc
            getMonthFullName(month: number) {
                return ALPHABET[month - 1];
            }

            // alphabetic months: Jan -> A, Feb -> B, etc
            getMonthShortName(month: number) {
                return ALPHABET[month - 1];
            }

            // alphabetic week numbers: 1 -> A, 2 -> B, etc
            getWeekNumerals(week: number) {
                return ALPHABET[week - 1];
            }

            // reversed years: 1998 -> 9881
            getYearNumerals(year: number) {
                return `${year}`.split('').reverse().join('');
            }
        }

        let fixture: ComponentFixture<TestComponent>;

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
            <ail-datepicker [startDate]="{year: 2018, month: 1}"
                            [minDate]="{year: 2017, month: 1, day: 1}"
                            [maxDate]="{year: 2019, month: 12, day: 31}"
                            [showWeekNumbers]="true"
                            [displayMonths]="2"
                            [locale]="'en'"
            ></ail-datepicker>`,
                    providers: [{ provide: AilDatepickerI18n, useClass: CustomI18n }]
                }
            });

            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
        });
    });

    describe('keyboard service', () => {

        @Injectable()
        class CustomKeyboardService extends AilDatepickerKeyboardService {
            processKey(event: KeyboardEvent, service: AilDatepicker, calendar: AilCalendar) {
                const state = service.state;
                // tslint:disable-next-line:deprecation
                switch (event.which) {
                    case Key.PageUp:
                        service.focusDate(calendar.getPrev(state.focusedDate, event.altKey ? 'y' : 'm', 1));
                        break;
                    case Key.PageDown:
                        service.focusDate(calendar.getNext(state.focusedDate, event.altKey ? 'y' : 'm', 1));
                        break;
                    default:
                        super.processKey(event, service, calendar);
                        return;
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }

        let fixture: ComponentFixture<TestComponent>;
        let dp: AilDatepicker;
        let Calendar: AilCalendar;
        const startDate: AilDateStruct = new AilDate(2018, 1, 1);

        beforeEach(() => {
            TestBed.overrideComponent(TestComponent, {
                set: {
                    template: `
            <ail-datepicker [locale]="'en'" [startDate]="{year: 2018, month: 1}" [displayMonths]="1"></ail-datepicker>`,
                    providers: [{ provide: AilDatepickerKeyboardService, useClass: CustomKeyboardService }]
                }
            });

            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();

            dp = fixture.debugElement.query(By.css('ail-datepicker')).injector.get(AilDatepicker);
            Calendar = fixture.debugElement.query(By.css('ail-datepicker')).injector.get(AilCalendar as Type<AilCalendar>);

            spyOn(Calendar, 'getPrev');
        });

        it('should allow customize keyboard navigation', () => {
            dp.onKeyDown(<any>{
                which: Key.PageUp, altKey: true, preventDefault: () => {
                }, stopPropagation: () => {
                }
            });
            expect(Calendar.getPrev).toHaveBeenCalledWith(startDate, 'y', 1);
            dp.onKeyDown(<any>{
                which: Key.PageUp, shiftKey: true, preventDefault: () => {
                }, stopPropagation: () => {
                }
            });
            expect(Calendar.getPrev).toHaveBeenCalledWith(startDate, 'm', 1);
        });

        it('should allow access to default keyboard navigation', () => {
            dp.onKeyDown(<any>{
                which: Key.ArrowUp, altKey: true, preventDefault: () => {
                }, stopPropagation: () => {
                }
            });
            expect(Calendar.getPrev).toHaveBeenCalledWith(startDate, 'd', 7);
        });
    });
});

@Component({ selector: 'test-cmp', template: '' })
class TestComponent {
}
