import { Injectable } from '@angular/core';
import { AilDateStruct } from '../ail-date-struct';
import { AilDateNativeAdapter } from './ail-date-native-adapter';

/**
 * Same as [`AilDateNativeAdapter`](#/components/datepicker/api#AilDateNativeAdapter), but with UTC dates.
 *
 * @since 3.2.0
 */
@Injectable()
export class AilDateNativeUTCAdapter extends AilDateNativeAdapter {
    protected _fromNativeDate(date: Date): AilDateStruct {
        return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
    }

    protected _toNativeDate(date: AilDateStruct): Date {
        const jsDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
        // avoid 30 -> 1930 conversion
        jsDate.setUTCFullYear(date.year);
        return jsDate;
    }
}
