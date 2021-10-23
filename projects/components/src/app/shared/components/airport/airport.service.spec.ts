import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@core/core.module';
import { Airport, Country, State } from '@shared/components/airport/airport-dialog.component';
import { AirportService } from '@shared/components/airport/airport.service';
import { environment } from 'env';

describe('AirportService', () => {
    let airportService: AirportService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                HttpClientModule,
                HttpClientTestingModule
            ]
        });
        airportService = TestBed.inject(AirportService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(airportService).toBeTruthy();
    });

    it('Should return a list of countries', () => {
        const mockCountries: Country[] = [
            { 'code': 'US', 'name': 'UNITED STATES' },
            { 'code': 'CA', 'name': 'CANADA' },
            { 'code': 'SN', 'name': 'SENEGAL' },
            { 'code': 'KR', 'name': 'SOUTH KOREA' },
            { 'code': 'LK', 'name': 'SRI LANKA' }
        ];

        airportService.getAllCountries('en_US').subscribe(countries => {
            expect(countries[0].code).toBe('US');
            expect(countries[0].name).toBe('UNITED STATES');
        });

        const req = httpTestingController.expectOne(environment.airport.countriesEndpoint + '?locale=en_US');
        expect(req.request.method).toEqual('GET');
        req.flush(mockCountries);
    });

    it('should return a list of states for the provided country code', () => {
        const mockStates: State[] = [
            { 'code': 'TX', 'name': 'TEXAS' },
            { 'code': 'NY', 'name': 'NEW YORK' },
            { 'code': 'OK', 'name': 'OKLAHOMA' },
            { 'code': 'FL', 'name': 'FLORIDA' },
            { 'code': 'CA', 'name': 'CALIFORNIA' }
        ];

        airportService.getStates('US', 'en_US')
            .subscribe(states => {
                expect(states[0].code).toBe('TX');
                expect(states[0].name).toBe('TEXAS');
            });

        const req = httpTestingController.expectOne(environment.airport.statesEndpoint + '?countryCode=US&locale=en_US');
        expect(req.request.method).toEqual('GET');
        req.flush(mockStates);
    });

    it('should return a list of airports for the provided country and state codes', () => {
        const mockAirports: Airport[] = [
            { 'city': 'ABILENE', 'name': 'Abilene Regional Airport', 'code': 'ABI', 'countryCode': null, 'timeZone': null, 'formattedCityCountryName': null, 'aaserviced': null },
            { 'city': 'AMARILLO', 'name': 'Amarillo International', 'code': 'AMA', 'countryCode': null, 'timeZone': null, 'formattedCityCountryName': null, 'aaserviced': null },
            { 'city': 'AUSTIN', 'name': 'Austin Bergstrom Intl', 'code': 'AUS', 'countryCode': null, 'timeZone': null, 'formattedCityCountryName': null, 'aaserviced': null },
            { 'city': 'BEAUMONT', 'name': 'Beaumont Jefferson County', 'code': 'BPT', 'countryCode': null, 'timeZone': null, 'formattedCityCountryName': null, 'aaserviced': null }
        ];

        airportService.getAirports('US', 'TX')
            .subscribe(airports => {
                expect(airports[0].code).toBe('ABI');
                expect(airports[0].name).toBe('Abilene Regional Airport');
            });

        const req = httpTestingController.expectOne(environment.airport.airportsEndpoint + '?countryCode=US&stateCode=TX');
        expect(req.request.method).toEqual('GET');
        req.flush(mockAirports);
    });
});
