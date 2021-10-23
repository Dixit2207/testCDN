import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utils } from '@core/services';
import { environment } from 'env';
import { NGXLogger } from 'ngx-logger';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Airport, State } from './airport-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class AirportService {
    constructor(private httpClient: HttpClient, private _logger: NGXLogger) {
    }

    getAllCountries(locale: string): Observable<any> {
        const options = {
            params: {
                'locale': locale || 'en_US'
            },
            headers: Utils.headers
        };
        return this.httpClient.get(environment.airport.countriesEndpoint, options).pipe(catchError(this._handleError));
    }

    getStates(countryCode: string, locale: string): Observable<State[]> {
        const options = {
            params: {
                'countryCode': countryCode,
                'locale': locale || 'en_US'
            }
        };
        return this.httpClient.get<State[]>(environment.airport.statesEndpoint, options).pipe(catchError(this._handleError));
    }

    getAirports(countryCode: string, stateCode: string): Observable<Airport[]> {
        let params = new HttpParams();
        params = params.set('countryCode', countryCode);
        if (stateCode !== '') {
            params = params.set('stateCode', stateCode);
        }
        return this.httpClient.get<Airport[]>(environment.airport.airportsEndpoint, { params }).pipe(catchError(this._handleError));
    }

    searchAirports(searchText: string): Observable<any> {
        const options = {
            params: {
                'searchText': searchText,
                'onlyAirportsIfNotNull': 'false'
            }
        };
        return this.httpClient.get(environment.airport.airportTypeaheadEndpoint, options).pipe(catchError(this._handleError));
    }

    private _handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            this._logger.error('Error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            this._logger.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(
            'Something bad happened; please try again later.');
    }
}
