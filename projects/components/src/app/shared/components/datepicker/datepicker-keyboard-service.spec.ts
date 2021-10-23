import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AilCalendar, AilCalendarGregorian } from './ail-calendar';
import { AilDate } from './ail-date';
import { AilDatepicker, AilDatepickerState } from './ail-datepicker.component';
import { AilDatepickerKeyboardService } from './datepicker-keyboard-service';
import { Key } from './util/key';

const event = (keyCode: number, shift = false) =>
    <any>({
        which: keyCode, shiftKey: shift, preventDefault: () => {
        }, stopPropagation: () => {
        }
    });

describe('ail-datepicker-keyboard-service', () => {

    let service: AilDatepickerKeyboardService;
    let calendar: AilCalendar;
    let mock: Partial<AilDatepicker>;
    const processKey = function(e: KeyboardEvent) {
        service.processKey(e, mock as AilDatepicker, calendar);
    };
    const state: AilDatepickerState = Object.assign({ focusedDate: { day: 1, month: 1, year: 2018 } });

    beforeEach(() => {
        TestBed.configureTestingModule(
            { providers: [{ provide: AilCalendar, useClass: AilCalendarGregorian }, AilDatepickerKeyboardService] });

        calendar = TestBed.inject(AilCalendar as Type<AilCalendar>);
        service = TestBed.inject(AilDatepickerKeyboardService);
        mock = {
            state, focusDate: () => {
            }, focusSelect: () => {
            }
        };

        spyOn(mock, 'focusDate');
        spyOn(mock, 'focusSelect');
        spyOn(calendar, 'getNext');
        spyOn(calendar, 'getPrev');
    });

    it('should be instantiated', () => {
        expect(service).toBeTruthy();
    });

    it('should move focus by 1 day or 1 week with "Arrow" keys', () => {
        processKey(event(Key.ArrowUp));
        expect(calendar.getPrev).toHaveBeenCalledWith(state.focusedDate, 'd', 7);

        processKey(event(Key.ArrowDown));
        expect(calendar.getNext).toHaveBeenCalledWith(state.focusedDate, 'd', 7);

        processKey(event(Key.ArrowLeft));
        expect(calendar.getPrev).toHaveBeenCalledWith(state.focusedDate, 'd', 1);

        processKey(event(Key.ArrowRight));
        expect(calendar.getNext).toHaveBeenCalledWith(state.focusedDate, 'd', 1);

        expect(calendar.getPrev).toHaveBeenCalledTimes(2);
        expect(calendar.getNext).toHaveBeenCalledTimes(2);
    });

    it('should move focus by 1 month or year "PgUp" and "PageDown"', () => {
        processKey(event(Key.PageUp));
        expect(calendar.getPrev).toHaveBeenCalledWith(state.focusedDate, 'm', 1);

        processKey(event(Key.PageDown));
        expect(calendar.getNext).toHaveBeenCalledWith(state.focusedDate, 'm', 1);

        processKey(event(Key.PageUp, true));
        expect(calendar.getPrev).toHaveBeenCalledWith(state.focusedDate, 'y', 1);

        processKey(event(Key.PageDown, true));
        expect(calendar.getNext).toHaveBeenCalledWith(state.focusedDate, 'y', 1);

        expect(calendar.getPrev).toHaveBeenCalledTimes(2);
        expect(calendar.getNext).toHaveBeenCalledTimes(2);
    });

    it('should select focused date with "Space" and "Enter"', () => {
        processKey(event(Key.Enter));
        processKey(event(Key.Space));
        expect(mock.focusSelect).toHaveBeenCalledTimes(2);
    });

    it('should move focus to the first and last days in the view with "Home" and "End"', () => {
        processKey(event(Key.Home));
        expect(mock.focusDate).toHaveBeenCalledWith(undefined);

        processKey(event(Key.End));
        expect(mock.focusDate).toHaveBeenCalledWith(undefined);

        Object.assign(state, { firstDate: new AilDate(2017, 1, 1) });
        Object.assign(state, { lastDate: new AilDate(2017, 12, 1) });

        processKey(event(Key.Home));
        expect(mock.focusDate).toHaveBeenCalledWith(new AilDate(2017, 1, 1));

        processKey(event(Key.End));
        expect(mock.focusDate).toHaveBeenCalledWith(new AilDate(2017, 12, 1));

        expect(mock.focusDate).toHaveBeenCalledTimes(4);
    });

    it('should move focus to the "min" and "max" dates with "Home" and "End"', () => {
        processKey(event(Key.Home, true));
        expect(mock.focusDate).toHaveBeenCalledWith(undefined);

        processKey(event(Key.End, true));
        expect(mock.focusDate).toHaveBeenCalledWith(undefined);

        Object.assign(state, { minDate: new AilDate(2017, 1, 1) });
        Object.assign(state, { maxDate: new AilDate(2017, 12, 1) });

        processKey(event(Key.Home, true));
        expect(mock.focusDate).toHaveBeenCalledWith(new AilDate(2017, 1, 1));

        processKey(event(Key.End, true));
        expect(mock.focusDate).toHaveBeenCalledWith(new AilDate(2017, 12, 1));

        expect(mock.focusDate).toHaveBeenCalledTimes(4);
    });

    it('should prevent default and stop propagation of the known key', () => {
        let e = event(Key.ArrowUp);
        spyOn(e, 'preventDefault');
        spyOn(e, 'stopPropagation');

        processKey(e);
        expect(e.preventDefault).toHaveBeenCalled();
        expect(e.stopPropagation).toHaveBeenCalled();

        // unknown key
        e = event(23);
        spyOn(e, 'preventDefault');
        spyOn(e, 'stopPropagation');

        processKey(e);
        expect(e.preventDefault).not.toHaveBeenCalled();
        expect(e.stopPropagation).not.toHaveBeenCalled();
    });

});
