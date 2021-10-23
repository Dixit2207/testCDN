import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utils } from '@core/services';
import { Book, BookResponse } from '@modules/book';
import { environment } from 'env';
import { NGXLogger } from 'ngx-logger';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private readonly _bookCheckEndpoint = environment.airPassMemberCheckEndpoint;
    private readonly _bookEndpoint = environment.bookEndpoint;

    constructor(private _httpClient: HttpClient, private _window: Window, private _logger: NGXLogger) {
    }

    public checkBook(): Observable<BookResponse> {
        const options = {
            params: new HttpParams(),
            headers: Utils.headers
        };
        this._logger.debug(`Origin => ${environment.server}`);
        return this._httpClient.get<BookResponse>(this._bookCheckEndpoint, options).pipe(catchError(this._handleError));
    }

    public searchFlights(book: Book): void {
        this._logger.debug(book);
        let params = new HttpParams()
            .set('adultOrSeniorPassengerCount', `${book.passengerCount}`)
            .set('departDate', book.departDate)
            .set('destinationAirport', book.destinationAirport)
            .set('originAirport', book.originAirport)
            .set('returnDate', book.returnDate)
            .set('tripType', book.tripType)
            .set('dateFormat', 'mm/dd/yyyy')
            .set('flight', 'flight')
            .set('fromSearchPage', 'true')
            .set('serviceclass', 'coach')
            .set('showMoreOptions', 'false');
        if (book.redeemMiles) {
            params = params.append('redeemMiles', 'true');
        } else if (book.airpass) {
            params = params.append('airpass.useAirpass', 'true');
        } else if (book.tripLink) {
            params = params.append('tripLink', 'true');
        }
        this._logger.debug(params);
        const searchUrl: string = this._bookEndpoint + '?' + params.toString();
        this._window.location.assign(searchUrl);
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
