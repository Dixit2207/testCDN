import {AirportDialogComponent} from '@shared/components/airport/airport-dialog.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AirportService} from '@shared/components/airport/airport.service';
import {of} from 'rxjs';
import {I18N_PROVIDERS} from '@modules/translations.module';
import {I18NextPipe, I18NextService} from 'angular-i18next';
import {DialogModule} from '@aileron/components';
import {ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '@core/core.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {EventEmitter} from '@angular/core';

describe('AirportDialogComponentTest', () => {

    let component: AirportDialogComponent;
    let fixture: ComponentFixture<AirportDialogComponent>;

    const mockAirports = [
        {'name':'Dalian','code':'DLC','stateCode':'','countryCode':'CN','countryName':'China'},
        {'name':'Dallas Fort Worth International','code':'DFW','stateCode':'TX','countryCode':'US','countryName':'United States'}
    ];

    const mockStates = [
        {'code':'OK','name':'Oklahoma'},{'code':'TX','name':'Texas'}
    ];

    const airportServiceMock = {
        methods: jest.fn(),
        getAirports: jest.fn(),
        getStates: jest.fn()
    };

    beforeEach( waitForAsync( ()=> {
        TestBed.configureTestingModule({
            imports: [CoreModule, HttpClientModule, HttpClientTestingModule, DialogModule, ReactiveFormsModule],
            declarations: [AirportDialogComponent],
            providers: [
                I18N_PROVIDERS, I18NextPipe, { provide: AirportService, useValue: airportServiceMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        airportServiceMock.getAirports.mockReturnValueOnce(of(mockAirports));
        airportServiceMock.getStates
            .mockReturnValueOnce(of(mockStates))
            .mockReturnValueOnce(of([{'code':'TX','name':'Texas'}]))
            .mockReturnValueOnce(of([]));

        fixture = TestBed.createComponent(AirportDialogComponent);
        component = fixture.componentInstance;
        component.data = { selectionEvent: new EventEmitter()};

        TestBed.inject(AirportService);
    });

    it('Test component initialization', () => {
        expect(component).toBeTruthy();
    });

    it('Test search airports should return 2 airports', () => {
        component.searchAirports();
        expect(component.airports.length).toBe(2);
        expect(component.airports[0].code).toBe('DLC');
    });

    it('Test select country to populate list of states greater than 1', () => {
        component.selectCountry( { target: { value: 'US' } });
        expect(component.states.length).toBe(2);
        expect(component.states[0].code).toBe('OK');
    });

    it('Test select country to populate list of states equal to 1', () => {
        component.selectCountry( { target: { value: 'US' } });
        expect(component.states.length).toBe(1);
        expect(component.states[0].code).toBe('TX');
    });

    it('Test select country to populate empty list of states', () => {
        component.selectCountry( { target: { value: 'SN' } });
        expect(component.states.length).toBe(0);
        expect(airportServiceMock.getAirports).toHaveBeenCalledWith('SN', '');
    });

    it('Test select state', () => {
        component.selectCountry({ target: { value: 'US' } });
        component.selectState( { target: { value: 'TX' } });
        expect(component.airports.length).toBe(2);
        expect(airportServiceMock.getAirports).toHaveBeenCalledWith('US', 'TX');
    });

    it('Test select airport', () => {
        component.selectAirport( { target: { text: 'DFW' }, preventDefault(){} });
        let selectedAirport = '';
        component.data.selectionEvent.subscribe( value => {
            selectedAirport = value;
            expect(selectedAirport).toBe('');
        });
    });

})
