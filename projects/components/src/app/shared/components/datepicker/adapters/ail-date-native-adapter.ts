import { Injectable } from '@angular/core';
import { AilDateStruct } from '../ail-date-struct';
import { isInteger } from '../util/util';
import { AilDateAdapter } from './ail-date-adapter';

/**
 * [`AilDateAdapter`](#/components/datepicker/api#AilDateAdapter) implementation that uses
 * native javascript dates as a user date model.
 */
@Injectable()
export class AilDateNativeAdapter extends AilDateAdapter<Date> {
    /**
     * Converts a native `Date` to a `AilDateStruct`.
     */
    fromModel(date: Date): AilDateStruct {
        return (date instanceof Date && !isNaN(date.getTime())) ? this._fromNativeDate(date) : null;
    }

    /**
     * Converts a `AilDateStruct` to a native `Date`.
     */
    toModel(date: AilDateStruct): Date {
        return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) ? this._toNativeDate(date) :
            null;
    }

    protected _fromNativeDate(date: Date): AilDateStruct {
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }

    protected _toNativeDate(date: AilDateStruct): Date {
        const jsDate = new Date(date.year, date.month - 1, date.day, 12);
        // avoid 30 -> 1930 conversion
        jsDate.setFullYear(date.year);
        return jsDate;
    }
}
