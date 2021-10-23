import { AilDate } from './ail-date';
import { AilDateStruct } from './ail-date-struct';
import { DayTemplateContext } from './datepicker-day-template-context';

export type AilMarkDisabled = (date: AilDateStruct, current: { year: number, month: number }) => boolean;
export type AilDayTemplateData = (date: AilDateStruct, current: { year: number, month: number }) => any;

export type DayViewModel = {
    date: AilDate,
    context: DayTemplateContext,
    tabindex: number,
    ariaLabel: string,
    hidden: boolean
};

export type WeekViewModel = {
    number: number,
    days: DayViewModel[],
    collapsed: boolean
};

export type MonthViewModel = {
    firstDate: AilDate,
    lastDate: AilDate,
    number: number,
    year: number,
    weeks: WeekViewModel[],
    weekdays: number[]
};

// clang-format off
export type DatepickerViewModel = {
    dayTemplateData?: AilDayTemplateData,
    disabled: boolean,
    displayMonths: number,
    firstDate?: AilDate,
    firstDayOfWeek: number,
    focusDate?: AilDate,
    focusVisible: boolean,
    lastDate?: AilDate,
    markDisabled?: AilMarkDisabled,
    maxDate?: AilDate,
    minDate?: AilDate,
    months: MonthViewModel[],
    navigation: 'select' | 'arrows' | 'none',
    outsideDays: 'visible' | 'collapsed' | 'hidden',
    prevDisabled: boolean,
    nextDisabled: boolean,
    selectBoxes: {
        years: number[],
        months: number[]
    },
    selectedDate: AilDate
};

// clang-format on

export enum NavigationEvent {
    PREV,
    NEXT
}
