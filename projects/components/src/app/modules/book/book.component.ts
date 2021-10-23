import { Dialog, DialogConfig } from '@aileron/components';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '@core/services';
import { dateRangeValidator, maxDateValidator, minDateValidator, returnTripValidator } from '@core/validators';
import { Book } from '@modules/book/book';
import { BookResponse, ReservationInfo, TRIP_TYPE } from '@modules/book/book-response';
import { PreviousSearchesService } from '@modules/book/previous-searches.service';
import { RecentSearch } from '@modules/book/recent-search';
import { SUPPORTED_LOCALES } from '@modules/translations.module';
import { AirportAutocompleteComponent, AirportDialogComponent, AirportService } from '@shared/components/airport';
import { AilDate, AilInputDatepicker, BREAKPOINTS } from '@shared/components/datepicker';
import { I18NEXT_SERVICE, I18NextPipe, ITranslationService } from 'angular-i18next';
import { environment } from 'env';
import moment from 'moment';
import { NGXLogger } from 'ngx-logger';
import { MarkdownService } from 'ngx-markdown';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, distinctUntilChanged } from 'rxjs/operators';
import { BookService } from './book.service';
import { BookingDatepickerConfig } from './booking-datepicker-config';

export const CONSTANTS = {
    FORM_NAME: 'flight',
    FORM_FIELD_TRIP_TYPE: 'tripType',
    FORM_FIELD_ORIGIN_AIRPORT: 'originAirport',
    FORM_FIELD_DESTINATION_AIRPORT: 'destinationAirport',
    FORM_FIELD_DEPART_DATE: 'departDate',
    FORM_FIELD_RETURN_DATE: 'returnDate',
    FORM_FIELD_PASSENGER_COUNT: 'passengerCount',
    FORM_FIELD_FARE_PREFERENCE: 'farePreference',
    FORM_FIELD_REDEEM_MILES: 'redeemMiles',
    FORM_FIELD_AIRPASS: 'airPass',
    FORM_FIELD_TRIP_LINK: 'tripLink',
    ROUND_TRIP_HOTEL: 'roundTripHotel',
    DATE_FORMAT: 'mm/dd/yyyy',
    LS_FLIGHT_SEARCH: 'AA_FlightSearch',
    LS_I18N_LANG: 'i18nextLng',
    PASSENGER_COUNT_SINGLE: ['1'],
    PASSENGER_COUNT_TWO: ['1', '2'],
    PASSENGER_COUNT_MAX: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
};

@Component({
    selector: 'hp-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.scss'],
    providers: [MarkdownService]
})
export class BookComponent implements OnInit, OnDestroy, AfterViewChecked {
    /**
     * Datepicker Input's templateref
     */
    @ViewChild(AilInputDatepicker) ailInputDatepickerRef: AilInputDatepicker;
    @ViewChild(CONSTANTS.FORM_FIELD_AIRPASS, { read: ElementRef }) airPassControl: ElementRef;
    @ViewChild(CONSTANTS.FORM_FIELD_DEPART_DATE, { read: ElementRef }) departDateControl: ElementRef;
    @ViewChild(CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT, { read: ElementRef }) originAirportControl: ElementRef;
    @ViewChild(CONSTANTS.FORM_FIELD_PASSENGER_COUNT, { read: ElementRef }) passengerCountControl: ElementRef;
    @ViewChild(CONSTANTS.FORM_FIELD_REDEEM_MILES, { read: ElementRef }) redeemMilesControl: ElementRef;
    @ViewChild(CONSTANTS.FORM_FIELD_RETURN_DATE, { read: ElementRef }) returnDateControl: ElementRef;
    @ViewChild(CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT, { read: ElementRef }) destinationAirportControl: ElementRef;
    @ViewChild(CONSTANTS.FORM_FIELD_TRIP_LINK, { read: ElementRef }) tripLinkControl: ElementRef;
    @ViewChild('errorCounts', { read: ElementRef }) errorCountControl: ElementRef;
    @ViewChild('originAirportAutoComplete', { read: AirportAutocompleteComponent }) originAirportAutoComplete: AirportAutocompleteComponent;
    @ViewChild('destinationAirportAutoComplete', { read: AirportAutocompleteComponent }) destinationAirportAutoComplete: AirportAutocompleteComponent;

