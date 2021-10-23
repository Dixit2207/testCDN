import { SmallCalloutModule } from '@aileron/components';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { BookComponent, BookingDatepickerConfig, BookService, CONSTANTS } from '@modules/book';
import { I18N_PROVIDERS } from '@modules/translations.module';
import { AirportDialogModule, AirportService } from '@shared/components/airport';
import { AilDate, AilDatepickerModule } from '@shared/components/datepicker';
import { I18NextPipe } from 'angular-i18next';
import moment, { Moment } from 'moment';
import SpyInstance = jest.SpyInstance;

const assignMock = jest.fn();

describe('BookingComponent', () => {
    let component: BookComponent;
    let element: HTMLElement;
    let fixture: ComponentFixture<BookComponent>;
    const momentDateFormat: string = 'M/D/YYYY';
    const currentMoment: Moment = moment();
    const currentDate: string = currentMoment.format(momentDateFormat);
    const futureDate: string = moment().add(3, 'M').format(momentDateFormat);
    const vacationCurrentDate = moment().add(7,'d').format(momentDateFormat);
    const vacationFutureDate = moment().add(12,'d').format(momentDateFormat);
    const bookServiceMock = {
        methods: jest.fn(),
        searchFlights: jest.fn()
    };
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                SmallCalloutModule,
                AilDatepickerModule,
                HttpClientModule,
                HttpClientTestingModule,
                AirportDialogModule,
                BrowserAnimationsModule
            ],
            providers: [{ provide: Window, useValue: window }, I18N_PROVIDERS, I18NextPipe, { provide: BookService, use: bookServiceMock }, AirportService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [BookComponent]
        }).compileComponents();
        delete window.location;
        window.location = {
            ancestorOrigins: undefined, hash: '', host: '', hostname: '', href: '', origin: '', pathname: '', port: '', protocol: '', replace(url: string): void {
            }, search: '', toString(): string {
                return '';
            }, reload(forcedReload?: boolean): void {
            }, assign: assignMock
        };
    }));
    beforeEach(() => {
        bookServiceMock.searchFlights.mockReset();
        bookServiceMock.searchFlights();
        fixture = TestBed.createComponent(BookComponent);
        component = fixture.componentInstance; // The component instantiation
        element = fixture.nativeElement; // The HTML reference
        fixture.detectChanges();
    });
    afterEach(() => {
        assignMock.mockClear();
    });
    it('should create a host instance', () => {
        expect(component).toBeTruthy();
    });
    it('should trigger onResize method when window is resized', waitForAsync(() => {
            const onResizeSpy: SpyInstance = jest.spyOn(component, 'onResize');
            global.dispatchEvent(new Event('resize'));
            expect(onResizeSpy).toHaveBeenCalled();
        }
    ));
    it('should instantiate BookingDatepickerConfig service', () => {
        const datePickerService = TestBed.inject(BookingDatepickerConfig);
        expect(datePickerService).toBeTruthy();
        expect(datePickerService.config).toBeTruthy();
        expect(component.datePickerConfig).toEqual(datePickerService.config);
    });
    it('should inputForm be invalid when empty', () => {
        expect(component.inputForm.valid).toBeFalsy();
    });
    it('should originAirport field be invalid when empty', () => {
        expect(component.inputForm.controls['originAirport'].valid).toBeFalsy();
    });
    it('should originAirport field not be null', () => {
        component.inputForm.controls['originAirport'].setValue('');
        expect(component.inputForm.controls['originAirport'].hasError('required')).toBeTruthy();
    });
    it('should originAirport field min length be 3', () => {
        component.inputForm.controls['originAirport'].setValue('A');
        expect(component.inputForm.controls['originAirport'].hasError('minLength')).toEqual(false);
    });
    it('should originAirport field max length be 3', () => {
        component.inputForm.controls['originAirport'].setValue('PHOENIX');
        expect(component.inputForm.controls['originAirport'].hasError('maxLength')).toEqual(false);
    });
    it('should destinationAirport field be invalid when empty', () => {
        expect(component.inputForm.controls['destinationAirport'].valid).toBeFalsy();
    });
    it('should destinationAirport field not be null', () => {
        component.inputForm.controls['destinationAirport'].setValue('');
        expect(component.inputForm.controls['destinationAirport'].hasError('required')).toBeTruthy();
    });
    it('should destinationAirport field min length be 3', () => {
        component.inputForm.controls['destinationAirport'].setValue('D');
        expect(component.inputForm.controls['destinationAirport'].hasError('minLength')).toEqual(false);
    });
    it('should destinationAirport field max length be 3', () => {
        component.inputForm.controls['destinationAirport'].setValue('DALLAS');
        expect(component.inputForm.controls['destinationAirport'].hasError('maxLength')).toEqual(false);
    });
    it('should departDate field be invalid when empty', () => {
        expect(component.inputForm.controls['departDate'].valid).toBeFalsy();
    });
    it('should departDate field not be null', () => {
        component.inputForm.controls['departDate'].setValue('');
        expect(component.inputForm.controls['departDate'].hasError('required')).toBeTruthy();
    });
    it('Test getDepartDateError datePastMax error', () => {
        component.inputForm.controls['departDate'].setValue(moment().add(333, 'days').format('l'));
        component.submitted = true;
        component.getDepartDateError();
        expect(component.inputForm.controls['departDate'].hasError('datePastMax'));
    });
    it('Test getReturnDateError datePastMax error', () => {
        component.inputForm.controls['returnDate'].setValue(moment().add(333, 'days').format('l'));
        component.submitted = true;
        component.getReturnDateError();
        expect(component.inputForm.controls['returnDate'].hasError('datePastMax'));
    });
    it('should returnDate field be invalid when empty', () => {
        expect(component.inputForm.controls['returnDate'].valid).toBeFalsy();
    });
    it('should returnDate field not be null', () => {
        component.inputForm.controls['returnDate'].setValue('');
        expect(component.inputForm.controls['returnDate'].hasError('required')).toBeTruthy();
    });
    it('should \'errorCount\' function be called', waitForAsync(() => {
            const errorCountSpy: SpyInstance = jest.spyOn(component, 'errorCount');
            component.errorCount();
            expect(errorCountSpy).toHaveBeenCalled();
        }
    ));
    it('should \'i18NextService\' be called', () => {
        const i18NextServiceSpy: SpyInstance = jest.spyOn(component, 'loadNamespaces');
        component.loadNamespaces();
        expect(i18NextServiceSpy).toHaveBeenCalled();
    });
    it('should set error count to 0 when there is no error ', () => {
        component.inputForm.controls['originAirport'].setValue('DFW');
        component.inputForm.controls['destinationAirport'].setValue('PHX');
        component.inputForm.controls['departDate'].setValue('12/12/2021');
        component.inputForm.controls['returnDate'].setValue('12/13/2021');
        expect(component.errorCount()).toBe(0);
    });
    it('should display the error count \'1\' when there is only one error', () => {
        component.inputForm.controls['originAirport'].setValue('DFW');
        component.inputForm.controls['destinationAirport'].setValue('');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.inputForm.markAllAsTouched();
        expect(component.errorCount()).toBe(1);
    });
    it('should display a singular error message when there is only one error', () => {
        component.inputForm.controls['originAirport'].setValue('');
        component.inputForm.controls['destinationAirport'].setValue('PHX');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.inputForm.markAllAsTouched();
        component.errorCount();
        expect(component.errorMessage).toBe('ERRCODE408.messageWithCount');
    });
    it('should display the error count \'3\' when there are 3 errors', () => {
        component.inputForm.controls['originAirport'].setValue('');
        component.inputForm.controls['destinationAirport'].setValue('');
        component.inputForm.controls['departDate'].setValue('');
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.inputForm.markAllAsTouched();
        component.submitted = true;
        component.errorCount();
        expect(component.errorCount()).toBe(3);
    });
    it('should display a plural error message when there are more than an error', () => {
        component.inputForm.controls['originAirport'].setValue('');
        component.inputForm.controls['destinationAirport'].setValue('JFK');
        component.inputForm.controls['departDate'].setValue('');
        component.inputForm.controls['returnDate'].setValue('12/12/2020');
        component.errorCount();
        expect(component.errorMessage).toBe('ERRCODE408.messageWithCount_plural');
    });
    it('should focus origin airport when it is the first invalid field', () => {
        component.inputForm.controls['originAirport'].setValue(null);
        component.inputForm.controls['destinationAirport'].setValue('OKC');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.submitForm();
        component.changeFocus();
        const focusedElement = fixture.debugElement.query(By.css(':focus')).nativeElement;
        const originAirportInput = fixture.debugElement.query(By.css('#originAirport')).nativeElement;
        expect(focusedElement).toBe(originAirportInput);
    });
    it('should focus destination airport when it is the first invalid field', () => {
        component.inputForm.controls['originAirport'].setValue('dfw');
        component.inputForm.controls['destinationAirport'].setValue('');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.submitForm();
        component.changeFocus();
        const focusedElement = fixture.debugElement.query(By.css(':focus')).nativeElement;
        const destinationAirportInput = fixture.debugElement.query(By.css('#destinationAirport')).nativeElement;
        expect(focusedElement).toBe(destinationAirportInput);
    });
    it('should focus depart date when it is the first invalid field', () => {
        component.inputForm.controls['originAirport'].setValue('dfw');
        component.inputForm.controls['destinationAirport'].setValue('jfk');
        component.inputForm.controls['departDate'].setValue('');
        component.inputForm.controls['returnDate'].setValue('');
        component.submitForm();
        component.changeFocus();
        const focusedElement = fixture.debugElement.query(By.css(':focus')).nativeElement;
        const departDateInput = fixture.debugElement.query(By.css('#depart-date-book')).nativeElement;
        expect(focusedElement).toBe(departDateInput);
    });
    it('should focus return date when it is the first invalid field', () => {
        component.inputForm.controls['originAirport'].setValue('dfw');
        component.inputForm.controls['destinationAirport'].setValue('jfk');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue('');
        component.submitForm();
        component.changeFocus();
        const focusedElement = fixture.debugElement.query(By.css(':focus')).nativeElement;
        const returnDateInput = fixture.debugElement.query(By.css('#return-date-book')).nativeElement;
        expect(focusedElement).toBe(returnDateInput);
    });
    it('should call showDialog when airport lookup icon clicked', waitForAsync(() => {
        const showDialogSpy: SpyInstance = jest.spyOn(component, 'showDialog');
        const showDialogButton = fixture.debugElement.nativeElement.querySelector('.field__button .icon-search');
        showDialogButton.click();
        fixture.whenStable().then(() => {
            expect(showDialogSpy).toHaveBeenCalled();
        });
    }));
    it('Test book flights revenue search submitForm', () => {
        component.inputForm.controls['originAirport'].setValue('DFW');
        component.inputForm.controls['destinationAirport'].setValue('OKC');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.submitForm();
        expect(bookServiceMock.searchFlights).toHaveBeenCalledTimes(1);
    });
    it('Test book flights award search submitForm', () => {
        component.inputForm.controls['originAirport'].setValue('DFW');
        component.inputForm.controls['destinationAirport'].setValue('OKC');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.inputForm.controls['redeemMiles'].setValue('true');
        component.submitForm();
        expect(bookServiceMock.searchFlights).toHaveBeenCalledTimes(1);
    });
    it('Test book flights search submitForm with airpass', () => {
        component.inputForm.controls['originAirport'].setValue('DFW');
        component.inputForm.controls['destinationAirport'].setValue('OKC');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.inputForm.controls['airPass'].setValue(true);
        component.isAirPassMember = true;
        component.submitForm();
        expect(bookServiceMock.searchFlights).toHaveBeenCalledTimes(1);
    });
    it('Test book flights search submitForm with tripLink', () => {
        component.inputForm.controls['originAirport'].setValue('DFW');
        component.inputForm.controls['destinationAirport'].setValue('OKC');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.inputForm.controls['tripLink'].setValue(true);
        component.isAirPassMember = true;
        component.isTripLink = true;
        component.submitForm();
        expect(bookServiceMock.searchFlights).toHaveBeenCalledTimes(1);
    });
    it('Test book flights search submitForm and tripLink', () => {
        component.inputForm.controls['originAirport'].setValue('DFW');
        component.inputForm.controls['destinationAirport'].setValue('OKC');
        component.inputForm.controls['departDate'].setValue(currentDate);
        component.inputForm.controls['returnDate'].setValue(futureDate);
        component.inputForm.controls['airPass'].setValue(true);
        component.isAirPassMember = true;
        component.submitForm();
        expect(bookServiceMock.searchFlights).toHaveBeenCalledTimes(1);
    });
    it('Test radio trip type change', () => {
        component.radioTripTypeChange(null);
        expect(component.submitted).toBe(false);
        expect(component.inputForm.touched).toBe(false);
    });
    it('Test travel type change', () => {
        component.travelTypeChange(null);
        expect(component.submitted).toBe(false);
        expect(component.inputForm.touched).toBe(false);
    });
    it('Test selectAirportAutoComplete originAirport', () => {
        component.selectAirportAutoComplete('DFW', CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT);
        expect(component.inputForm.controls[CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT].value).toBe('DFW');
    });
    it('Test selectAirportAutoComplete destinationAirport', () => {
        component.selectAirportAutoComplete('DFW', CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT);
        expect(component.inputForm.controls[CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT].value).toBe('DFW');
    });
    it('Test tripLink value changed to false', function () {
        component.inputForm.controls[CONSTANTS.FORM_FIELD_TRIP_LINK].setValue('true');
        const tripLinkInput = { nativeElement: {firstChild: { control: {checked: false}}} };
        component.tripLinkValueChanged(null, tripLinkInput);
        component.inputForm.controls[CONSTANTS.FORM_FIELD_TRIP_LINK].setValue('false');
        expect(component.inputForm.controls[CONSTANTS.FORM_FIELD_PASSENGER_COUNT].status).toBe('VALID');
        expect(component.inputForm.controls[CONSTANTS.FORM_FIELD_PASSENGER_COUNT].value).toBe('1');

    });
    it('Test tripLink value changed to true', function () {
        component.inputForm.controls[CONSTANTS.FORM_FIELD_TRIP_LINK].setValue('false');
        const tripLinkInput = { nativeElement: {firstChild: { control: {checked: true}}} };
        component.tripLinkValueChanged(null, tripLinkInput);
        component.inputForm.controls[CONSTANTS.FORM_FIELD_TRIP_LINK].setValue('true');
        expect(component.disablePassengerCount).toBe(true);
    });
    it('Test airPass value changed to false and tripLink to true', function () {
        component.isTripLink = true;
        component.inputForm.controls[CONSTANTS.FORM_FIELD_AIRPASS].setValue('true');
        const airPassInput = { nativeElement: {firstChild: { control: {checked: false}}}};
        const tripLinkInput = { nativeElement: {firstChild: { control: {checked: false}}} };
        component.airPassValueChanged(airPassInput, tripLinkInput);
        component.inputForm.controls[CONSTANTS.FORM_FIELD_AIRPASS].setValue('false');
        component.inputForm.controls[CONSTANTS.FORM_FIELD_TRIP_LINK].setValue('true');
        tripLinkInput.nativeElement.firstChild.control.checked = true;
        component.tripLinkValueChanged(airPassInput, tripLinkInput);
        expect(component.disablePassengerCount).toBe(true);
    });
    it('Test airPass value changed to true', function () {
        component.isTripLink = true;
        component.inputForm.controls[CONSTANTS.FORM_FIELD_AIRPASS].setValue('false');
        const airPassInput = { nativeElement: {firstChild: { control: {checked: true}}}};
        const tripLinkInput = { value: 'true', disabled: false };
        component.airPassValueChanged(airPassInput, tripLinkInput);

        expect(component.disablePassengerCount).toBe(true);
    });
    it('Test redeemMiles value changed to true', function () {
        component.isTripLink = true;
        component.isAirPassMember = true;
        component.redeemMilesControl = { nativeElement: { value: 'true'} };
        component.inputForm.controls[CONSTANTS.FORM_FIELD_REDEEM_MILES].setValue('false');
        component.redeemMilesValueChanged();
        component.inputForm.controls[CONSTANTS.FORM_FIELD_REDEEM_MILES].setValue('true');

        expect(component.disableAirPass).toBe(true);
        expect(component.disableCorporateBooking).toBe(true);
    });
    it('Test redeemMiles value changed to false', function () {
        component.isTripLink = true;
        component.isAirPassMember = true;
        component.redeemMilesControl = { nativeElement: { value: 'false'} };
        component.inputForm.controls[CONSTANTS.FORM_FIELD_REDEEM_MILES].setValue('true');
        const airPassInput = { value: 'true', disabled: false };
        const tripLinkInput = { value: 'true', disabled: false };
        component.redeemMilesValueChanged();
        component.inputForm.controls[CONSTANTS.FORM_FIELD_REDEEM_MILES].setValue('false');
        expect(airPassInput.disabled).toBe(false);
        expect(tripLinkInput.disabled).toBe(false);
    });

    it('should open correct vacation link when submitting valid form on vacation packages', waitForAsync(() => {
        const windowOpenSpy = spyOn(window, 'open')
        component.inputForm.controls[CONSTANTS.FORM_NAME].setValue(CONSTANTS.ROUND_TRIP_HOTEL);
        component.onVacationTab();
        component.inputForm.controls['originAirport'].setValue('DFW');
        component.inputForm.controls['destinationAirport'].setValue('JFK');
        component.inputForm.controls['departDate'].setValue(vacationCurrentDate);
        component.inputForm.controls['returnDate'].setValue(vacationFutureDate);
        component.submitForm();

        expect(windowOpenSpy).toHaveBeenCalled();
        expect(component.vacationLinkURL).toEqual(`https://www.aavacations.com/deeplink?ADID=AACM-DEP-ALL-09-01&searchType=matrix&adults=${component.inputForm.get(CONSTANTS.FORM_FIELD_PASSENGER_COUNT).value}&rooms=1&serviceclass=${component.inputForm.get(CONSTANTS.FORM_FIELD_FARE_PREFERENCE).value}&from_date=${component.inputForm.get(CONSTANTS.FORM_FIELD_DEPART_DATE).value}&to_date=${component.inputForm.get(CONSTANTS.FORM_FIELD_RETURN_DATE).value}&from_city_code=${component.inputForm.get(CONSTANTS.FORM_FIELD_ORIGIN_AIRPORT).value}&to_city_code=${component.inputForm.get(CONSTANTS.FORM_FIELD_DESTINATION_AIRPORT).value}&to_time=0&from_time=0`)
    }));

    it('test getTripLink should disable passengerCount and redeemMiles', () => {
        component.isTripLink = true;
        fixture.detectChanges();
        const checkBoxes = fixture.debugElement.queryAll(By.css('ail-checkbox'));
        const selectInputs = fixture.debugElement.queryAll(By.css('select'));
        const redeemMiles = checkBoxes[0];
        const tripLink = checkBoxes[1];
        const passengerCount = selectInputs[0];

        fixture.componentInstance.tripLinkControl = tripLink;
        fixture.componentInstance.redeemMilesControl = redeemMiles;
        fixture.componentInstance.passengerCountControl = passengerCount;

        const tripLinkInput = fixture.componentInstance.getTripLinkInput();
        expect(tripLinkInput.checked).toBe(true);
        expect(redeemMiles.nativeElement.disable).toBe(true);
        expect(passengerCount.nativeElement.disable).toBe(true);
    });

    it('test getAirPassInput should disable passengerCount and redeemMiles', () => {
        component.isAirPassMember = true;
        fixture.detectChanges();
        const checkBoxes = fixture.debugElement.queryAll(By.css('ail-checkbox'));
        const selectInputs = fixture.debugElement.queryAll(By.css('select'));
        const redeemMiles = checkBoxes[0];
        const airPass = checkBoxes[1];
        const passengerCount = selectInputs[0];

        fixture.componentInstance.airPassControl = airPass;
        fixture.componentInstance.redeemMilesControl = redeemMiles;
        fixture.componentInstance.passengerCountControl = passengerCount;

        const airPassInput = fixture.componentInstance.getAirPassInput();
        expect(fixture.componentInstance.inputForm.controls['airPass'].value).toBe(true);
        expect(redeemMiles.nativeElement.disable).toBe(true);
        expect(fixture.componentInstance.inputForm.controls['passengerCount'].status).toBe('DISABLED');
    });

    describe('Tests for disableDates functionality', () => {

        beforeEach( () => {
            const datepickerService = TestBed.inject(BookingDatepickerConfig);
            const departDate: Moment = moment().add(2, 'days');
            const departAilDate: AilDate = new AilDate(departDate.year(), departDate.month(), departDate.date());
            datepickerService.config.departDate = departAilDate;
        });

        it('Should return true for a date before departDate', () => {
            const pastDate: Moment = moment().subtract(1, 'days');
            const pastAilDate: AilDate = new AilDate(pastDate.year(), pastDate.month(), pastDate.date());
            fixture.componentInstance.toggleCalendar({ toggle() { return } }, 'returnDate');
            const isDisable: boolean = component.disableDates(pastAilDate);
            expect(isDisable).toBe(true);
        });

        it('Should return false for a date after departDate', () => {
            const futureDate: Moment = moment().add(3, 'days');
            const futureAilDate: AilDate = new AilDate(futureDate.year(), futureDate.month(), futureDate.date());
            fixture.componentInstance.toggleCalendar({ toggle() { return } }, 'returnDate');
            const isDisable: boolean = component.disableDates(futureAilDate);
            expect(isDisable).toBe(false);
        });
    })
});
