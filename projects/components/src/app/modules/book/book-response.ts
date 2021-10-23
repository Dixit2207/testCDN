export enum TRIP_TYPE {
    ROUND_TRIP = 'roundTrip',
    ONE_WAY = 'oneWay'
}

export interface ReservationInfo {
    originAirport: string;
    destinationAirport: string;
    departDate: string;
    returnDate: string;
    tripType: TRIP_TYPE;
    adultPassengerCount: number;
    redeemMiles: boolean;
    useAirpass: boolean;
    awardBooking: boolean;
    tripLinkSelected: boolean;
    airPassSelected: boolean;
}

export interface BookResponse {
    airPassMember: boolean;
    airPassCompanionAllowed: boolean;
    tripLink: boolean;
    reservationView: ReservationInfo;
}
