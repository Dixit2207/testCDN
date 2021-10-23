const pa11y = require('pa11y-ci');
const html = require('pa11y-reporter-html');
const fs = require('fs');

let pageName = 'book-component';
let dir = './dist/a11y-reports/';
// const url = 'http://localhost:4201';

const config = {
    standard: 'WCAG2AA',
    wait: 5000,
    reporter: 'html',
    urls: [{
        url: 'http://localhost:4201',
        screenCapture: './dist/ally-reports/book-component.png',
        actions: [
            'click element #originAirport'
        ],
        timeout: 8000
    }]
};

(async function runPa11y() {
    const results = await pa11y(config.urls, config);
    const htmlResults = await html.results(results, config.urls);
    // console.log(htmlResults);
    fs.mkdir(dir, function() {
        fs.writeFile(dir + pageName + '.html', htmlResults, (err) => {
            if (err) {
                // eslint-disable-next-line angular/log
                console.error(err);
            }
        });
    });
})().then(() => {
    console.log('A11Y tests completed');
}).catch(e => {
    console.error('A11Y tests failed!');
    console.error(e);
});

