import { AilCalendarGregorian } from './ail-calendar';
import { AilDate } from './ail-date';

describe('ail-calendar-gregorian', () => {

    const calendar = new AilCalendarGregorian();

    it('should return today\'s date', () => {
        const jsToday = new Date();
        const today = new AilDate(jsToday.getFullYear(), jsToday.getMonth() + 1, jsToday.getDate());

        expect(calendar.getToday()).toEqual(today);
    });

    it('should return number of days per week', () => {
        expect(calendar.getDaysPerWeek()).toBe(7);
    });

    it('should return number of weeks per month', () => {
        expect(calendar.getWeeksPerMonth()).toBe(6);
    });

    it('should return months of a year', () => {
        expect(calendar.getMonths()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    it('should return day of week', () => {
        expect(calendar.getWeekday(new AilDate(2017, 1, 2))).toBe(1);  // Mon, 2 Jan 2017
        expect(calendar.getWeekday(new AilDate(2017, 1, 3))).toBe(2);
        expect(calendar.getWeekday(new AilDate(2017, 1, 4))).toBe(3);
        expect(calendar.getWeekday(new AilDate(2017, 1, 5))).toBe(4);
        expect(calendar.getWeekday(new AilDate(2017, 1, 6))).toBe(5);
        expect(calendar.getWeekday(new AilDate(2017, 1, 7))).toBe(6);
        expect(calendar.getWeekday(new AilDate(2017, 1, 8))).toBe(7);  // Sun, 8 Jan 2017
    });

    it('should add days to date', () => {
        expect(calendar.getNext(new AilDate(2016, 12, 31))).toEqual(new AilDate(2017, 1, 1));
        expect(calendar.getNext(new AilDate(2016, 2, 28))).toEqual(new AilDate(2016, 2, 29));
        expect(calendar.getNext(new AilDate(2017, 2, 28))).toEqual(new AilDate(2017, 3, 1));
    });

    it('should subtract days from date', () => {
        expect(calendar.getPrev(new AilDate(2017, 1, 1))).toEqual(new AilDate(2016, 12, 31));
        expect(calendar.getPrev(new AilDate(2016, 2, 29))).toEqual(new AilDate(2016, 2, 28));
        expect(calendar.getPrev(new AilDate(2017, 3, 1))).toEqual(new AilDate(2017, 2, 28));
    });

    it('should add months to date', () => {
        expect(calendar.getNext(new AilDate(2016, 7, 22), 'm')).toEqual(new AilDate(2016, 8, 22));
        expect(calendar.getNext(new AilDate(2016, 7, 1), 'm')).toEqual(new AilDate(2016, 8, 1));
        expect(calendar.getNext(new AilDate(2016, 12, 22), 'm')).toEqual(new AilDate(2017, 1, 22));
        expect(calendar.getNext(new AilDate(2016, 1, 29), 'm')).toEqual(new AilDate(2016, 2, 29));
        expect(calendar.getNext(new AilDate(2016, 1, 30), 'm')).toEqual(new AilDate(2016, 2, 29));
        expect(calendar.getNext(new AilDate(2016, 10, 30), 'm', 6)).toEqual(new AilDate(2017, 4, 30));
        expect(calendar.getNext(new AilDate(2016, 10, 31), 'm', 6)).toEqual(new AilDate(2017, 4, 30));
    });

    it('should subtract months from date', () => {
        expect(calendar.getPrev(new AilDate(2016, 7, 22), 'm')).toEqual(new AilDate(2016, 6, 22));
        expect(calendar.getPrev(new AilDate(2016, 8, 1), 'm')).toEqual(new AilDate(2016, 7, 1));
        expect(calendar.getPrev(new AilDate(2017, 1, 22), 'm')).toEqual(new AilDate(2016, 12, 22));
        expect(calendar.getPrev(new AilDate(2016, 3, 29), 'm')).toEqual(new AilDate(2016, 2, 29));
        expect(calendar.getPrev(new AilDate(2016, 3, 30), 'm')).toEqual(new AilDate(2016, 2, 29));
        expect(calendar.getPrev(new AilDate(2016, 10, 30), 'm', 4)).toEqual(new AilDate(2016, 6, 30));
        expect(calendar.getPrev(new AilDate(2016, 10, 31), 'm', 4)).toEqual(new AilDate(2016, 6, 30));
    });

    it('should add years to date', () => {
        expect(calendar.getNext(new AilDate(2016, 1, 22), 'y')).toEqual(new AilDate(2017, 1, 22));
        expect(calendar.getNext(new AilDate(2017, 12, 22), 'y')).toEqual(new AilDate(2018, 12, 22));
        expect(calendar.getNext(new AilDate(2016, 2, 29), 'y')).toEqual(new AilDate(2017, 2, 28));
        expect(calendar.getNext(new AilDate(2016, 2, 28), 'y')).toEqual(new AilDate(2017, 2, 28));
        expect(calendar.getNext(new AilDate(2016, 2, 29), 'y', 4)).toEqual(new AilDate(2020, 2, 29));
        expect(calendar.getNext(new AilDate(2016, 2, 29), 'y', 3)).toEqual(new AilDate(2019, 2, 28));
    });

    it('should subtract years from date', () => {
        expect(calendar.getPrev(new AilDate(2016, 12, 22), 'y')).toEqual(new AilDate(2015, 12, 22));
        expect(calendar.getPrev(new AilDate(2017, 1, 22), 'y')).toEqual(new AilDate(2016, 1, 22));
        expect(calendar.getPrev(new AilDate(2016, 2, 28), 'y')).toEqual(new AilDate(2015, 2, 28));
        expect(calendar.getPrev(new AilDate(2016, 2, 29), 'y')).toEqual(new AilDate(2015, 2, 28));
        expect(calendar.getPrev(new AilDate(2016, 2, 29), 'y', 4)).toEqual(new AilDate(2012, 2, 29));
        expect(calendar.getPrev(new AilDate(2016, 2, 29), 'y', 3)).toEqual(new AilDate(2013, 2, 28));
    });

    it('should properly recognize invalid javascript date', () => {
        expect(calendar.isValid(null)).toBeFalsy();
        expect(calendar.isValid(undefined)).toBeFalsy();
        expect(calendar.isValid(<any>NaN)).toBeFalsy();
        expect(calendar.isValid(<any>new Date())).toBeFalsy();
        expect(calendar.isValid(new AilDate(null, null, null))).toBeFalsy();
        expect(calendar.isValid(new AilDate(undefined, undefined, undefined))).toBeFalsy();
        expect(calendar.isValid(new AilDate(NaN, NaN, NaN))).toBeFalsy();
        expect(calendar.isValid(new AilDate(<any>'2017', <any>'03', <any>'10'))).toBeFalsy();
    });

    it('should recognize dates outside of JS range as invalid', () => {
        expect(calendar.isValid(new AilDate(275760, 9, 14))).toBeFalsy();
        expect(calendar.isValid(new AilDate(-271821, 4, 19))).toBeFalsy();
    });

    it('should recognize dates outside of calendar range as invalid', () => {
        expect(calendar.isValid(new AilDate(0, 0, 0))).toBeFalsy();
        expect(calendar.isValid(new AilDate(-1, -1, -1))).toBeFalsy();
        expect(calendar.isValid(new AilDate(2016, 17, 1))).toBeFalsy();
        expect(calendar.isValid(new AilDate(2017, 5, 35))).toBeFalsy();
    });

    it('should mark valid JS dates as valid', () => {
        expect(calendar.isValid(new AilDate(275760, 9, 12))).toBeTruthy();
        expect(calendar.isValid(new AilDate(2016, 8, 8))).toBeTruthy();
    });

    it('should dates with year 0 as invalid', () => {
        expect(calendar.isValid(new AilDate(0, 1, 1))).toBeFalsy();
    });

});
