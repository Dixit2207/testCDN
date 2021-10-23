import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AilDate } from './ail-date';
import * as aileroni18nTranslations from './aileron-i18n';
import { AilDatepickerI18n } from './datepicker-i18n';
import { MonthViewModel, NavigationEvent } from './datepicker-view-model';

@Component({
    selector: 'ail-datepicker-navigation',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./datepicker-navigation.scss'],
    template: `

        <button type="button" class="-dp-arrow-btn" (click)="onClickPrev($event)" [disabled]="prevDisabled"
                i18n-aria-label="@@.datepicker.previous-month" aria-label="Previous month"
                i18n-title="@@.datepicker.previous-month" title="Previous month">
            <span class="-dp-navigation-chevron"></span>
        </button>

        <ail-datepicker-navigation-select *ngIf="showSelect" class="-dp-navigation-select"
                                          [date]="date"
                                          [disabled]="disabled"
                                          [locale]="locale"
                                          [months]="selectBoxes.months"
                                          [years]="selectBoxes.years"
                                          (select)="select.emit($event)">
        </ail-datepicker-navigation-select>

        <ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
            <div *ngIf="i > 0"></div>
            <div class="-dp-month-name">
                {{ i18nTranslation[locale].monthNames[month.number - 1]  }} {{ i18n.getYearNumerals(month.year) }}
            </div>
            <div *ngIf="i !== months.length - 1"></div>
        </ng-template>
        <div class="right">
            <button type="button" class="-dp-arrow-btn" (click)="onClickNext($event)" [disabled]="nextDisabled"
                    i18n-aria-label="@@.datepicker.next-month" aria-label="Next month"
                    i18n-title="@@.datepicker.next-month" title="Next month">
                <span class="-dp-navigation-chevron"></span>
            </button>
        </div>
    `
})
export class AilDatepickerNavigation {
    navigation = NavigationEvent;

    @Input() date: AilDate;
    @Input() disabled: boolean;
    @Input() months: MonthViewModel[] = [];
    @Input() showSelect: boolean;
    @Input() prevDisabled: boolean;
    @Input() nextDisabled: boolean;
    @Input() selectBoxes: { years: number[], months: number[] };

    @Output() navigate = new EventEmitter<NavigationEvent>();
    @Output() select = new EventEmitter<AilDate>();

    i18nTranslation = aileroni18nTranslations;

    @Input() locale = 'en';

    constructor(public i18n: AilDatepickerI18n) {
    }

    onClickPrev(event: MouseEvent) {
        (event.currentTarget as HTMLElement).focus();
        this.navigate.emit(this.navigation.PREV);
    }

    onClickNext(event: MouseEvent) {
        (event.currentTarget as HTMLElement).focus();
        this.navigate.emit(this.navigation.NEXT);
    }
}
