import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateUtil } from '@core/validators/date-util';
import { Moment } from 'moment';

/**
 * This validator function compares two date fields from a form control
 * and returns a validation error if date1 is after date2.
 *
 * @param dateFormat, specifies the date format, i.e: mm/dd/yyyy or dd/mm/yyyy
 * @param date1, the form control name for date1
 * @param date2, the form control name for date2
 */
export function dateRangeValidator(dateFormat: string, date1: string, date2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value1 = control.get(date1).value;
        const value2 = control.get(date2).value;
        if (!value1 || !value2) return null;

        const moment1: Moment = DateUtil.parse(value1, dateFormat);
        const moment2: Moment = DateUtil.parse(value2, dateFormat);

        if (moment1 && moment2 && moment1.isAfter(moment2)) {
            return {
                invalidDateRange: { control: date2 }
            };
        }
    };
}

/**
 * This validator is used specifically for a round trip booking and check if
 * the flight is a round trip or round trip hotel, a return date is selected.
 *
 * @param tripType, the trip type. i.e: roundTrip or oneWay.
 * @param flight, flight only, vacation package or roundTripHotel.
 * @param returnDate, the return date.
 */
export function returnTripValidator(tripType: string, flight: string, returnDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const tripTypeValue = control.get(tripType).value;
        const flightValue = control.get(flight).value;
        const returnDateValue = control.get(returnDate).value;

        if ((flightValue === 'roundTripHotel' || tripTypeValue === 'roundTrip') && !returnDateValue) {
            control.get(returnDate).setErrors({ required: true });
            return {
                returnTripRequired: { control: returnDate }
            };
        }
    };
}

/**
 * This validator is attached to a form control and validates if the date value
 * is past the maxDate parameter specified and returns an error accordingly.
 *
 * @param maxDate, date value being validated should be before this max date.
 * @param dateFormat, accepted format for the date values. ie. mm//dd/yyyy or dd/mm/yyyy.
 */
export function maxDateValidator(maxDate: Moment, dateFormat: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value || control.value.trim() === '') return;
        const date: Moment = DateUtil.parse(control.value, dateFormat);
        if (date && date.isAfter(maxDate)) {
            return {
                datePastMax: { control: control }
            };
        }
    };
}

/**
 * This validator is attached to a form control and validates if the date value
 * is before the minDate parameter specified and returns an error accordingly.
 *
 * @param minDate, date value being validated should be after this min date.
 * @param dateFormat, accepted format for the date values. ie. mm/dd/yyyy or dd/mm/yyyy.
 */
export function minDateValidator(minDate: Moment, dateFormat: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value || control.value.trim() === '') return;
        const date: Moment = DateUtil.parse(control.value, dateFormat);
        if (date && date.isBefore(minDate)) {
            return {
                dateBeforeMin: { control: control }
            };
        }
    };
}