    public isDev = !environment.production;
    public airPassChecked: boolean;
    public datePickerConfig: any;
    public errorMessage = '';
    public inputForm: FormGroup;
    public inputFormInitialized: boolean = false;
    public isAirPassMember: boolean = false;
    public isTripLink: boolean = false;
    public loader: boolean;
    public maxDateValue: moment.Moment;
    public minDateValue: moment.Moment;
    public passengerCountList = CONSTANTS.PASSENGER_COUNT_MAX;
    public redeemMilesChecked: boolean = false;
    public submitted = false;
    public tripLinkChecked: boolean = false;
    public disableRedeemMiles: boolean = false;
    public disableCorporateBooking: boolean = false;
    public disableAirPass: boolean = false;
    public disablePassengerCount: boolean = false;
    public vacationLinkURL: string;

    private _airPassPassengerList: string[];
    private _airportSelectionEvent = new EventEmitter();
    private _dateFieldClicked: any;
    private _dateFormat: string = CONSTANTS.DATE_FORMAT;
    private _isAirPassCompanionAllowed: boolean;
    private _reservationView: ReservationInfo;
    private _resizeSubscription: Subscription;
    private _screenSize;
    private _windowSize;

    /**
     * Dialog config data
     */
    private _dialogData = {
        title: '',
        message: '',
        countries: [],
        source: '',
        selectionEvent: this._airportSelectionEvent
    };

    private _airportSelectionSubscription: Subscription;

    /**
     * Dialog config of type IDialogConfig
     */
    private _airportDialogConfig: DialogConfig = {

        /**
         * Optional
         * The `id` attribute value.
         * */
        id: 'sample-dialog-1',

        /**
         * Optional
         * The data, if any, to pass along to the dialog.
         * */
        data: this._dialogData,

        ariaCloseLabel: 'close'
    };

    constructor(
        @Inject(I18NEXT_SERVICE) private _i18NextService: ITranslationService,
        private _bookService: BookService,
        private _changeRef: ChangeDetectorRef,
        private _airportService: AirportService,
        private _datePickerService: BookingDatepickerConfig,
        private _elementRef: ElementRef,
        private _formBuilder: FormBuilder,
        private _i18NextPipe: I18NextPipe,
        private _markdownService: MarkdownService,
        private _localStorageService: LocalStorageService,
        private _window: Window,
        private _logger: NGXLogger,
        public airportDialog: Dialog,
        private _previousSearchesService: PreviousSearchesService
    ) {
        this.disableDates = this.disableDates.bind(this);
        this._screenSize = this._window.innerWidth;
        this._windowSize = new BehaviorSubject<number>(this._window.innerWidth);
        this.maxDateValue = this._datePickerService.computeMaxDate();
        this.minDateValue = this._datePickerService.computeMinDate(false);
        this._initForm();
    }

    ngOnInit(): void {
        this.inputFormInitialized = true;

        this._i18NextService.events.initialized.subscribe(data => {
            if (data) {
                this.loadNamespaces();
            }
        });

        const locale = localStorage.getItem(CONSTANTS.LS_I18N_LANG);
        // this._adapter.setLocale(locale);

        // const flightSearch = "[{\"elementID\":\"DFW to LAX Mar 8 - Mar 27\",\"originAirport\":\"DFW\",\"originTravelDate\":{\"dateTime\":\"2021-03-08T06:00:00.000Z\",\"year\":2021,\"monthOfYear\":3,\"dayOfMonth\":8},\"destinationAirport\":\"LAX\",\"destinationTravelDate\":{\"dateTime\":\"2021-03-27T05:00:00.000Z\",\"year\":2021,\"monthOfYear\":3,\"dayOfMonth\":27},\"createDate\":\"2021-02-13T00:15:18.172Z\",\"tripType\":\"roundTrip\",\"awardBooking\":false,\"expired\":false}]";
        // const recentSearches: RecentSearch[] = JSON.parse(flightSearch);
        // console.log(recentSearches);
        // recentSearches.destinationAirport("LAX");
        // localStorage.setItem(this.LS_FLIGHT_SEARCH, JSON.stringify(recentSearches));

        this._airportService.getAllCountries(locale).subscribe(rs => {
            this._dialogData.countries = rs;
        });

        /**
         * Setting datepicker config on initialization, pass in the right FormGroup
         */
        this.datePickerConfig = this._datePickerService.config;
        this._datePickerService.form = this.inputForm;

        this._bookService.checkBook().pipe(catchError(err => {
            this._logger.error(err);
            return throwError(err);
        })).subscribe(({ airPassMember = false, airPassCompanionAllowed = false, tripLink = false, reservationView }: BookResponse) => {
            this.isAirPassMember = airPassMember;
            this._isAirPassCompanionAllowed = airPassCompanionAllowed;
            this.isTripLink = tripLink;
            this._reservationView = reservationView;

            this._changeRef.detectChanges();
            this._populatePreviousSearch();
        }, e => {
            this._logger.error(e);
        });

        this._airportSelectionSubscription = this._airportSelectionEvent.subscribe((data) => {
            if (data) {
                if (this._airportDialogConfig.data.source === CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT) {
                    this.inputForm.controls[CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT].setValue(data);
                } else if (this._airportDialogConfig.data.source === CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT) {
                    this.inputForm.controls[CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT].setValue(data);
                }
            }
        });

    }

