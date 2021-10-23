import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AilDateAdapter } from './adapters/ail-date-adapter';
import { AilCalendar } from './ail-calendar';
import { AilDate } from './ail-date';
import { AilDateStruct } from './ail-date-struct';
import * as aileroni18nTranslations from './aileron-i18n';
import { AilDatepickerConfig } from './datepicker-config';
import { DayTemplateContext } from './datepicker-day-template-context';
import { AilDatepickerI18n } from './datepicker-i18n';
import { AilInputDatepicker } from './datepicker-input';
import { AilDatepickerKeyboardService } from './datepicker-keyboard-service';
import { AilDatepickerService } from './datepicker-service';
import { isChangedDate, isChangedMonth } from './datepicker-tools';
import { DatepickerViewModel, NavigationEvent } from './datepicker-view-model';
import { hasClassName } from './util/util';

/**
 * Fetches value from the datepicker
 */
const AIL_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AilDatepicker),
    multi: true
};

/**
 * An event emitted right before the navigation happens and the month displayed by the datepicker changes.
 */
export interface AilDatepickerNavigateEvent {
    /**
     * The currently displayed month.
     */
    current: {
        year: number;
        month: number;
    };

    /**
     * The month we're navigating to.
     */
    next: {
        year: number;
        month: number;
    };

    /**
     * Calling this function will prevent navigation from happening.
     *
     * @since 4.1.0
     */
    preventDefault: () => void;
}

/**
 * An interface that represents the readonly public state of the datepicker.
 *
 * Accessible via the `datepicker.state` getter
 *
 * @since 5.2.0
 */
export interface AilDatepickerState {
    /**
     * The earliest date that can be displayed or selected
     */
    readonly minDate: AilDate;

    /**
     * The latest date that can be displayed or selected
     */
    readonly maxDate: AilDate;

    /**
     * The first visible date of currently displayed months
     */
    readonly firstDate: AilDate;

    /**
     * The last visible date of currently displayed months
     */
    readonly lastDate: AilDate;

    /**
     * The date currently focused by the datepicker
     */
    readonly focusedDate: AilDate;
}

/**
 * A highly configurable component that helps you with selecting calendar dates.
 *
 * `AilDatepicker` is meant to be displayed inline on a page or put inside a popup.
 */
