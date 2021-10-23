import { AilInputDatepickerConfig } from './datepicker-input-config';

describe('AilInputDatepickerConfig', () => {
    it('should have sensible default values', () => {
        const config = new AilInputDatepickerConfig();

        expect(config.autoClose).toBe(true);
        expect(config.container).toBeUndefined();
        expect(config.positionTarget).toBeUndefined();
        expect(config.placement).toEqual(['bottom-left', 'bottom-right', 'top-left', 'top-right']);
        expect(config.restoreFocus).toBe(true);
    });
});