    /**
     * Watches window resize
     */
    @HostListener('window:resize', ['$event.target.innerWidth'])
    public onResize(width: number) {
        this._windowSize.next(width);
    }

    public translate(key: string, isMarkdown = false, options = {}): string {
        const opts = { ...options, returnObjects: true, escapeValue: false };
        if (isMarkdown) {
            return this._markdownService.compile(this._i18NextPipe.transform(key, opts));
        }
        return this._i18NextPipe.transform(key, opts);
    }

    public submitForm() {
        if (!this._isAirportAutocompleteActive()) {
            this.submitted = true;
            this.inputForm.markAllAsTouched(); // Needed in order to set invalid fields red if they haven't been touched

            if (this.errorCount() > 0) {
                // eslint-disable-next-line angular/timeout-service
                setTimeout(() => {
                    this.errorCountControl?.nativeElement.querySelector('a').focus(); // this will make the execution after the above boolean has changed
                }, 100);
            } else if (this.onVacationTab()) {
                this.vacationLink();
            } else {
                const book: Book = {
                    flight: CONSTANTS.FORM_NAME,
                    tripType: this.inputForm.controls[CONSTANTS.FORM_FIELD_TRIP_TYPE].value,
                    originAirport: this.inputForm.controls[CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT].value,
                    destinationAirport: this.inputForm.controls[CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT].value,
                    departDate: this.inputForm.controls[CONSTANTS.FORM_FIELD_DEPART_DATE].value,
                    returnDate: this.inputForm.controls[CONSTANTS.FORM_FIELD_RETURN_DATE].value,
                    passengerCount: this.inputForm.controls[CONSTANTS.FORM_FIELD_PASSENGER_COUNT].value,
                    farePreference: this.inputForm.controls[CONSTANTS.FORM_FIELD_FARE_PREFERENCE].value,
                    dateFormat: CONSTANTS.DATE_FORMAT,
                    showMoreOptions: 'false'
                };

                if (this.inputForm.controls[CONSTANTS.FORM_FIELD_REDEEM_MILES].value == 'true') {
                    book.redeemMiles = true;
                } else if (this.isAirPassMember && this.inputForm.controls[CONSTANTS.FORM_FIELD_AIRPASS].value === true) {
                    book.airpass = true;
                } else if (this.isTripLink && this.inputForm.controls[CONSTANTS.FORM_FIELD_TRIP_LINK].value === true) {
                    book.tripLink = true;
                }

                const destinationDate: moment.Moment = moment(book.departDate);
                const returnDate: moment.Moment = moment(book.returnDate);

                const elementId = book.tripType === TRIP_TYPE.ONE_WAY ? `${book.originAirport.toUpperCase()} to ${book.destinationAirport.toUpperCase()} ${destinationDate.format('MMM')} ${destinationDate.day()}` :
                    `${book.originAirport.toUpperCase()} to ${book.destinationAirport.toUpperCase()} ${destinationDate.format('MMM')} ${destinationDate.day()} - ${returnDate.format('MMM')} ${returnDate.day()}`;

                const currentSearch: RecentSearch = {
                    awardBooking: book.redeemMiles || false,
                    createDate: new Date().toString(),
                    destinationAirport: book.destinationAirport,
                    destinationTravelDate: {
                        dateTime: returnDate.format(),
                        dayOfMonth: returnDate.date(),
                        monthOfYear: returnDate.month() + 1,
                        year: returnDate.year()
                    },
                    elementID: elementId,
                    expired: false,
                    originAirport: book.originAirport,
                    originTravelDate: {
                        dateTime: destinationDate.format(),
                        dayOfMonth: destinationDate.date(),
                        monthOfYear: destinationDate.month() + 1,
                        year: destinationDate.year()
                    },
                    tripType: book.tripType
                };

                this._updateRecentSearches(currentSearch);

                this.loader = true; //This loader will automatically stops once the page redirects to the search results

                this._bookService.searchFlights(book);
            }
        }
    }

