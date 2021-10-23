/* eslint-disable angular/document-service,angular/window-service */
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { AilDateAdapter } from './adapters/ail-date-adapter';
import { AilCalendar } from './ail-calendar';
import { AilDate } from './ail-date';
import { AilDateParserFormatter } from './ail-date-parser-formatter';
import { AilDateStruct } from './ail-date-struct';
import { AilDatepicker, AilDatepickerNavigateEvent } from './ail-datepicker.component';
import * as aileroni18nTranslations from './aileron-i18n';
import { AilDatepickerConfig } from './datepicker-config';
import { DayTemplateContext } from './datepicker-day-template-context';
import { AilInputDatepickerConfig } from './datepicker-input-config';
import { AutoClose } from './util/autoclose';
import { BREAKPOINTS } from './util/breakpoints';
import { ailFocusTrap } from './util/focus-trap';
import { PlacementArray, positionElements } from './util/positioning';
import { rollUpLocales } from './util/rollup';
import { isString } from './util/util';

/**
 * Fetches value from the datepicker
 */
const AIL_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AilInputDatepicker),
    multi: true
};

/**
 * Validates value from the datepicker
 */
const AIL_DATEPICKER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => AilInputDatepicker),
    multi: true
};

/**
 * A directive that allows to stick a datepicker popup to an input field.
 *
 * Manages interaction with the input field itself, does value formatting and provides forms integration.
 */
@Directive({
    selector: 'input[ailDatepicker]',
    exportAs: 'ailDatepicker',
    host: {
        '(input)': 'manualDateChange($event.target.value)',
        '(change)': 'manualDateChange($event.target.value, true)',
        '(focus)': 'onFocus()',
        '(blur)': 'onBlur()',
        '[disabled]': 'disabled'
    },
    providers: [AIL_DATEPICKER_VALUE_ACCESSOR, AIL_DATEPICKER_VALIDATOR, { provide: AilDatepickerConfig, useExisting: AilInputDatepickerConfig }]
})
export class AilInputDatepicker implements OnChanges, OnDestroy, ControlValueAccessor, Validator {
    /**
     * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
     *
     * * `true` - the popup will close on both date selection and outside click.
     * * `false` - the popup can only be closed manually via `close()` or `toggle()` methods.
     * * `"inside"` - the popup will close on date selection, but not outside clicks.
     * * `"outside"` - the popup will close only on the outside click and not on date selection/inside clicks.
     *
     * @since 3.0.0
     */
    @Input() autoClose: boolean | 'inside' | 'outside';
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
    @Input() dayTemplateData: (date: AilDate, current: { year: number; month: number }) => any;
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
    @Input() markDisabled: (date: AilDate, current: { year: number; month: number }) => boolean;
    /**
     * The earliest date that can be displayed or selected. Also used for form validation.
     *
     * If not provided, 'year' select box will display 10 years before the current month.
     */
    @Input() minDate: AilDateStruct;
    /**
     * The latest date that can be displayed or selected. Also used for form validation.
     *
     * If not provided, 'year' select box will display 10 years after the current month.
     */
    @Input() maxDate: AilDateStruct;
    /**
     * Navigation type.
     *
     * * `"select"` - select boxes for month and navigation arrows
     * * `"arrows"` - only navigation arrows
     * * `"none"` - no navigation visible at all
     */
    @Input() navigation: 'select' | 'arrows' | 'none' = 'arrows';
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
     * The preferred placement of the datepicker popup.
     *
     * Possible values are `"top"`, `"top-left"`, `"top-right"`, `"bottom"`, `"bottom-left"`,
     * `"bottom-right"`, `"left"`, `"left-top"`, `"left-bottom"`, `"right"`, `"right-top"`,
     * `"right-bottom"`
     *
     * Accepts an array of strings or a string with space separated possible values.
     *
     * The default order of preference is `"bottom-left bottom-right top-left top-right"`
     *
     * Please see the [positioning overview](#/positioning) for more details.
     */
    @Input() placement: PlacementArray;

    /**
     * locale of the datepicker
     *
     * With default locale set to 'en', you can set the locale of the datepicker through this input.
     */
    /**
     * If `true`, when closing datepicker will focus element that was focused before datepicker was opened.
     *
     * Alternatively you could provide a selector or an `HTMLElement` to focus. If the element doesn't exist or invalid,
     * we'll fallback to focus document body.
     *
     * @since 5.2.0
     */
    @Input() restoreFocus: true | string | HTMLElement;
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
    @Input() startDate: { year: number; month: number; day?: number };
    /**
     * A selector specifying the element the datepicker popup should be appended to.
     *
     * Currently only supports `"body"`.
     */
    @Input() container: string;
    /**
     * A css selector or html element specifying the element the datepicker popup should be positioned against.
     *
     * By default the input is used as a target.
     *
     * @since 4.2.0
     */
    @Input() positionTarget: string | HTMLElement;
    /**
     * An event emitted when user selects a date using keyboard or mouse.
     *
     * The payload of the event is currently selected `AilDate`.
     *
     * @since 1.1.1
     */
    @Output() dateSelect = new EventEmitter<AilDate>();
    /**
     * An event emitted when user selects a locale it returns the expected input format.
     *
     * The payload of the event is currently selected `AilDate`.
     *
     * @since 1.1.1
     */

    @Output() inputFormat = new EventEmitter<string>();
    /**
     * Event emitted right after the navigation happens and displayed month changes.
     *
     * See [`AilDatepickerNavigateEvent`](#/components/datepicker/api#AilDatepickerNavigateEvent) for the payload info.
     */
    @Output() navigate = new EventEmitter<AilDatepickerNavigateEvent>();
    /**
     * An event fired after closing datepicker window.
     *
     * @since 4.2.0
     */
    @Output() closed = new EventEmitter<void>();
    /**
     * @ignore
     */
    @ViewChild('datepicker', { static: true }) datepickerRef: ElementRef;
    /**
     * @ignore
     */
    private _cRef: ComponentRef<AilDatepicker> = null;
    /**
     * @ignore
     */
    private _elWithFocus = null;
    /**
     * @ignore
     */
    private _model: AilDate;
    /**
     * @ignore
     */
    private _inputValue: string;
    /**
     * @ignore
     */
    private _zoneSubscription: any;
    /**
     * @ignore
     */
    private _locale = 'en';

    /**
     * @ignore
     */
    private _disabled = false;

    /**
     * disables date selection
     */
    @Input()
    get disabled() {
        return this._disabled;
    }

    /**
     * @ignore
     */
    constructor(
        private _parserFormatter: AilDateParserFormatter,
        private _elRef: ElementRef<HTMLInputElement>,
        private _vcRef: ViewContainerRef,
        private _renderer: Renderer2,
        private _cfr: ComponentFactoryResolver,
        private _ngZone: NgZone,
        private _calendar: AilCalendar,
        private _dateAdapter: AilDateAdapter<any>,
        @Inject(DOCUMENT) private _document: any,
        private _changeDetector: ChangeDetectorRef,
        config: AilInputDatepickerConfig,
        public liveAnnouncer: LiveAnnouncer
    ) {
        ['autoClose', 'container', 'positionTarget', 'placement'].forEach((input) => (this[input] = config[input]));
        this._zoneSubscription = _ngZone.onStable.subscribe(() => this._updatePopupPosition());
    }

    set disabled(value: any) {
        this._disabled = value === '' || (value && value !== 'false');

        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(this._disabled);
        }
    }

