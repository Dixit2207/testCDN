// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
    allScriptsTimeout: 10000,
    baseUrl: 'http://localhost:4201',
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                '--headless',
                '--disable-web-security',
                '--user-data-dir=~/.e2e-chrome-profile'
            ]
        }
    },
    debug: false,
    directConnect: true,
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
        // print: function() {}
    },
    logLevel: 'ERROR',
    onPrepare() {
        require('ts-node').register({
            project: require('path').join(__dirname, './tsconfig.json')
        });
        jasmine.getEnv().addReporter(new SpecReporter({
            spec: {
                displayStacktrace: StacktraceOption.PRETTY
            }
        }));
    },
    specs: [
        './src/**/*.e2e-spec.ts'
    ]
};
