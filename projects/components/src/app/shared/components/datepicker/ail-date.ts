import { AilDateStruct } from './ail-date-struct';
import { isInteger } from './util/util';

/**
 * A simple class that represents a date that datepicker also uses internally.
 *
 * It is the implementation of the `AilDateStruct` interface that adds some convenience methods,
 * like `.equals()`, `.before()`, etc.
 *
 * All datepicker APIs consume `AilDateStruct`, but return `AilDate`.
 *
 * In many cases it is simpler to manipulate these objects together with
 * [`AilCalendar`](#/components/datepicker/api#AilCalendar) than native JS Dates.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details.
 *
 * @since 3.0.0
 */
export class AilDate implements AilDateStruct {
    /**
     * The day of month, starting with 1
     */
    day: number;
    /**
     * The month, for example 1=Jan ... 12=Dec as in ISO 8601
     */
    month: number;
    /**
     * The year, for example 2016
     */
    year: number;

    constructor(year: number, month: number, day: number) {
        this.year = isInteger(year) ? year : null;
        this.month = isInteger(month) ? month : null;
        this.day = isInteger(day) ? day : null;
    }

    /**
     * A **static method** that creates a new date object from the `AilDateStruct`,
     *
     * ex. `AilDate.from({year: 2000, month: 5, day: 1})`.
     *
     * If the `date` is already of `AilDate` type, the method will return the same object.
     */
    static from(date: AilDateStruct): AilDate {
        if (date instanceof AilDate) {
            return date;
        }
        return date ? new AilDate(date.year, date.month, date.day) : null;
    }

    /**
     * Checks if the current date is equal to another date.
     */
    equals(other: AilDateStruct): boolean {
        return other && this.year === other.year && this.month === other.month && this.day === other.day;
    }

    /**
     * Checks if the current date is before another date.
     */
    before(other: AilDateStruct): boolean {
        if (!other) {
            return false;
        }

        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day < other.day;
            } else {
                return this.month < other.month;
            }
        } else {
            return this.year < other.year;
        }
    }

    /**
     * Checks if the current date is after another date.
     */
    after(other: AilDateStruct): boolean {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day > other.day;
            } else {
                return this.month > other.month;
            }
        } else {
            return this.year > other.year;
        }
    }
}
