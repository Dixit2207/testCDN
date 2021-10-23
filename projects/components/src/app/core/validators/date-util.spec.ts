import { TestBed } from '@angular/core/testing';
import { DateUtil } from '@core/validators/date-util';
import { CONSTANTS } from '@modules/book';

describe('DateUtil', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should parse date', function() {
        expect(DateUtil.parse('12/12/2021', CONSTANTS.DATE_FORMAT)).toBeTruthy();
    });

    it('should fail with partial date', function() {
        expect(DateUtil.parse('12/12', CONSTANTS.DATE_FORMAT)).toBeFalsy();
    });

    it('should parse date with no date', function() {
        expect(DateUtil.parse(null, CONSTANTS.DATE_FORMAT)).toBeFalsy();
    });

    it('should parse date with no format', function() {
        expect(DateUtil.parse('12/12/2021', null)).toBeFalsy();
    });

    it('should test invalid date format', function() {
        expect(DateUtil.parse('12/12/2021', 'mm/dd/yy')).toBeFalsy();
    });
});
