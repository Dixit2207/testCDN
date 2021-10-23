import { browser, by, element, protractor } from 'protractor';

export class AppPage {
    waitForElement = protractor.ExpectedConditions;

    navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl) as Promise<unknown>;
    }

    getFromAirportInput() {
        // browser.wait(this.waitForElement.visibilityOf(element(by.id('originAirport'))));
        return element(by.id('originAirport'));
    }

    getToAirportInputBox() {
        // browser.wait(this.waitForElement.visibilityOf(element(by.id('destinationAirport'))));
        return element(by.id('destinationAirport'));
    }

    getDepartDateInput() {
        // browser.wait(this.waitForElement.visibilityOf(element(by.id('depart-date-book'))));
        return element(by.id('depart-date-book'));
    }

    getNumberOfPassengersInput() {
        // browser.wait(this.waitForElement.visibilityOf(element(by.id('flightSearchForm.adultOrSeniorPassengerCount'))));
        return element(by.id('flightSearchForm.adultOrSeniorPassengerCount'));
    }

    getReturnDateInput() {
        browser.wait(this.waitForElement.visibilityOf(element(by.id('return-date-book'))));
        return element(by.id('return-date-book'));
    }

    getSearchButton() {
        // browser.wait(this.waitForElement.visibilityOf(element(by.id('submitSearchButton'))));
        return element(by.id('submitSearchButton'));
    }
}
