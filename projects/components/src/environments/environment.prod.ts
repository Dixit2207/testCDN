export const environment = {
    production: true,
    baseHref: 'https://cdn.aa.com/homepage/components',
    server: 'https://www.aa.com',
    airPassMemberCheckEndpoint: '/home/api/book',
    // bookEndpoint: "/booking/find-flights",
    bookEndpoint: 'https://search-availability-interstitial-page.qa.aa.com/booking/find-flights/search',
    airport: {
        countriesEndpoint: '/airport/countries',
        statesEndpoint: '/airport/states',
        airportsEndpoint: 'airport/airports',
        airportTypeaheadEndpoint: '/home/ajax/airportLookup'
    }
};
