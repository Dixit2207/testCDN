import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AilCalendar, AilDate, AilDateParserFormatter } from '@shared/components/datepicker';
import { I18NextPipe } from 'angular-i18next';
import { DateTime } from 'luxon';
import moment, { Moment } from 'moment';
import {CONSTANTS} from '@modules/book/book.component';

@Injectable({
    providedIn: 'root'
})
export class BookingDatepickerConfig {
    /**
     * Hovered Date variable
     */
    private _hoveredDate: AilDate = null;

    /**
     * Today's Date
     */
    private _today = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    };

    private _departDate: AilDate;
    private _returnDate: AilDate;

    constructor(
        public formatter: AilDateParserFormatter,
        private calendar: AilCalendar,
        private i18NextPipe: I18NextPipe
    ) {
    }

    /**
     * parent FormGroup
     */
    private _form: FormGroup;

    get form() {
        return this._form;
    }

    set form(form: FormGroup) {
        this._form = form;
    }

    /**
     * Datepicker Config
     */
    private _config = {
        placeholder: null,
        today: this._today,
        hoveredDate: this._hoveredDate,
        displayMonths: 2,
        lastUpdateDate: null,
        locale: localStorage.getItem('i18nextLng')?.substr(0, 2) || 'en',
        rollupLocale: 'en',
        autoClose: 'outside',
        outsideDays: 'hidden',
        navigation: 'arrows' /** string: arrows | select | none */,
        departDate: null,
        returnDate: null,

        onClose: () => {
            // needed?
        },
        isHovered: (date: AilDate) => {
            return this.config.departDate && !this.config.returnDate && this.config.hoveredDate && date.after(this.config.returnDate) && date.before(this.config.hoveredDate);
        },
        isInside: (date: AilDate) => {
            return date.after(this.config.departDate) && date.before(this.config.returnDate);
        },
        isRange: (date: AilDate) => {
            return date.equals(this.config.departDate) || date.equals(this.config.returnDate) || this.config.isInside(date) || this.config.isHovered(date);
        },
        validateInput: (currentValue: AilDate, input: string): AilDate => {
            const parsed = this.formatter.parse(input);
            return parsed && this.calendar.isValid(AilDate.from(parsed)) ? AilDate.from(parsed) : currentValue;
        },
        setInputFormat: (event) => {
            this.config.placeholder = event;
        }
    };

    get config() {
        return this._config;
    }

    set config(config) {
        this._config = config;
    }

    formatDate(date: AilDate) {
        if (this.config.locale.includes('fr') || this.config.locale.includes('pt')) {
            return DateTime.local(date.year, date.month, date.day).setLocale(this.config.locale).toLocaleString(DateTime.DATE_SHORT);
        } else {
            return DateTime.local(date.year, date.month, date.day).toLocaleString(DateTime.DATE_SHORT);
        }
    }

    formatDateLong(date: AilDate) {
        return DateTime.local(date.year, date.month, date.day).setLocale(this.config.locale).toLocaleString(DateTime.DATE_FULL);
    }

    parseDate(raw: String) {
        const format = this.i18NextPipe.transform('dateFormats.short');
        const [datePart1, datePart2, datePart3] = raw.split('/');
        const [formatPart1, formatPart2, formatPart3] = format.split('/');
        const { yyyy: year, mm: month, dd: day }: any = {
            [formatPart1]: +datePart1,
            [formatPart2]: +datePart2,
            [formatPart3]: +datePart3
        };
        return new AilDate(year, month, day);
    }

    public computeMinDate(onVacationTab: boolean): any {
        const minDate = new Date();

        if (onVacationTab) {
            minDate.setDate(minDate.getDate() + 2);
        }

        return {
            year: minDate.getFullYear(),
            month: minDate.getMonth() + 1,
            day: minDate.getDate()
        };
    }

    public computeMaxDate(): Moment {
        return moment().add(331, 'days');
    }

    public onDateSelections(dateFieldClicked: string, date: AilDate): boolean {
        const departDateField = this._form.get('departDate');
        const returnDateField = this._form.get('returnDate');
        const tripTypeSelected = this._form.get('tripType');

        if (dateFieldClicked === 'returnDate') {
            this.config.returnDate = date;
            returnDateField.setValue(this.formatDate(date));
            return true;
        } else {
            if (tripTypeSelected.value === 'oneWay') {
                this.config.departDate = date;
                departDateField.setValue(this.formatDate(date));
                return true;
            } else {
                if (!this.config.departDate && !this.config.returnDate) {
                    this.config.departDate = date;
                    departDateField.setValue(this.formatDate(date));
                    if (!date.after(this.config.lastUpdateDate) && returnDateField.value) {
                        return true;
                    } else {
                        returnDateField.setValue('');
                    }
                } else if (!this.config.departDate && this.config.returnDate) {
                    this.config.departDate = date;
                    departDateField.setValue(this.formatDate(date));
                    if (!date.after(this.config.returnDate)) {
                        this.config.departDate = date;
                        this.config.lastUpdateDate = date;
                        departDateField.setValue(this.formatDate(date));
                        this.config.lastUpdateDate = null;
                        return true;
                    } else {
                        if (this.config.lastUpdateDate === null) {
                            this.config.departDate = date;
                            this.config.lastUpdateDate = date;
                            departDateField.setValue(this.formatDate(date));
                            returnDateField.setValue('');
                        } else {
                            this.config.returnDate = date;
                            this.config.lastUpdateDate = null;
                            returnDateField.setValue('');
                            returnDateField.setValue(this.formatDate(date));
                            return true;
                        }
                    }
                } else if (this.config.departDate && !this.config.returnDate && date.after(this.config.departDate)) {
                    this.config.returnDate = date;
                    returnDateField.setValue(this.formatDate(date));
                    return true;
                } else if (this.config.departDate && this.config.returnDate && this.config.isInside(date)) {
                    this.config.departDate = date;
                    this.config.lastUpdateDate = null;
                    departDateField.setValue(this.formatDate(date));
                    return true;
                } else if (this.config.departDate && this.config.returnDate && !this.config.isInside(date)) {
                    if (!date.after(this.config.returnDate)) {
                        this.config.departDate = date;
                        this.config.lastUpdateDate = date;
                        departDateField.setValue(this.formatDate(date));
                        this.config.lastUpdateDate = null;
                        return true;
                    } else {
                        if (this.config.lastUpdateDate === null) {
                            this.config.departDate = date;
                            this.config.lastUpdateDate = this.config.departDate;
                            departDateField.setValue(this.formatDate(date));
                            returnDateField.setValue('');
                        } else {
                            this.config.returnDate = date;
                            this.config.lastUpdateDate = null;
                            returnDateField.setValue('');
                            returnDateField.setValue(this.formatDate(date));
                            return true;
                        }
                    }
                } else {
                    this.config.departDate = date;
                    this.config.returnDate = null;
                    departDateField.setValue(this.formatDate(date));
                    returnDateField.setValue('');
                }
            }
        }
    }

    markDisabled(dateFieldClicked: any, date: AilDate) {
        const ailDepartDate: AilDate = this.config.departDate;
        if (ailDepartDate != null && date.before(ailDepartDate) &&
            dateFieldClicked === CONSTANTS.FORM_FIELD_RETURN_DATE) {
            return true;
        }
        return false;
    }
}
