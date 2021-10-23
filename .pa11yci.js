module.exports = {
    standard: 'WCAG2AA',
    level: 'error',
    timeout: 30000,
    defaults: {
        timeout: 5000,
        threshold: 2,
        wait: 5000
    },
    ignore: [
        'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail'
    ],
    urls: [
        {
            url: 'http://localhost:4201',
            screenCapture: 'dist/ally-reports/book-component.png',
            timeout: 30000,
            actions: [
                // 'wait for element #originAirport is visible',
                'click element #originAirport'
            ]
        }
    ]
};
