import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { AilDate } from './ail-date';
import * as aileroni18nTranslations from './aileron-i18n';
import { AilDatepickerI18n } from './datepicker-i18n';
import { toInteger } from './util/util';

@Component({
    selector: 'ail-datepicker-navigation-select',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./datepicker-navigation-select.scss'],
    template: `
    <select #month
      [disabled]="disabled"
      class="custom-select"
      i18n-aria-label="@@.datepicker.select-month" aria-label="Select month"
      i18n-title="@@.datepicker.select-month" title="Select month"
      (change)="changeMonth($event.target.value)">
        <option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m, date?.year)"
                [value]="m">{{ i18nTranslation[locale].monthNamesShort[m - 1] }}</option>
    </select><select #year
      [disabled]="disabled"
      class="custom-select"
      i18n-aria-label="@@.datepicker.select-year" aria-label="Select year"
      i18n-title="@@.datepicker.select-year" title="Select year"
      (change)="changeYear($event.target.value)">
        <option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
    </select>
  `
})
export class AilDatepickerNavigationSelect implements AfterViewChecked {
    @Input() date: AilDate;
    @Input() disabled: boolean;
    @Input() months: number[];
    @Input() years: number[];

    i18nTranslation = aileroni18nTranslations;

    @Input() locale = 'en';

    @Output() select = new EventEmitter<AilDate>();

    @ViewChild('month', { static: true, read: ElementRef }) monthSelect: ElementRef;
    @ViewChild('year', { static: true, read: ElementRef }) yearSelect: ElementRef;

    private _month = -1;
    private _year = -1;

    constructor(public i18n: AilDatepickerI18n, private _renderer: Renderer2) {
    }

    changeMonth(month: string) {
        this.select.emit(new AilDate(this.date.year, toInteger(month), 1));
    }

    changeYear(year: string) {
        this.select.emit(new AilDate(toInteger(year), this.date.month, 1));
    }

    ngAfterViewChecked() {
        if (this.date) {
            if (this.date.month !== this._month) {
                this._month = this.date.month;
                this._renderer.setProperty(this.monthSelect.nativeElement, 'value', this._month);
            }
            if (this.date.year !== this._year) {
                this._year = this.date.year;
                this._renderer.setProperty(this.yearSelect.nativeElement, 'value', this._year);
            }
        }
    }
}
