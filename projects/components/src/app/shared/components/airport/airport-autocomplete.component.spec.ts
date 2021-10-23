import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AirportAutocompleteComponent } from '@shared/components/airport/airport-autocomplete.component';
import { AirportService } from '@shared/components/airport/airport.service';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';
import SpyInstance = jest.SpyInstance;

describe('AirportAutocompleteComponent Test', () => {

    let component: AirportAutocompleteComponent;
    let element: HTMLElement;
    let fixture: ComponentFixture<AirportAutocompleteComponent>;

    const mockAirports = [
        {'name':'Dalian','code':'DLC','stateCode':'','countryCode':'CN','countryName':'China'},
        {'name':'Dallas Fort Worth International','code':'DFW','stateCode':'TX','countryCode':'US','countryName':'United States'}
    ];

    const airportServiceMock = {
        methods: jest.fn(),
        searchAirports: jest.fn()
    };

    beforeEach( () => {
        TestBed.configureTestingModule({
            imports: [
                LoggerTestingModule
            ],
            declarations: [AirportAutocompleteComponent],
            providers: [{ provide: AirportService, useValue: airportServiceMock }]
        });
    });

    beforeEach(() => {
        airportServiceMock.searchAirports.mockReturnValueOnce(of(mockAirports));

        fixture = TestBed.createComponent(AirportAutocompleteComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        TestBed.inject(AirportService);
        fixture.detectChanges();
    });

    it('Test component initialization', () => {
        expect(component).toBeTruthy();
    });

    it('Test search airports should populate the airportDataList object', () => {
        component.searchAirports({ target: { value: 'da' } });
        fixture.detectChanges();
        expect(component.airportDataList.length).toBe(0);
    });

    it('Test search airports less than 3 characters', () => {
        component.searchAirports({ target: { value: 'dal' } });
        fixture.detectChanges();
        expect(component.airportDataList.length).toBe(2);
        expect(component.airportDataList.map( e => e.code ).toString()).toBe('DLC,DFW' );
        expect(airportServiceMock.searchAirports).toHaveBeenCalledWith('dal');
    });

    it('Test select airport should reset the airportDataList', () => {
        component.searchAirports({ target: { value: 'dal' } });
        fixture.detectChanges();
        component.selectItem('DFW');
        expect(component.airportDataList.length).toBe(0);
    });

    it('Test format airport name', () => {
        const formattedAirport = component.formatAirportName(mockAirports[1]);
        expect(formattedAirport).toBe('DFW - Dallas Fort Worth International, TX');
    });

    it('Test keyboard events Escape should reset the airportDataList', () => {
        const escapeKey = new KeyboardEvent('keydown', { key: 'Escape' });
        component.searchAirports({ target: { value: 'dal' } });
        fixture.detectChanges();
        expect(component.airportDataList.length).toBe(2);

        component.handleKeydown(escapeKey);
        expect(component.airportDataList.length).toBe(0);
    });

    it('Test keyboard events Tab should reset the airportDataList', () => {
        const tabKey = new KeyboardEvent('keydown', { key: 'Tab' });
        component.searchAirports({ target: { value: 'dal' } });
        fixture.detectChanges();
        expect(component.airportDataList.length).toBe(2);

        component.handleKeydown(tabKey);
        expect(component.airportDataList.length).toBe(0);
    });

    it('Test keyboard events ArrowUp or ArrowDown should not reset the airportDataList', () => {
        const tabKey = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        component.searchAirports({ target: { value: 'dal' } });
        fixture.detectChanges();
        expect(component.airportDataList.length).toBe(2);

        component.handleKeydown(tabKey);
        expect(component.airportDataList.length).toBe(2);
    });

    it('Test keyboard events ArrowLeft or ArrowRight should not reset the airportDataList', () => {
        const arrowLeftKey = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        component.searchAirports({ target: { value: 'dal' } });
        fixture.detectChanges();
        expect(component.airportDataList.length).toBe(2);

        component.handleKeydown(arrowLeftKey);
        expect(component.airportDataList.length).toBe(2);
    });

    it('Test keyboard events Enter should reset the airportDataList', () => {
        const enterKey = new KeyboardEvent('keydown', { key: 'Enter' });
        component.searchAirports({ target: { value: 'dal' } });
        fixture.detectChanges();
        expect(component.airportDataList.length).toBe(2);

        component.handleKeydown(enterKey);
        expect(component.airportDataList.length).toBe(2);
    });

    it('Test keyboard events characters should trigger a call to search airports', () => {
        const searchAirportSpy: SpyInstance = jest.spyOn(component, 'searchAirports');
        searchAirportSpy.mockReturnValueOnce(null);
        const charKey = new KeyboardEvent('keydown', { key: 'dal' });
        fixture.detectChanges();
        component.handleKeydown(charKey);
        expect(component.airportDataList).toBeUndefined();
    });

    it('Test onFocus in event', () => {
        component.onFocusIn();
        expect(component.isFieldFocused).toBe(true);
    })
});