    /**
     * locale of the datepicker
     *
     * With default locale set to 'en', you can set the locale of the datepicker through this input.
     */
    @Input()
    get locale() {
        return this._locale;
    }

    set locale(value: string) {
        if (value && aileroni18nTranslations[value]) {
            this._locale = value;
            this.inputFormat.emit(aileroni18nTranslations[this.locale].dateFormat);
        } else if (value && rollUpLocales[value]) {
            for (const locale of rollUpLocales[value]) {
                const mappingLocale = locale;
                if (aileroni18nTranslations[mappingLocale]) {
                    this._locale = mappingLocale;
                    this.inputFormat.emit(aileroni18nTranslations[this.locale].dateFormat);
                    // console.warn(`Datepicker Input() locale ${value} is not available and ${this._locale} is being used instead`);
                    break;
                }
            }
        } else {
            this._locale = 'en';
            this.inputFormat.emit(aileroni18nTranslations[this.locale].dateFormat);
            // console.warn(`Datepicker Input() locale ${value} is not available and ${this._locale} is being used instead`);
        }
    }

    /**
     * @ignore
     */
    registerOnChange(fn: (value: any) => any): void {
        this._onChange = fn;
    }

    /**
     * @ignore
     */
    registerOnTouched(fn: () => any): void {
        this._onTouched = fn;
    }

    /**
     * @ignore
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * @ignore
     */
    writeValue(value) {
        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    }

    /**
     * @ignore
     */
    registerOnValidatorChange(fn: () => void): void {
        this._validatorChange = fn;
    }

    /**
     * @ignore
     */
    validate(c: AbstractControl): { [key: string]: any } {
        const value = c.value;

        if (value === null || value === undefined) {
            return null;
        }

        const Date = this._fromDateStruct(this._dateAdapter.fromModel(value));

        if (!this._calendar.isValid(Date)) {
            return { Date: { invalid: c.value } };
        }

        if (this.minDate && Date.before(AilDate.from(this.minDate))) {
            return { Date: { requiredBefore: this.minDate } };
        }

        if (this.maxDate && Date.after(AilDate.from(this.maxDate))) {
            return { Date: { requiredAfter: this.maxDate } };
        }
    }

    /**
     * @ignore
     */
    manualDateChange(value: string, updateView = false) {
        const inputValueChanged = value !== this._inputValue;
        if (inputValueChanged) {
            this._inputValue = value;
            this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        }
        if (inputValueChanged || !updateView) {
            this._onChange(this._model ? this._dateAdapter.toModel(this._model) : value === '' ? null : value);
        }
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    }