    /**
     * Used for local dev only
     */

    /* istanbul ignore next */
    public toggleLocale() {
        const languageIndex = SUPPORTED_LOCALES.findIndex(locale => locale === this._i18NextService.language);
        const nextIndex = languageIndex <= SUPPORTED_LOCALES.length ? languageIndex + 1 : 0;
        this._i18NextService.changeLanguage(SUPPORTED_LOCALES[nextIndex]).then((r) => {
            this._logger.info(r);
            // success
            // this._adapter.setLocale(r);
        });
    }

    //  used for quick testing
    /* istanbul ignore next */
    public loadTrip(date: number = 0,
                    tripType = 'roundTrip',
                    originAirport = 'DFW',
                    destinationAirport = 'LAX',
                    passengerCount = 1) {
        const departDate = moment().add(date, 'day').format('L');
        const returnDate = moment().add(date + 1, 'day').format('L');
        this.inputForm.patchValue({
            departDate,
            returnDate,
            tripType,
            originAirport,
            destinationAirport,
            passengerCount
        }, { emitEvent: true });
    }

    /* istanbul ignore next */
    public loadAirpass() {
        this.isAirPassMember = true;
        this.inputForm.patchValue({
            airPass: true
        });
        this._changeRef.detectChanges();
        this.airPassControl.nativeElement.children[0]?.click();
    }

    /**
     * @ignore
     */
    resizeObserver = () => {
        return this._windowSize.asObservable();
    };

    ngAfterViewChecked() {
        this._datepickerResizeWatch();
    }

    ngOnDestroy() {
        if (this._resizeSubscription) {
            this._resizeSubscription.unsubscribe();
        }
        if (this._airportSelectionSubscription) this._airportSelectionSubscription.unsubscribe();
    }

    public loadNamespaces(): void {
        this._i18NextService.loadNamespaces(['common', 'error']).then(() => {
            // console.log("loaded namespaces:" + r);
            // console.log("default language:" + this.i18NextService.languages[0]);
            // console.log("Translating key tabs.book" + this.i18NextPipe.transform("tabs.book", {}));
            // this.tabsInitialized = true;
            // this._dateFormat = this.i18NextPipe.transform('dateFormats.short');
            this._changeRef.detectChanges();
        });
    }

    public showDialog(source: string) {
        this._airportDialogConfig.data.source = source;
        this.airportDialog.open(AirportDialogComponent, this._airportDialogConfig);
    }

    public radioTripTypeChange(e: Event) {
        this.submitted = false;
        this.inputForm.markAsUntouched();
    }

    public travelTypeChange(e: Event) {
        this.submitted = false;
        this.inputForm.markAsUntouched();
        // Vacation packages number of passengers default value code is commented out per Stephanie's request
        // if(e.target.value === CONSTANTS.ROUND_TRIP_HOTEL && this.inputForm.controls[CONSTANTS.FORM_FIELD_PASSENGER_COUNT].value === "1") {
        //     this.inputForm.controls[CONSTANTS.FORM_FIELD_PASSENGER_COUNT].setValue("2");
        // }
    }

    /* istanbul ignore next */
    public loadCorporateBooking() {
        this.isTripLink = true;
        if (!this.isAirPassMember) {
            this.inputForm.patchValue({
                tripLink: true
            });
            this._changeRef.detectChanges();
            this.tripLinkControl.nativeElement.children[0]?.click();
        }
    }

    public selectAirportAutoComplete(value: any, field: string) {
        if (field == CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT) {
            this.inputForm.controls[CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT].setValue(value);
        } else if (field == CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT) {
            this.inputForm.controls[CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT].setValue(value);
        }
    }

    public showReturnDate(): boolean {
        if (this.inputForm.get(CONSTANTS.FORM_NAME).value === CONSTANTS.ROUND_TRIP_HOTEL) return true;

        return this.inputForm.get(CONSTANTS.FORM_FIELD_TRIP_TYPE).value === 'roundTrip';
    }

