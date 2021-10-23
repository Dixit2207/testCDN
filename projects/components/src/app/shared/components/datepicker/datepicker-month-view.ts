import { Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { AilDate } from './ail-date';
import * as aileroni18nTranslations from './aileron-i18n/translation';
import { DayTemplateContext } from './datepicker-day-template-context';
import { AilDatepickerI18n } from './datepicker-i18n';
import { DayViewModel, MonthViewModel } from './datepicker-view-model';

@Component({
    selector: 'ail-datepicker-month-view',
    host: { 'role': 'grid' },
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./datepicker-month-view.scss'],
    template: `
    <div *ngIf="showWeekdays" class="-dp-week -dp-weekdays" role="row">
      <div *ngIf="showWeekNumbers" class="-dp-weekday -dp-showweek"></div>
      <div *ngFor="let w of month.weekdays; let i = index" class="-dp-weekday small" role="columnheader" [innerHTML]="i18nTranslation[locale].dayNamesMin[i]">
      </div>
    </div>
    <ng-template ngFor let-week [ngForOf]="month.weeks">
      <div *ngIf="!week.collapsed" class="-dp-week" role="row">
        <div *ngIf="showWeekNumbers" class="-dp-week-number small text-muted" [innerHTML]="i18n.getWeekNumerals(week.number)"></div>
        <div *ngFor="let day of week.days" (click)="doSelect(day)" class="-dp-day" role="gridcell"
          [class.disabled]="day.context.disabled"
          [tabindex]="day.tabindex"
          [class.hidden]="day.hidden"
          [class.-dp-today]="day.context.today"
          [attr.aria-label]="day.ariaLabel">
          <ng-template [ngIf]="!day.hidden">
            <ng-template [ngTemplateOutlet]="dayTemplate" [ngTemplateOutletContext]="day.context"></ng-template>
          </ng-template>
        </div>
      </div>
    </ng-template>
  `
})
export class AilDatepickerMonthView {
    @Input() dayTemplate: TemplateRef<DayTemplateContext>;
    @Input() month: MonthViewModel;
    @Input() showWeekdays;
    @Input() showWeekNumbers;
    @Input() locale = 'en';
    i18nTranslation = aileroni18nTranslations;

    @Output() select = new EventEmitter<AilDate>();

    constructor(public i18n: AilDatepickerI18n) {
    }

    doSelect(day: DayViewModel) {
        if (!day.context.disabled && !day.hidden) {
            this.select.emit(day.date);
        }
    }
}