    /**
     * @ignore
     */
    isOpen() {
        return !!this._cRef;
    }

    /**
     * Opens the datepicker popup.
     *
     * If the related form control contains a valid date, the corresponding month will be opened.
     */
    open() {
        if (!this.isOpen()) {
            const cf = this._cfr.resolveComponentFactory(AilDatepicker);
            this._cRef = this._vcRef.createComponent(cf);

            // passing in reference of this directive and setting variable datepickerRef in the datepicker component
            this._cRef.instance.datepickerRef = this;

            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.locale = this.locale;

            if (window.innerWidth < BREAKPOINTS.large) {
                this._cRef.instance.displayMonths = 12;
                this._cRef.instance.navigation = 'none';
            } else {
                this._cRef.instance.displayMonths = 2;
                this._cRef.instance.navigation = 'arrows';
            }

            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));

            // date selection event handling
            this._cRef.instance.registerOnChange((selectedDate) => {
                this.writeValue(selectedDate);
                this._onChange(selectedDate);
                this._onTouched();
            });

            this._cRef.changeDetectorRef.detectChanges();

            this._cRef.instance.setDisabledState(this.disabled);

            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
            }

            // focus handling
            this._elWithFocus = this._document.activeElement;
            ailFocusTrap(this._ngZone, this._cRef.location.nativeElement, this.closed, true);
            this._cRef.instance.focus();

            AutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this.closed, [], [this._elRef.nativeElement, this._cRef.location.nativeElement]);
        }
    }

    /**
     * Closes the datepicker popup.
     */
    close() {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
            this.closed.emit();
            this._changeDetector.markForCheck();

            // restore focus
            let elementToFocus = this._elWithFocus;
            if (isString(this.restoreFocus)) {
                elementToFocus = this._document.querySelector(this.restoreFocus);
            } else if (this.restoreFocus !== undefined) {
                elementToFocus = this.restoreFocus;
            }

            this.liveAnnouncer.announce('datepicker is now closed');

            // in IE document.activeElement can contain an object without 'focus()' sometimes
            if (elementToFocus && elementToFocus.focus) {
                elementToFocus.focus();
            } else {
                this._document.body.focus();
            }
        }
    }

    /**
     * Toggles the datepicker popup.
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
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
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    }

    /**
     * @ignore
     */
    onBlur() {
        this._onTouched();
    }

    /**
     * @ignore
     */
    onFocus() {
        this._elWithFocus = this._elRef.nativeElement;
    }

    /**
     * @ignore
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.minDate || changes.maxDate) {
            this._validatorChange();
        }
    }

    /**
     * @ignore
     */
    ngOnDestroy() {
        this.close();
        this._zoneSubscription.unsubscribe();
    }

    /**
     * @ignore
     */
    private _onChange = (_: any) => {
    };

    /**
     * @ignore
     */
    private _onTouched = () => {
    };

    /**
     * @ignore
     */
    private _validatorChange = () => {
    };

    /**
     * @ignore
     */
    private _applyDatepickerInputs(datepickerInstance: AilDatepicker): void {
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
            'showNavigation',
            'showWeekdays',
            'showWeekNumbers',
            'locale'
        ].forEach((optionName: string) => {
            if (this[optionName] !== undefined) {
                datepickerInstance[optionName] = this[optionName];
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    }

    /**
     * @ignore
     */
    private _applyPopupStyling(nativeElement: any) {
        this._renderer.addClass(nativeElement, 'show');

        if (this.container === 'body') {
            this._renderer.addClass(nativeElement, '-dp-body');
        }
    }

    /**
     * @ignore
     */
    private _subscribeForDatepickerOutputs(datepickerInstance: AilDatepicker) {
        datepickerInstance.navigate.subscribe((navigateEvent) => this.navigate.emit(navigateEvent));
        datepickerInstance.dateSelect.subscribe((date) => {
            this.dateSelect.emit(date);
            if (this.autoClose === true || this.autoClose === 'inside') {
                this.close();
            }
        });
    }

    /**
     * @ignore
     */
    private _writeModelValue(model: AilDate) {
        const value = this._parserFormatter.format(model);
        this._inputValue = value;
        this._renderer.setProperty(this._elRef.nativeElement, 'value', value);
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    }

    /**
     * @ignore
     */
    private _fromDateStruct(date: AilDateStruct): AilDate {
        const Date = date ? new AilDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(Date) ? Date : null;
    }

    /**
     * @ignore
     */
    private _updatePopupPosition() {
        if (!this._cRef) {
            return;
        }

        let hostElement: HTMLElement;
        if (isString(this.positionTarget)) {
            hostElement = this._document.querySelector(this.positionTarget);
        } else if (this.positionTarget instanceof HTMLElement) {
            hostElement = this.positionTarget;
        } else {
            hostElement = this._elRef.nativeElement;
        }

        if (this.positionTarget && !hostElement) {
            throw new Error('ailDatepicker could not find element declared in [positionTarget] to position against.');
        }

        positionElements(hostElement, this._cRef.location.nativeElement, this.placement, this.container === 'body');
    }
}