    public onFlightTab(): boolean {
        const onFlightTab: boolean = this.inputForm.get(CONSTANTS.FORM_NAME).value === CONSTANTS.FORM_NAME;
        if (onFlightTab) this.minDateValue = this._datePickerService.computeMinDate(false);
        return onFlightTab;
    }

    public onVacationTab(): boolean {
        const onVacationTab: boolean = this.inputForm && this.inputForm.get(CONSTANTS.FORM_NAME).value === CONSTANTS.ROUND_TRIP_HOTEL;
        if (onVacationTab) this.minDateValue = this._datePickerService.computeMinDate(true);
        return onVacationTab;
    }

    public canViewVacationOffer(): boolean {
        return !(localStorage.getItem(CONSTANTS.LS_I18N_LANG) && localStorage.getItem(CONSTANTS.LS_I18N_LANG).startsWith('pt'));
    }

    public vacationLink() {
        this.vacationLinkURL = `https://www.aavacations.com/deeplink?ADID=AACM-DEP-ALL-09-01&searchType=matrix&adults=${this.inputForm.get(CONSTANTS.FORM_FIELD_PASSENGER_COUNT).value}&rooms=1&serviceclass=${this.inputForm.get(CONSTANTS.FORM_FIELD_FARE_PREFERENCE).value}&from_date=${this.inputForm.get(CONSTANTS.FORM_FIELD_DEPART_DATE).value}&to_date=${this.inputForm.get(CONSTANTS.FORM_FIELD_RETURN_DATE).value}&from_city_code=${this.inputForm.get(CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT).value}&to_city_code=${this.inputForm.get(CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT).value}&to_time=0&from_time=0`
        this._window.open(this.vacationLinkURL);
    }

    public toggleCalendar(dateRange, field) {
        this._dateFieldClicked = field;
        dateRange.toggle();
    }

    public dateSelection(date: AilDate) {
        if (this._datePickerService.onDateSelections(this._dateFieldClicked, date)) {
            this.ailInputDatepickerRef.close();
        }
    }

    public errorDate(dateField) {
        const errorDate = new Date(dateField.year, dateField.month - 1, dateField.day);

        errorDate.setDate(errorDate.getDate() - 331);

        return {
            year: errorDate.getFullYear(),
            month: errorDate.getMonth() + 1,
            day: errorDate.getDate()
        };
    }

    public getDepartDateError() {
        if (!this.submitted) return null;

        const field = this.inputForm.get(CONSTANTS.FORM_FIELD_DEPART_DATE);

        if (field.hasError('required')) return {
            id: 'departDateRequired',
            errorMessage: this.translate('error:ERRCODE1259')
        };
        if (field.hasError('dateBeforeMin')) return {
            id: 'departDateBeforeMin',
            errorMessage: this.translate('error:ERRCODE1260')
        };
        if (field.hasError('datePastMax')) {
            const date = this.errorDate(this._datePickerService.parseDate(field.value));
            return {
                id: 'departDateDatePastMax',
                errorMessage: this.translate('error:ERRCODE1356') + ' ' + this._datePickerService.formatDateLong(
                    new AilDate(date.year, date.month, date.day)
                )
            };
        }
    }

    public getReturnDateError() {
        if (this.inputForm.get(CONSTANTS.FORM_FIELD_RETURN_DATE).touched && !this.submitted) return {
            id: null, errorMessage: null
        };

        if (!this.submitted) return null;

        const field = this.inputForm.get(CONSTANTS.FORM_FIELD_RETURN_DATE);

        if (this.inputForm.hasError('returnTripRequired')) return {
            id: 'returnDateRequired',
            errorMessage: this.translate('error:ERRCODE1259')
        };
        if (field.hasError('datePastMax')) {
            const date = this.errorDate(this._datePickerService.parseDate(field.value));

            return {
                id: 'returnDateDatePastMax',
                errorMessage: this.translate('error:ERRCODE1356') + ' ' + this._datePickerService.formatDateLong(
                    new AilDate(date.year, date.month, date.day)
                )
            };
        }
        if (field.hasError('dateBeforeMin') || this.inputForm.hasError('invalidDateRange')) return {
            id: 'departDateInvalid',
            errorMessage: this.translate('error:ERRCODE1260')
        };
    }

