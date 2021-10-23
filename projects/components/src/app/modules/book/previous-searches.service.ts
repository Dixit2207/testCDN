import { Injectable } from '@angular/core';
import { ReservationInfo, TRIP_TYPE } from '@modules/book/book-response';
import {RecentSearch} from '@modules/book/recent-search';
import {NGXLogger} from 'ngx-logger';
import {LocalStorageService} from '@core/services';
import {CONSTANTS} from '@modules/book/book.component';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PreviousSearchesService {

    constructor(private _logger: NGXLogger, private _localStorageService: LocalStorageService) {
    }

    public getLastSearch(reservationView: ReservationInfo): RecentSearch {

        let updatedSearches: RecentSearch[] = [];
        let lastSearch: RecentSearch;
        const now = moment();

        let previousFlightSearches = this._getPreviousSearches(CONSTANTS.LS_FLIGHT_SEARCH);

        if (previousFlightSearches?.length > 0) {
            updatedSearches = previousFlightSearches.filter(prevSearch => moment(prevSearch.originTravelDate.dateTime).isAfter(now));
        }

        if (previousFlightSearches?.length > updatedSearches.length) {
            this._localStorageService.set(CONSTANTS.LS_FLIGHT_SEARCH, JSON.stringify(updatedSearches));
            previousFlightSearches = updatedSearches;
        }

        if (previousFlightSearches?.length > 0) {
            this._logger.debug('*** Previous searches found ***');
            lastSearch = previousFlightSearches[0];
            // this.logger.debug(previousFlightSearches);
            // console.table(previousFlightSearches);

            const departDateDateTime = lastSearch.originTravelDate;
            lastSearch.originTravelDate.dateTime = `${departDateDateTime.monthOfYear}/${departDateDateTime.dayOfMonth}/${departDateDateTime.year}`;

            if (lastSearch.tripType === 'roundTrip') {
                const returnDateDateTime = lastSearch.destinationTravelDate;
                lastSearch.destinationTravelDate.dateTime = `${returnDateDateTime.monthOfYear}/${returnDateDateTime.dayOfMonth}/${returnDateDateTime.year}`;
            }
        } else {
            this._logger.debug('*** NO previous searches ***');
            // this.logger.debug(this.reservationView);
            lastSearch = {
                awardBooking: false,
                createDate: '',
                destinationAirport: reservationView.destinationAirport ? reservationView.destinationAirport.toUpperCase() : '',
                destinationTravelDate: {
                    dateTime: reservationView.returnDate ? reservationView.returnDate : null,
                    monthOfYear: 0,
                    dayOfMonth: 0,
                    year: 0
                },
                elementID: '',
                expired: false,
                originAirport: reservationView && reservationView.originAirport ? reservationView.originAirport.toUpperCase() : '',
                originTravelDate: {
                    dateTime: reservationView.departDate ? reservationView.departDate : null,
                    monthOfYear: 0,
                    dayOfMonth: 0,
                    year: 0
                },
                tripType: reservationView.tripType ? reservationView.tripType : TRIP_TYPE.ROUND_TRIP
            };
        }
        return lastSearch;
    }

    public _getPreviousSearches(key: string) {
        const item = this._localStorageService.get(key);
        return JSON.parse(item);
    }
}
