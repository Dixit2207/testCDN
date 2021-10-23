import { browser, by, element, logging, protractor } from 'protractor';
import { AppPage } from './app.po';

describe('E2E Test Web Components', () => {
    let page: AppPage;
    const departDate = new Date((new Date()).setDate((new Date()).getDate() + 30));
    const returnDate = new Date((new Date()).setDate((new Date()).getDate() + 35));
    const departDateString = departDate.toISOString().split('T')[0];
    const returnDateString = returnDate.toISOString().split('T')[0];
    const departDay = departDateString.split('-').join('/').substring(5) + '/' + departDateString.substring(0, 4);
    const returnDay = returnDateString.split('-').join('/').substring(5) + '/' + returnDateString.substring(0, 4);

    beforeEach(async () => {
        page = new AppPage();
        await browser.waitForAngularEnabled(true);
        await page.navigateTo();
    });

    it('should display error messages when "From" is not entered', async () => {
        page.getToAirportInputBox().sendKeys('LAX');
        page.getDepartDateInput().sendKeys(departDay);
        page.getReturnDateInput().sendKeys(returnDay);
        page.getSearchButton().click();
        await expect(<any>(element(by.id('originAirportRequired')).isPresent())).toBe(true);
    });

    it('should display error messages when "To" is not entered', async () => {
        page.getFromAirportInput().sendKeys('PHX');
        page.getDepartDateInput().sendKeys(departDay);
        page.getReturnDateInput().sendKeys(returnDay);
        page.getSearchButton().click();

        await expect(<any>(element(by.id('destinationAirportRequired')).isPresent())).toBe(true);
    });

    it('should display error messages when "Depart" date is not entered', async () => {
        page.getFromAirportInput().sendKeys('DFW');
        page.getToAirportInputBox().sendKeys('NRT');
        page.getReturnDateInput().sendKeys(returnDay);
        page.getSearchButton().click();

        await expect(<any>(element(by.id('departDateRequired')).isPresent())).toBe(true);
    });

    it('should display error messages when "Return" date is not entered', async () => {
        page.getFromAirportInput().sendKeys('CLT');
        page.getToAirportInputBox().sendKeys('PHL');
        page.getDepartDateInput().sendKeys(departDay);
        page.getSearchButton().click();

        await expect(<any>(element(by.id('returnDateRequired')).isPresent())).toBe(true);
    });

    it('should display the error callout and the form validation error messages when the form is submitted blank', async () => {
        page.getSearchButton().click();

        await expect(<any>(element(by.id('fixErrorAlert')).isPresent())).toBe(true);
        await expect(<any>(element(by.id('errors-link')).getText())).toEqual('4 errors.');
        await expect(<any>(element(by.id('originAirportRequired')).isPresent())).toBe(true);
        await expect(<any>(element(by.id('destinationAirportRequired')).isPresent())).toBe(true);
        await expect(<any>(element(by.id('departDateRequired')).isPresent())).toBe(true);
        await expect(<any>(element(by.id('returnDateRequired')).isPresent())).toBe(true);
    });

    it('should have the callout link display the correct number of errors', async () => {
        page.getFromAirportInput().sendKeys('DFW');
        page.getSearchButton().click();

        await expect(<any>(element(by.id('errors-link')).getText())).toEqual('3 errors.');
    });

    it('should focus on the error count if there is an error when form is submitted', async () => {
        page.getSearchButton().click();

        browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('errors-link'))), 5000);
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(element(by.id('errors-link'))), 5000);

        await expect(<any>element(by.id('errors-link')).getAttribute('id')).toEqual(
            browser.driver.switchTo().activeElement().getAttribute('id'));
    });

    it('should change focus to the first input with an error when error count link is clicked', async () => {
        page.getSearchButton().click();
        element(by.id('errors-link')).click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('errors-link'))), 5000);
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(element(by.id('errors-link'))), 5000);
        browser.driver.switchTo().activeElement().sendKeys(protractor.Key.ENTER); // Sends enter key to focused element

        expect(<any>(browser.driver.switchTo().activeElement().getAttribute('id'))).toBe(
            page.getFromAirportInput().getAttribute('id')
        );
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(
            jasmine.objectContaining({
                level: logging.Level.SEVERE
            } as logging.Entry)
        );
    });
});