    public getDestinationAirportError() {
        if (!this.submitted) return null;

        const field = this.inputForm.get(CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT);

        if (field.hasError('required')) return {
            id: 'destinationAirportRequired',
            errorMessage: this.translate('error:ERRCODE1257')
        };
        if (['minlength', 'maxlength', 'pattern'].some(error => field.hasError(error))) return {
            id: 'destinationAirportInvalid',
            errorMessage: this.translate('error:ERRCODE1258')
        };
    }

    public getOriginAirportError() {
        if (!this.submitted) return null;

        const field = this.inputForm.get(CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT);

        if (field.hasError('required')) return {
            id: 'originAirportRequired',
            errorMessage: this.translate('error:ERRCODE1256')
        };
        if (['minlength', 'maxlength', 'pattern'].some(error => field.hasError(error))) return {
            id: 'originAirportInvalid',
            errorMessage: this.translate('error:ERRCODE1258')
        };
    }

    public errors(): any[] {
        const errors = [];

        if (this.getOriginAirportError()) {
            errors.push(CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT);
        }

        if (this.getDestinationAirportError()) {
            errors.push(CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT);
        }

        if (this.getDepartDateError()) {
            errors.push(CONSTANTS.FORM_FIELD_DEPART_DATE);
        }

        if (this.getReturnDateError()) {
            errors.push(CONSTANTS.FORM_FIELD_RETURN_DATE);
        }

        if (errors.length == 1) {
            this.errorMessage = this.translate('error:ERRCODE408.messageWithCount',
                false, { count: errors.length, errorField: errors[0] });
        } else {
            this.errorMessage = this.translate('error:ERRCODE408.messageWithCount_plural',
                false, { count: errors.length, errorField: errors[0] });
        }

        return errors;
    }

    public errorCount(): number {
        return this.errors().length;
    }

    public changeFocus() {
        switch (this.errors()[0]) {
            case CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT: {
                const originAirportInput = this.originAirportControl.nativeElement;
                originAirportInput.focus();
                break;
            }
            case CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT: {
                const destinationAirportInput = this.destinationAirportControl.nativeElement;
                destinationAirportInput.focus();
                break;
            }
            case CONSTANTS.FORM_FIELD_DEPART_DATE: {
                const departDateInput = this.departDateControl.nativeElement;
                departDateInput.focus();
                break;
            }
            case CONSTANTS.FORM_FIELD_RETURN_DATE: {
                const returnDateInput = this.returnDateControl.nativeElement;
                returnDateInput.focus();
                break;
            }
        }
    }

    /**
     * testing methods for localstorage
     */

    /* istanbul ignore next */
    public storeToLocal() {
        this._updateRecentSearches(this._previousSearchesService._getPreviousSearches(CONSTANTS.LS_FLIGHT_SEARCH));
    }

    /**
     * testing methods for localstorage
     */

    /* istanbul ignore next */
    public readLocal() {
        const values: any[] = this._previousSearchesService._getPreviousSearches(CONSTANTS.LS_FLIGHT_SEARCH);
        this._logger.debug(values);
    }

    /**
     * testing methods for localstorage
     */

    /* istanbul ignore next */
    public deleteLocal() {
        this._localStorageService.remove(CONSTANTS.LS_FLIGHT_SEARCH);
    }

    private _updateRecentSearches(newSearch: RecentSearch) {
        this._logger.debug('*** Adding Recent Search ***');
        const values = this._previousSearchesService._getPreviousSearches(CONSTANTS.LS_FLIGHT_SEARCH) || [];

        //  go thru values and check if elementID exists, if so don't
        const updatedValues = values.filter((search: RecentSearch) => newSearch.elementID !== search.elementID);

        //  add new search entry at the top
        updatedValues.unshift(newSearch);

        //  only store last 5 searches
        const newSearchResults = updatedValues.length > 5 ? updatedValues.slice(0, 5) : updatedValues;

        this._localStorageService.set(CONSTANTS.LS_FLIGHT_SEARCH, JSON.stringify(newSearchResults));
    }

    public tripLinkValueChanged(airPassInput, tripLinkInput) {
        this._changeRef.detectChanges();
        if (tripLinkInput.nativeElement.firstChild.control.checked === true) {
            this.passengerCountList = CONSTANTS.PASSENGER_COUNT_SINGLE;
            this.disablePassengerCount = true;

            if (this.isAirPassMember) {
                this.disableAirPass = true;
            }
            this.disableRedeemMiles = true;
        } else if (tripLinkInput.nativeElement.firstChild.control.checked === false) {
            if (this.isAirPassMember) {
                this.passengerCountList = this._airPassPassengerList;
                this.disableAirPass = false;
            }
            this.passengerCountList = CONSTANTS.PASSENGER_COUNT_MAX;
            this.disablePassengerCount = false;
            this.disableRedeemMiles = false;
        }
    }

