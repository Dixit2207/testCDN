import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { AilDateStruct } from './ail-date-struct';

export function AIL_DATEPICKER_18N_FACTORY(locale) {
    return new AilDatepickerI18nDefault(locale);
}

/**
 * A service supplying i18n data to the datepicker component.
 *
 * The default implementation of this service uses the Angular locale and registered locale data for
 * weekdays and month names (as explained in the Angular i18n guide).
 *
 * It also provides a way to i18n data that depends on calendar calculations, like aria labels, day, week and year
 * numerals. For other static labels the datepicker uses the default Angular i18n.
 *
 * See the [i18n demo](#/components/datepicker/examples#i18n) and
 * [Hebrew calendar demo](#/components/datepicker/calendars#hebrew) on how to extend this class and define
 * a custom provider for i18n.
 */
@Injectable({ providedIn: 'root', useFactory: AIL_DATEPICKER_18N_FACTORY, deps: [LOCALE_ID] })
export abstract class AilDatepickerI18n {
    /**
     * Returns the short weekday name to display in the heading of the month view.
     *
     * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
     */
    abstract getWeekdayShortName(weekday: number): string;

    /**
     * Returns the short month name to display in the date picker navigation.
     *
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     */
    abstract getMonthShortName(month: number, year?: number): string;

    /**
     * Returns the full month name to display in the date picker navigation.
     *
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     */
    abstract getMonthFullName(month: number, year?: number): string;

    /**
     * Returns the value of the `aria-label` attribute for a specific date.
     *
     * @since 2.0.0
     */
    abstract getDayAriaLabel(date: AilDateStruct): string;

    /**
     * Returns the textual representation of a day that is rendered in a day cell.
     *
     * @since 3.0.0
     */
    getDayNumerals(date: AilDateStruct): string {
        return `${date.day}`;
    }

    /**
     * Returns the textual representation of a week number rendered by datepicker.
     *
     * @since 3.0.0
     */
    getWeekNumerals(weekNumber: number): string {
        return `${weekNumber}`;
    }

    /**
     * Returns the textual representation of a year that is rendered in the datepicker year select box.
     *
     * @since 3.0.0
     */
    getYearNumerals(year: number): string {
        return `${year}`;
    }
}

@Injectable()
export class AilDatepickerI18nDefault extends AilDatepickerI18n {
    private _weekdaysShort: Array<string>;
    private _monthsShort: ReadonlyArray<string>;
    private _monthsFull: ReadonlyArray<string>;

    constructor(@Inject(LOCALE_ID) private locale: string) {
        super();

        const weekdaysStartingOnSunday = getLocaleDayNames(locale, FormStyle.Standalone, TranslationWidth.Short);
        this._weekdaysShort = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);

        this._monthsShort = getLocaleMonthNames(locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
        this._monthsFull = getLocaleMonthNames(locale, FormStyle.Standalone, TranslationWidth.Wide);
    }

    getDayAriaLabel(date: AilDateStruct): string {
        const jsDate = new Date(date.year, date.month - 1, date.day);
        return formatDate(jsDate, 'fullDate', this.locale);
    }

    getMonthFullName(month: number): string {
        return this._monthsFull[month - 1];
    }

    getMonthShortName(month: number): string {
        return this._monthsShort[month - 1];
    }

    getWeekdayShortName(weekday: number): string {
        return this._weekdaysShort[weekday - 1];
    }
}
