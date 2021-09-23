const delay = require("delay");
const playwright = require('playwright');
const { Key } = require("selenium-webdriver");
const buttonStartSelector = ".instructions button.waves-effect"




const openPage = async (targetPage) => {
        
    const driver = await playwright.chromium.launch({
        headless: false // setting this to true will not run the UI
    });

    const page = await driver.newPage();
    await page.goto(targetPage);
    return page;
}

const fillFormData = async (driver, row) => {
    try {
        Object.keys(row).forEach(async key => {
            const selector = `rpa1-field[ng-reflect-dictionary-value='${key}'] input`
            const value = row[key]
            await driver.click(selector);
            driver.type(selector,value,{delay: 1000});            
////*[@ng-reflect-name="YMRT7"]

        })
        await delay(800);
        await driver.click('form input[type="submit"]');
    } catch (error) {
        console.error(error)
        throw error
    }
}

const play = async (targetPage, rows) => {
    let driver = null
    try {
        driver = await openPage(targetPage);
        await driver.click(buttonStartSelector)

        for (const row of rows) {
            await driver.click('form div.row')
            await fillFormData(driver, row);
        }
        
        await driver.click('.congratulations .message1');
        await driver.textContent('.message2');
        
    } catch (error) {
        console.log(error)
    } finally {
        await driver.quit();
    }
}

module.exports = play