    public airPassValueChanged(airPassInput, tripLinkInput) {
        this._changeRef.detectChanges();
        if (airPassInput.nativeElement.firstChild.control.checked === true) {
            this.passengerCountList = CONSTANTS.PASSENGER_COUNT_TWO;

            if (!this._isAirPassCompanionAllowed) {
                this.passengerCountList = CONSTANTS.PASSENGER_COUNT_SINGLE;
                this.disablePassengerCount = true;
            }

            if (this.isTripLink) {
                this.disableCorporateBooking = true;
            }
            this.disableRedeemMiles = true;
        } else if (airPassInput.nativeElement.firstChild.control.checked === false) {
            this.passengerCountList = CONSTANTS.PASSENGER_COUNT_MAX;
            this.disablePassengerCount = false;

            if (this.isTripLink) {
                this.disableCorporateBooking = false;
            }
            this.disableRedeemMiles = false;
        }
    }

    public redeemMilesValueChanged() {
        this._changeRef.detectChanges();
        if (this.redeemMilesControl.nativeElement.value === 'true' || this.redeemMilesControl.nativeElement.firstChild?.control.checked) {
            if (this.isAirPassMember) {
                this.disableAirPass = true;
            }
            if (this.isTripLink) {
                this.disableCorporateBooking = true;
            }
        } else if (this.redeemMilesControl.nativeElement.value === 'false'|| !this.redeemMilesControl.nativeElement.firstChild?.control.checked) {
            if (this.isAirPassMember) {
                this.disableAirPass = false;
            }
            if (this.isTripLink) {
                this.disableCorporateBooking = false;
            }
        }
    }

    public getTripLinkInput() {
        let tripLinkInput = null;
        if (this.isTripLink) {
            tripLinkInput = this.tripLinkControl.nativeElement.querySelector('input');

            this.passengerCountList = CONSTANTS.PASSENGER_COUNT_SINGLE;
            this.passengerCountControl.nativeElement.disable = true;
            // passengerCountInput.disabled = true;

            tripLinkInput.checked = true;
            this.inputForm.patchValue({
                tripLink: true
            });
            this.redeemMilesControl.nativeElement.disable = true;
        }
        return tripLinkInput;
    }

    public getAirPassInput() {
        let airPassInput = null;
        if (this.isAirPassMember) {
            airPassInput = this.airPassControl.nativeElement.querySelector('input');

            this._airPassPassengerList = this._isAirPassCompanionAllowed ? CONSTANTS.PASSENGER_COUNT_TWO : CONSTANTS.PASSENGER_COUNT_SINGLE;
            this.passengerCountList = this._airPassPassengerList;

            if (!this._isAirPassCompanionAllowed) {
                this.inputForm.controls[CONSTANTS.FORM_FIELD_PASSENGER_COUNT].disable();
                // passengerCountInput.disabled = true;
            }
            this.airPassChecked = true;
            this.inputForm.patchValue({
                airPass: true
            });

            this.redeemMilesControl.nativeElement.disable = true;
        }
        return airPassInput;
    }

    private _populatePreviousSearch() {
        const lastSearch: RecentSearch = this._previousSearchesService.getLastSearch(this._reservationView);
        // console.table(lastSearch);

        /*if (this._reservationView.redeemMiles !== null && this.onFlightTab()) {
            redeemMilesInput = this.redeemMilesControl.nativeElement.querySelector('input');
        }*/

        if (this._reservationView.adultPassengerCount > 1) {
            this.inputForm.controls[CONSTANTS.FORM_FIELD_PASSENGER_COUNT].setValue(this._reservationView.adultPassengerCount);
        }

        this.inputForm.controls[CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT].setValue(lastSearch.originAirport);
        this.inputForm.controls[CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT].setValue(lastSearch.destinationAirport);
        this.inputForm.controls[CONSTANTS.FORM_FIELD_TRIP_TYPE].setValue(lastSearch.tripType);
        this.inputForm.controls[CONSTANTS.FORM_FIELD_DEPART_DATE].setValue(lastSearch.originTravelDate.dateTime);
        this.inputForm.controls[CONSTANTS.FORM_FIELD_RETURN_DATE].setValue(lastSearch.destinationTravelDate.dateTime);

        const tripLinkInput = this.getTripLinkInput();
        const airPassInput = this.getAirPassInput();

        if (this.isTripLink && this.isAirPassMember) {
            this.redeemMilesControl.nativeElement.disable = true;
            tripLinkInput.checked = true;
            tripLinkInput.disabled = true;
            airPassInput.checked = true;
        }

        if (this.isTripLink) {
            this.tripLinkValueChanged(airPassInput, tripLinkInput);
        }

        if (this.isAirPassMember) {
            this.airPassValueChanged(airPassInput, tripLinkInput);
        }

        if (this.isAirPassMember || this.isTripLink) {
            this.redeemMilesValueChanged();
        }
    }

