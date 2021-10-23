import { RecentSearch } from '@modules/book/recent-search';
import { ReservationInfo, TRIP_TYPE } from '@modules/book/book-response';
import { TestBed } from '@angular/core/testing';
import { PreviousSearchesService } from '@modules/book/previous-searches.service';
import { LoggerTestingModule } from 'ngx-logger/testing';
import {CoreModule} from '@core/core.module';
import {LocalStorageService} from '@core/services';
import {CONSTANTS} from '@modules/book/book.component';
import moment, {Moment} from 'moment';

describe('RecentSearch tests', () => {

    let now: Moment;
    let nowStr: string;

    let lastWeek: Moment;
    let lastWeekStr: string;

    let nextWeek: Moment;
    let nextWeekStr: string;

    let nextMonth: Moment;
    let nextMonthStr: string;

    let previousSearchesService: PreviousSearchesService;
    let localStorageService: LocalStorageService;

    let previousSearches: RecentSearch[];

    beforeEach( () => {
       TestBed.configureTestingModule({
           imports: [ CoreModule, LoggerTestingModule ]
       });

       localStorageService = TestBed.inject(LocalStorageService);
       previousSearchesService = TestBed.inject(PreviousSearchesService);
    });

    beforeEach( () => {
        now = moment();
        nowStr = now.format();

        lastWeek = moment().subtract(7, 'days');
        lastWeekStr = lastWeek.format();

        nextWeek = moment().add(7, 'days');
        nextWeekStr = nextWeek.format();

        nextMonth = moment().add(30, 'days');
        nextMonthStr = nextMonth.format();

        previousSearches = [
            {
                'awardBooking': false,
                'createDate': nextMonthStr,
                'destinationAirport': 'OKC',
                'destinationTravelDate': {
                    'dateTime': nextMonthStr,
                    'dayOfMonth': nextMonth.date(),
                    'monthOfYear': nextMonth.month() ,
                    'year': nextMonth.year()
                },
                'elementID': 'DFW to OKC May 2 - May 6',
                'expired': false,
                'originAirport': 'DFW',
                'originTravelDate': {
                    'dateTime': nextWeekStr,
                    'dayOfMonth': nextWeek.date(),
                    'monthOfYear': nextWeek.month() ,
                    'year': nextWeek.year()
                },
                'tripType': 'roundTrip'
            },
            {
                'awardBooking': false,
                'createDate': nowStr,
                'destinationAirport': 'OKC',
                'destinationTravelDate': {
                    'dateTime': nextWeekStr,
                    'dayOfMonth': nextWeek.date(),
                    'monthOfYear': nextWeek.month() ,
                    'year': nextWeek.year()
                },
                'elementID': 'DFW to OKC May 2 - May 6',
                'expired': false,
                'originAirport': 'DFW',
                'originTravelDate': {
                    'dateTime': nowStr,
                    'dayOfMonth': now.date(),
                    'monthOfYear': now.month(),
                    'year': now.year()
                },
                'tripType': 'roundTrip'
            },
            {
                'awardBooking': false,
                'createDate': lastWeekStr,
                'destinationAirport': 'OKC',
                'destinationTravelDate': {
                    'dateTime': nowStr,
                    'dayOfMonth': now.date(),
                    'monthOfYear': now.month(),
                    'year': now.year()
                },
                'elementID': 'DFW to OKC May 2 - May 6',
                'expired': false,
                'originAirport': 'DFW',
                'originTravelDate': {
                    'dateTime': lastWeekStr,
                    'dayOfMonth': lastWeek.date(),
                    'monthOfYear': lastWeek.month(),
                    'year': lastWeek.year()
                },
                'tripType': 'roundTrip'
            }
        ];
    });

    const reservationView: ReservationInfo = {
        adultPassengerCount: 0,
        airPassSelected: false,
        awardBooking: false,
        departDate: '5/30/2021',
        destinationAirport: 'DFW',
        originAirport: 'OKC',
        redeemMiles: false,
        returnDate: '6/30/2021',
        tripLinkSelected: false,
        tripType: undefined,
        useAirpass: false
    };



    it('Test previousSearches array is empty', () => {
        const lastSearch: RecentSearch = previousSearchesService.getLastSearch(reservationView);
        expect(lastSearch).toBeDefined();
        expect(lastSearch.originTravelDate.dateTime).toBe(reservationView.departDate);
        expect(lastSearch.destinationTravelDate.dateTime).toBe(reservationView.returnDate);
        expect(lastSearch.originAirport).toBe(reservationView.originAirport);
        expect(lastSearch.destinationAirport).toBe(reservationView.destinationAirport);
    });

    it('Test previousSearches array is not empty and roundTrip', () => {
        localStorageService.set(CONSTANTS.LS_FLIGHT_SEARCH, JSON.stringify(previousSearches));
        const lastSearch: RecentSearch = previousSearchesService.getLastSearch(reservationView);
        expect(lastSearch).toBeDefined();
        expect(lastSearch.originTravelDate.dayOfMonth).toBe(nextWeek.date());
        expect(lastSearch.originTravelDate.year).toBe(nextWeek.year());
        expect(lastSearch.originTravelDate.monthOfYear).toBe(nextWeek.month());

        expect(lastSearch.destinationTravelDate.dayOfMonth).toBe(nextMonth.date());
        expect(lastSearch.destinationTravelDate.year).toBe(nextMonth.year());
        expect(lastSearch.destinationTravelDate.monthOfYear).toBe(nextMonth.month());
    });

    it('Test previousSearches array is not empty and oneWay', () => {
        previousSearches[0].tripType = TRIP_TYPE.ONE_WAY;
        localStorageService.set(CONSTANTS.LS_FLIGHT_SEARCH, JSON.stringify(previousSearches));
        const lastSearch: RecentSearch = previousSearchesService.getLastSearch(reservationView);
        expect(lastSearch).toBeDefined();

        expect(lastSearch.originTravelDate.dayOfMonth).toBe(nextWeek.date());
        expect(lastSearch.originTravelDate.year).toBe(nextWeek.year());
        expect(lastSearch.originTravelDate.monthOfYear).toBe(nextWeek.month());

        expect(lastSearch.destinationTravelDate.dateTime).toBe(nextMonthStr);
    });
});
