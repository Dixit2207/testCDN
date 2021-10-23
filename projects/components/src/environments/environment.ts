// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    baseHref: '',
    server: 'http://localhost:4201',
    airPassMemberCheckEndpoint: 'https://localhost:8443/home/api/book',
    //bookEndpoint: "https://localhost:8443/booking/find-flights",
    bookEndpoint: 'https://search-availability-interstitial-page.qa.aa.com/booking/find-flights/search',
    airport: {
        countriesEndpoint: 'https://localhost:8443/airport/countries',
        statesEndpoint: 'https://localhost:8443/airport/states',
        airportsEndpoint: 'https://localhost:8443/airport/airports',
        airportTypeaheadEndpoint: 'https://localhost:8443/home/ajax/airportLookup'
    }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
