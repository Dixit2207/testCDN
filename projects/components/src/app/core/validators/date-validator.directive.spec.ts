import { FormControl, FormGroup } from '@angular/forms';
import { dateRangeValidator, maxDateValidator, minDateValidator, returnTripValidator } from '@core/validators/date-validator.directive';
import moment, { Moment } from 'moment';

describe('DateValidator Tests', () => {

    const defaultDateFormat: string = 'mm/dd/yyyy';
    const momentDateFormat: string = 'M/D/YYYY';

    const currentMoment: Moment = moment();
    const maxMoment: Moment = moment().add(12, 'M');

    const currentDate: string = currentMoment.format(momentDateFormat);
    const futureDate: string = moment().add(3, 'M').format(momentDateFormat);
    const pastDate: string = moment().subtract(1, 'M').format(momentDateFormat);
    const afterMaxDate: string = moment().add(20, 'M').format(momentDateFormat);

    // ValidateDateRange tests
    it('Test invalid date range. date1 is greater than date2', () => {
        const dateForm = new FormGroup({
            'date1': new FormControl(futureDate),
            'date2': new FormControl(currentDate)
        }, dateRangeValidator(defaultDateFormat, 'date1', 'date2'));

        expect(dateForm.valid).toEqual(false);
    });

    it('Test valid date range. date1 is null', () => {
        const dateForm = new FormGroup({
            'date1': new FormControl(null),
            'date2': new FormControl(futureDate)
        }, dateRangeValidator(defaultDateFormat, 'date1', 'date2'));

        expect(dateForm.valid).toEqual(true);
    });

    it('Test date range. date2 is null', () => {
        const dateForm = new FormGroup({
            'date1': new FormControl(currentDate),
            'date2': new FormControl(null)
        }, dateRangeValidator(defaultDateFormat, 'date1', 'date2'));

        expect(dateForm.valid).toEqual(true);
    });

    it('Test valid date range. date2 is greater than date1', () => {
        const dateForm = new FormGroup({
            'date1': new FormControl(currentDate),
            'date2': new FormControl(futureDate)
        }, dateRangeValidator(defaultDateFormat, 'date1', 'date2'));

        expect(dateForm.valid).toEqual(true);
    });

    // ValidateMinDate tests
    it('Test date is before minDate and should be invalid', () => {
        const invalidDate = new FormControl(pastDate, minDateValidator(currentMoment, defaultDateFormat));
        expect(invalidDate.valid).toEqual(false);
    });

    it('Test date is after minDate and should be valid', () => {
        const invalidDate = new FormControl(futureDate, minDateValidator(currentMoment, defaultDateFormat));
        expect(invalidDate.valid).toEqual(true);
    });

    // ValidateMaxDate tests
    it('Test date is after maxDate and should be invalid', () => {
        const invalidDate = new FormControl(afterMaxDate, maxDateValidator(maxMoment, defaultDateFormat));
        expect(invalidDate.valid).toEqual(false);
    });

    it('Test date is before maxDate and should be valid', () => {
        const invalidDate = new FormControl(futureDate, maxDateValidator(maxMoment, defaultDateFormat));
        expect(invalidDate.valid).toEqual(true);
    });

    // Validate returnDate tests
    it('Validate returnDate should fail if tripType is roundTrip and returnDate is null', () => {
        const bookingForm = new FormGroup({
            'tripType': new FormControl('roundTrip'),
            'flight': new FormControl('flight'),
            'returnDate': new FormControl(null)
        }, returnTripValidator('tripType', 'flight', 'returnDate'));

        expect(bookingForm.valid).toEqual(false);
    });

    it('Validate returnDate should fail if flight is roundTripHotel and returnDate is null', () => {
        const bookingForm = new FormGroup({
            'tripType': new FormControl('roundTrip'),
            'flight': new FormControl('roundTripHotel'),
            'returnDate': new FormControl(null)
        }, returnTripValidator('tripType', 'flight', 'returnDate'));

        expect(bookingForm.valid).toEqual(false);
    });

    it('Validate returnDate should succeed for OneWay flight and returnDate is null', () => {
        const bookingForm = new FormGroup({
            'tripType': new FormControl('OneWay'),
            'flight': new FormControl('flight'),
            'returnDate': new FormControl(null)
        }, returnTripValidator('tripType', 'flight', 'returnDate'));

        expect(bookingForm.valid).toEqual(true);
    });

    it('Validate returnDate should succeed for roundTrip flight and returnDate is not null', () => {

        const bookingForm = new FormGroup({
            'tripType': new FormControl('roundTrip'),
            'flight': new FormControl('flight'),
            'returnDate': new FormControl(futureDate)
        }, returnTripValidator('tripType', 'flight', 'returnDate'));

        expect(bookingForm.valid).toEqual(true);
    });

    it('Validate returnDate should succeed for roundTripHotel flight and returnDate is not null', () => {
        const bookingForm = new FormGroup({
            'tripType': new FormControl('roundTrip'),
            'flight': new FormControl('roundTripHotel'),
            'returnDate': new FormControl(futureDate)
        }, returnTripValidator('tripType', 'flight', 'returnDate'));

        expect(bookingForm.valid).toEqual(true);
    });

})