@Component({
    exportAs: 'ailDatepicker',
    selector: 'ail-datepicker',
    styleUrls: ['./datepicker.scss'],
    template: `
        <dp-header (closed)="closed()"></dp-header>
        <ng-template #dt let-date="date" let-currentMonth="currentMonth" let-selected="selected" let-disabled="disabled" let-focused="focused">
            <div ailDatepickerDayView [date]="date" [currentMonth]="currentMonth" [selected]="selected" [disabled]="disabled" [focused]="focused"></div>
        </ng-template>

        <div class="-dp-header" *ngIf="navigation !== 'none'">
            <ail-datepicker-navigation
                [date]="model.firstDate"
                [months]="model.months"
                [disabled]="model.disabled"
                [locale]="locale"
                [showSelect]="model.navigation === 'select'"
                [prevDisabled]="model.prevDisabled"
                [nextDisabled]="model.nextDisabled"
                [selectBoxes]="model.selectBoxes"
                (navigate)="onNavigateEvent($event)"
                (select)="onNavigateDateSelect($event)"
            >
            </ail-datepicker-navigation>
        </div>

        <div #months class="-dp-months" (keydown)="onKeyDown($event)">
            <ng-template ngFor let-month [ngForOf]="model.months" let-i="index">
                <div class="-dp-month">
                    <div *ngIf="navigation === 'none' || (displayMonths > 1 && navigation === 'select')" class="-dp-month-name">
                        {{ i18nTranslation[locale].monthNames[month.number - 1] }}
                        {{ i18n.getYearNumerals(month.year) }}
                    </div>
                    <ail-datepicker-month-view
                        [locale]="locale"
                        [month]="month"
                        [dayTemplate]="dayTemplate || dt"
                        [showWeekdays]="showWeekdays"
                        [showWeekNumbers]="showWeekNumbers"
                        (select)="onDateSelect($event)"
                    >
                    </ail-datepicker-month-view>
                </div>
            </ng-template>
        </div>

        <dp-footer (closed)="closed()" [locale]="locale" (today)="this.dateSelect.emit(this.calendar.getToday())"></dp-footer>
    `,
    providers: [AIL_DATEPICKER_VALUE_ACCESSOR, AilDatepickerService]
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AilDatepicker implements OnDestroy, OnChanges, OnInit, AfterViewInit, ControlValueAccessor {
    model: DatepickerViewModel;
    public datepickerRef: AilInputDatepicker;
    /**
     * i18n translation files
     */
    i18nTranslation = aileroni18nTranslations;
    /**
     * locale of the datepicker
     *
     * With default locale set to 'en', you can set the locale of the datepicker through this input.
     */
    @Input() locale = 'en';
    /**
     * The reference to a custom template for the day.
     *
     * Allows to completely override the way a day 'cell' in the calendar is displayed.
     *
     * See [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext) for the data you get inside.
     */
    @Input() dayTemplate: TemplateRef<DayTemplateContext>;
    /**
     * The callback to pass any arbitrary data to the template cell via the
     * [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext)'s `data` parameter.
     *
     * `current` is the month that is currently displayed by the datepicker.
     *
     * @since 3.3.0
     */
    @Input() dayTemplateData: (
        date: AilDate,
        current: {
            year: number;
            month: number;
        }
    ) => any;
    /**
     * The number of months to display.
     */
    @Input() displayMonths: number;
    /**
     * The first day of the week.
     *
     * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
     */
    @Input() firstDayOfWeek: number;
    /**
     * The callback to mark some dates as disabled.
     *
     * It is called for each new date when navigating to a different month.
     *
     * `current` is the month that is currently displayed by the datepicker.
     */
    @Input() markDisabled: (
        date: AilDate,
        current: {
            year: number;
            month: number;
        }
    ) => boolean;
    /**
     * The latest date that can be displayed or selected.
     *
     * If not provided, 'year' select box will display 10 years after the current month.
     */
    @Input() maxDate: AilDateStruct;
    /**
     * The earliest date that can be displayed or selected.
     *
     * If not provided, 'year' select box will display 10 years before the current month.
     */
    @Input() minDate: AilDateStruct;
    /**
     * Navigation type.
     *
     * * `"select"` - select boxes for month and navigation arrows
     * * `"arrows"` - only navigation arrows
     * * `"none"` - no navigation visible at all
     */
    @Input() navigation: 'select' | 'arrows' | 'none';
    /**
     * The way of displaying days that don't belong to the current month.
     *
     * * `"visible"` - days are visible
     * * `"hidden"` - days are hidden, white space preserved
     * * `"collapsed"` - days are collapsed, so the datepicker height might change between months
     *
     * For the 2+ months view, days in between months are never shown.
     */
    @Input() outsideDays: 'visible' | 'collapsed' | 'hidden';
    /**
     * If `true`, weekdays will be displayed.
     */
    @Input() showWeekdays: boolean;
    /**
     * If `true`, week numbers will be displayed.
     */
    @Input() showWeekNumbers: boolean;
    /**
     * The date to open calendar with.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date is provided, calendar will open with current month.
     *
     * You could use `navigateTo(date)` method as an alternative.
     */
    @Input() startDate: {
        year: number;
        month: number;
        day?: number;
    };
    /**
     * An event emitted right before the navigation happens and displayed month changes.
     *
     * See [`AilDatepickerNavigateEvent`](#/components/datepicker/api#AilDatepickerNavigateEvent) for the payload info.
     */
    @Output() navigate = new EventEmitter<AilDatepickerNavigateEvent>();
    /**
     * An event emitted when user selects a date using keyboard or mouse.
     *
     * The payload of the event is currently selected `AilDate`.
     *
     * @since 5.2.0
     */
    @Output() dateSelect = new EventEmitter<AilDate>();
    /**
     * An event emitted when user selects a date using keyboard or mouse.
     *
     * The payload of the event is currently selected `AilDate`.
     *
     * Please use 'dateSelect' output instead, this will be deprecated in version 6.0 due to collision with native
     * 'select' event.
     */
    @Output() select = this.dateSelect;

    /**
     * fetch months
     */
    @ViewChild('months', {
        static: true
    })
    private _monthsEl: ElementRef<HTMLElement>;
    private _controlValue: AilDate;
    private _destroyed$ = new Subject<void>();
    private _publicState: AilDatepickerState = <any>{};

    /**
     * @ignore
     */
    constructor(
        private _service: AilDatepickerService,
        public calendar: AilCalendar,
        public i18n: AilDatepickerI18n,
        config: AilDatepickerConfig,
        private _keyboardService: AilDatepickerKeyboardService,
        public cd: ChangeDetectorRef,
        private _elementRef: ElementRef<HTMLElement>,
        private _DateAdapter: AilDateAdapter<any>,
        private _ngZone: NgZone,
        private liveAnnouncer: LiveAnnouncer
    ) {
        [
            'dayTemplate',
            'dayTemplateData',
            'displayMonths',
            'firstDayOfWeek',
            'markDisabled',
            'minDate',
            'maxDate',
            'navigation',
            'outsideDays',
            'showWeekdays',
            'showWeekNumbers',
            'startDate',
            'locale'
        ].forEach((input) => (this[input] = config[input]));
        _service.dateSelect$.pipe(takeUntil(this._destroyed$)).subscribe((date) => {
            this.dateSelect.emit(date);
        });

        _service.model$.pipe(takeUntil(this._destroyed$)).subscribe((model) => {
            const newDate = model.firstDate;
            const oldDate = this.model ? this.model.firstDate : null;

            // update public state
            this._publicState = {
                maxDate: model.maxDate,
                minDate: model.minDate,
                firstDate: model.firstDate,
                lastDate: model.lastDate,
                focusedDate: model.focusDate
            };

            let navigationPrevented = false;
            // emitting navigation event if the first month changes
            if (!newDate.equals(oldDate)) {
                this.navigate.emit({
                    current: oldDate
                        ? {
                            year: oldDate.year,
                            month: oldDate.month
                        }
                        : null,
                    next: {
                        year: newDate.year,
                        month: newDate.month
                    },
                    preventDefault: () => (navigationPrevented = true)
                });

                // can't prevent the very first navigation
                if (navigationPrevented && oldDate !== null) {
                    this._service.open(oldDate);
                    return;
                }
            }

            const newSelectedDate = model.selectedDate;
            const newFocusedDate = model.focusDate;
            const oldFocusedDate = this.model ? this.model.focusDate : null;

            this.model = model;

            // handling selection change
            if (isChangedDate(newSelectedDate, this._controlValue)) {
                this._controlValue = newSelectedDate;
                this.onTouched();
                this.onChange(this._DateAdapter.toModel(newSelectedDate));
            }

            // handling focus change
            if (isChangedDate(newFocusedDate, oldFocusedDate) && oldFocusedDate && model.focusVisible) {
                this.focus();
            }

            cd.markForCheck();
        });
    }

    /**
     *  Returns the readonly public state of the datepicker
     *
     * @since 5.2.0
     */
    get state(): AilDatepickerState {
        return this._publicState;
    }

    /**
     * @ignore
     */
    onChange = (_: any) => {
    };

    /**
     * @ignore
     */
    onTouched = () => {
    };

    /**
     *  Focuses on given date.
     */
    focusDate(date: AilDateStruct): void {
        this._service.focus(AilDate.from(date));
    }

    /**
     *  Selects focused date.
     */
    focusSelect(): void {
        this._service.focusSelect();
    }

    /**
     * Focuses on a particular day
     */
    focus() {
        this._ngZone.onStable
            .asObservable()
            .pipe(take(1))
            .subscribe(() => {
                const elementToFocus = this._elementRef.nativeElement.querySelector<HTMLDivElement>('div.-dp-day[tabindex="0"]');
                if (elementToFocus) {
                    elementToFocus.focus();
                }
            });
    }

    /**
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     */
    navigateTo(date?: { year: number; month: number; day?: number }) {
        this._service.open(
            AilDate.from(
                date
                    ? date.day
                    ? (date as AilDateStruct)
                    : {
                        ...date,
                        day: 1
                    }
                    : null
            )
        );
    }

    /**
     * @ignore
     */
    ngAfterViewInit() {
        this._ngZone.runOutsideAngular(() => {
            const focusIns$ = fromEvent<FocusEvent>(this._monthsEl.nativeElement, 'focusin');
            const focusOuts$ = fromEvent<FocusEvent>(this._monthsEl.nativeElement, 'focusout');

            // we're changing 'focusVisible' only when entering or leaving months view
            // and ignoring all focus events where both 'target' and 'related' target are day cells
            merge(focusIns$, focusOuts$)
                .pipe(
                    filter(({ target, relatedTarget }) => !(hasClassName(target, '-dp-day') && hasClassName(relatedTarget, '-dp-day'))),
                    takeUntil(this._destroyed$)
                )
                .subscribe(({ type }) => this._ngZone.run(() => (this._service.focusVisible = type === 'focusin')));
        });
    }

    /**
     * @ignore
     */
    ngOnDestroy() {
        this._destroyed$.next();
    }

    /**
     * @ignore
     */
    ngOnInit() {
        if (this.model === undefined) {

            ['dayTemplateData', 'displayMonths', 'markDisabled', 'firstDayOfWeek', 'navigation', 'minDate', 'maxDate', 'outsideDays'].forEach((input) => (this._service[input] = this[input]));
            this.navigateTo(this.startDate);
        }
    }

    /**
     * @ignore
     */
    ngOnChanges(changes: SimpleChanges) {
        ['dayTemplateData', 'displayMonths', 'markDisabled', 'firstDayOfWeek', 'navigation', 'minDate', 'maxDate', 'outsideDays']
            .filter((input) => input in changes)
            .forEach((input) => (this._service[input] = this[input]));

        if ('startDate' in changes) {
            const { currentValue, previousValue } = changes.startDate;
            if (isChangedMonth(previousValue, currentValue)) {
                this.navigateTo(this.startDate);
            }
        }
    }

    /**
     * Closes the datepicker
     */
    closed() {
        this.datepickerRef.close();
    }

    /**
     * Function is called when date is selected
     * @param date: AilDate
     */
    onDateSelect(date: AilDate) {
        this._service.focus(date);
        this._service.select(date, {
            emitEvent: true
        });

        this.liveAnnouncer.announce(` You have selected day ${date.day} of month ${date.month} of year ${date.year}`);
    }

    /**
     * @ignore
     */
    onKeyDown(event: KeyboardEvent) {
        this._keyboardService.processKey(event, this, this.calendar);
    }

    /**
     * @ignore
     */
    onNavigateDateSelect(date: AilDate) {
        this._service.open(date);
    }

    /**
     * @ignore
     */
    onNavigateEvent(event: NavigationEvent) {
        switch (event) {
            case NavigationEvent.PREV:
                this._service.open(this.calendar.getPrev(this.model.firstDate, 'm', 1));
                break;
            case NavigationEvent.NEXT:
                this._service.open(this.calendar.getNext(this.model.firstDate, 'm', 1));
                break;
        }
    }

    /**
     * @ignore
     */
    registerOnChange(fn: (value: any) => any): void {
        this.onChange = fn;
    }

    /**
     * @ignore
     */
    registerOnTouched(fn: () => any): void {
        this.onTouched = fn;
    }

    /**
     * @ignore
     */
    setDisabledState(isDisabled: boolean) {
        this._service.disabled = isDisabled;
    }

    /**
     * @ignore
     */
    writeValue(value) {
        this._controlValue = AilDate.from(this._DateAdapter.fromModel(value));
        this._service.select(this._controlValue);
    }
}