    private _initForm() {
        this.inputForm = this._formBuilder.group(
            {
                flight: [CONSTANTS.FORM_NAME],
                tripType: [TRIP_TYPE.ROUND_TRIP],
                redeemMiles: [false],
                airPass: [false],
                tripLink: [false],
                originAirport: ['', [
                    Validators.required,
                    Validators.pattern('[A-Za-z]*'),
                    Validators.maxLength(3),
                    Validators.minLength(3)
                ]],
                destinationAirport: ['', [
                    Validators.required,
                    Validators.pattern('[A-Za-z]*'),
                    Validators.maxLength(3),
                    Validators.minLength(3)
                ]],
                passengerCount: ['1'],
                departDate: ['', [
                    Validators.required,
                    minDateValidator(this.minDateValue, this._dateFormat),
                    maxDateValidator(this.maxDateValue, this._dateFormat)
                ]],
                returnDate: ['', [
                    minDateValidator(this.minDateValue, this._dateFormat),
                    maxDateValidator(this.maxDateValue, this._dateFormat)
                ]],
                farePreference: ['coach']
            },
            {
                validators:
                    [
                        returnTripValidator(CONSTANTS.FORM_FIELD_TRIP_TYPE, CONSTANTS.FORM_NAME, CONSTANTS.FORM_FIELD_RETURN_DATE),
                        dateRangeValidator(this._dateFormat, CONSTANTS.FORM_FIELD_DEPART_DATE, CONSTANTS.FORM_FIELD_RETURN_DATE)
                    ]
            }
        );
    }

    /**
     * Refreshes the datepicker
     */
    private _refreshDatepicker(): void {
        if (this.ailInputDatepickerRef.isOpen()) {
            this.ailInputDatepickerRef.close();
        }

        this.ailInputDatepickerRef.open();
    }

    /**
     * Adjusts months and navigation based on screen size
     */
    private _datepickerResizeWatch() {
        if (this.ailInputDatepickerRef && this.ailInputDatepickerRef.isOpen() && !this._resizeSubscription) {
            this._resizeSubscription = this.resizeObserver()
                .pipe(distinctUntilChanged())
                .subscribe((innerWidth) => {
                    if (innerWidth < BREAKPOINTS.large && this._screenSize > BREAKPOINTS.large) {
                        this._screenSize = innerWidth;
                        this.datePickerConfig.displayMonths = 12;
                        this.datePickerConfig.navigation = 'none';

                        this._refreshDatepicker();
                    } else if (innerWidth > BREAKPOINTS.large && this._screenSize < BREAKPOINTS.large) {
                        this._screenSize = innerWidth;
                        this.datePickerConfig.displayMonths = 2;
                        this.datePickerConfig.navigation = 'arrows';

                        this._refreshDatepicker();
                    }
                });
        } else if (this.ailInputDatepickerRef && !this.ailInputDatepickerRef.isOpen() && this._resizeSubscription) {
            this._resizeSubscription.unsubscribe();
        }
    }

    private _isAirportAutocompleteActive(): boolean {
        return (this.originAirportAutoComplete && this.originAirportAutoComplete.airportDataList && this.originAirportAutoComplete.airportDataList.length > 0)
            || (this.destinationAirportAutoComplete && this.destinationAirportAutoComplete.airportDataList && this.destinationAirportAutoComplete.airportDataList.length > 0);
    }

    /**
     * This is a callback function called after each date selection is made. It iterates
     * through all the visible dates in the current displayed months and disable the
     * dates that are invalid return dates.
     * @param date, AilDate. The current date in the iteration.
     */
    disableDates(date: AilDate) {
        return this._datePickerService.markDisabled(this._dateFieldClicked, date);
    }
}

