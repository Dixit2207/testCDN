const { compilerOptions } = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
    transform: {
        '^.+\\.(ts|html)$': 'ts-jest'
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
        prefix: '<rootDir>/'
    }),
    moduleDirectories: ['node_modules'],
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.spec.json',
            diagnostics: false,
            stringifyContentPathRegex: '\\.html$',
            astTransformers: {
                before: [
                    'jest-preset-angular/build/InlineFilesTransformer',
                    'jest-preset-angular/build/StripStylesTransformer'
                ]
            }
        }
    },
    modulePathIgnorePatterns: ['<rootDir>/dist/*'],
    collectCoverage: true,
    collectCoverageFrom: [
        'projects/components/src/app/**/*.ts',
        '!projects/components/**/*.module.ts',
        '!projects/components/src/app/modules/app*.ts',
        '!projects/components/src/app/modules/booking/**/*.ts',
        '!projects/components/src/app/modules/hero/**/*.ts',
        '!projects/components/src/app/modules/flight-status/**/*.ts',
        '!projects/components/src/app/shared/components/datepicker/aileron-i18n/i18n.model.ts',
        '!projects/components/src/app/shared/components/datepicker/util/popup.ts',
        '!projects/components/src/app/shared/components/datepicker/util/focus-trap.ts',
        '!projects/components/src/app/shared/components/datepicker/util/autoclose.ts',
        '!projects/components/src/app/shared/components/datepicker/util/scrollbar.ts',
        '!projects/components/src/app/modules/book/booking-datepicker-config.ts',
        '!projects/components/src/app/modules/checkin/**/*.ts',
        '!projects/components/src/app/modules/manage-trips/**/*.ts',
        '!projects/components/src/app/shared/components/tabs/**/*.ts',
        '!projects/components/**/index.ts'
    ],
    coverageDirectory: '<rootDir>/dist/coverage',
    coverageReporters: [
        'json-summary',
        'html'
    ],
    coverageThreshold: {
        global: {
            // global thresholds
            branches: 50,
            functions: 60,
            lines: 55,
            statements: 50
        }
    },
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: 'dist',
                outputName: 'junit/junit.xml',
                usePathForSuiteName: true,
                suiteNameTemplate: '{filename}',
                classNameTemplate: '{classname}',
                titleTemplate: '{title}'
            }
        ]
    ],
    testEnvironment: 'jest-environment-jsdom-thirteen',
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/projects/components/src/app/modules/hero/',
        '<rootDir>/projects/components/src/app/modules/booking/',
        '<rootDir>/projects/components/src/app/modules/checkin/',
        '<rootDir>/projects/components/src/app/modules/flight-status/',
        '<rootDir>/projects/components/src/app/modules/manage-trips/',
        '<rootDir>/projects/components/src/app/shared/components/tabs/',
    ],
    verbose: false
};
