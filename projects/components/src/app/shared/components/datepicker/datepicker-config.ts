import { Injectable, TemplateRef } from '@angular/core';
import { AilDateStruct } from './ail-date-struct';
import { DayTemplateContext } from './datepicker-day-template-context';

/**
 * A configuration service for the [`AilDatepicker`](#/components/datepicker/api#AilDatepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
@Injectable({ providedIn: 'root' })
export class AilDatepickerConfig {
    dayTemplate: TemplateRef<DayTemplateContext>;
    dayTemplateData: (date: AilDateStruct, current: { year: number, month: number }) => any;
    locale: string;
    displayMonths = 1;
    firstDayOfWeek = 0;
    markDisabled: (date: AilDateStruct, current: { year: number, month: number }) => boolean;
    minDate: AilDateStruct;
    maxDate: AilDateStruct;
    navigation: 'select' | 'arrows' | 'none' = 'select';
    outsideDays: 'visible' | 'collapsed' | 'hidden' = 'visible';
    showWeekdays = true;
    showWeekNumbers = false;
    startDate: { year: number, month: number };
}
