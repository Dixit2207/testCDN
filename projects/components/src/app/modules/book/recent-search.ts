/**
 * dateTime: "2021-03-27T05:00:00.000Z"
 * YYYY-MM-DDTHH:mm:ss.
 */
export interface IDate {
    dateTime: string;
    dayOfMonth: number;
    monthOfYear: number;
    year: number;
}

/**
 * createDate:  "2021-02-13T00:15:18.172Z"
 * elementID: "DFW to LAX Mar 8 - Mar 27"
 */
export interface RecentSearch {
    awardBooking: boolean;
    createDate: string;
    destinationAirport: string;
    destinationTravelDate: IDate;
    elementID: string;
    expired: boolean;
    originAirport: string;
    originTravelDate: IDate;
    tripType: string;
}
