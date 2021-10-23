import { AilDatepickerConfig } from './datepicker-config';

describe('ail-datepicker-config', () => {
    it('should have sensible default values', () => {
        const config = new AilDatepickerConfig();

        expect(config.dayTemplate).toBeUndefined();
        expect(config.displayMonths).toBe(1);
        expect(config.firstDayOfWeek).toBe(0);
        expect(config.markDisabled).toBeUndefined();
        expect(config.minDate).toBeUndefined();
        expect(config.maxDate).toBeUndefined();
        expect(config.navigation).toBe('select');
        expect(config.outsideDays).toBe('visible');
        expect(config.showWeekdays).toBe(true);
        expect(config.showWeekNumbers).toBe(false);
        expect(config.startDate).toBeUndefined();
    });
});
