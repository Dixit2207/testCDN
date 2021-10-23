module.exports = {
    root: true,
    env: {
        es6: true,
        browser: true,
        node: true
    },
    extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        // "plugin:@angular-eslint/template/process-inline-templates"
        'plugin:angular/johnpapa'
    ],
    globals: {
        angular: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6,
        ecmaFeatures: {
            modules: true
        },
        extraFileExtensions: [
            '.html'
        ]
    },
    plugins: [
        '@typescript-eslint',
        'no-loops'
    ],
    rules: {
        '@angular-eslint/component-class-suffix': ['warn'],
        '@angular-eslint/directive-class-suffix': ['warn'],
        '@angular-eslint/no-empty-lifecycle-method': ['warn'],
        '@angular-eslint/no-host-metadata-property': ['warn'],
        '@angular-eslint/no-output-native': ['warn'],
        'angular/typecheck-array': 0,
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/naming-convention': [
            'warn',
            {
                'selector': 'default',
                'format': ['camelCase']
            }, {
                'selector': 'objectLiteralProperty',
                'format': ['camelCase', 'UPPER_CASE']
            },
            {
                'selector': 'variable',
                'format': ['camelCase', 'UPPER_CASE']
            },
            {
                'selector': 'parameter',
                'format': ['camelCase'],
                'leadingUnderscore': 'allow'
            },
            {
                'selector': 'memberLike',
                'modifiers': ['private'],
                'format': ['camelCase'],
                'leadingUnderscore': 'require'
            },
            {
                'selector': 'typeLike',
                'format': ['PascalCase']
            }
        ],
        '@typescript-eslint/no-empty-function': ['warn'],
        'angular/angularelement': 1,
        'angular/component-limit': [0, 1],
        'angular/controller-as': 2,
        'angular/controller-as-route': 2,
        'angular/controller-as-vm': [2, 'vm'],
        'angular/controller-name': [2, '/[A-Z].*Controller$/'],
        'angular/deferred': 0,
        'angular/definedundefined': 0,
        'angular/di': [2, 'function'],
        'angular/di-order': [0, true],
        'angular/directive-name': 0,
        'angular/document-service': 0,
        'angular/empty-controller': 0,
        'angular/file-name': 0,
        'angular/filter-name': 0,
        'angular/foreach': 0,
        'angular/function-type': 0,
        'angular/interval-service': 2,
        'angular/log': 1,
        'angular/module-getter': 2,
        'angular/module-name': 0,
        'angular/module-setter': 2,
        'angular/no-angular-mock': 0,
        'angular/no-controller': 0,
        'angular/no-cookiestore': 2,
        'angular/no-jquery-angularelement': 2,
        'angular/no-private-call': 2,
        'angular/no-service-method': 2,
        'angular/no-services': [2, ['$http', '$resource', 'Restangular']],
        'angular/on-watch': 2,
        'angular/rest-service': 0,
        'angular/service-name': [2, 'prefix', { 'oldBehavior': false }],
        'angular/timeout-service': 0,
        'angular/typecheck-date': 2,
        'angular/typecheck-function': 2,
        'angular/typecheck-number': 0,
        'angular/typecheck-object': 2,
        'angular/typecheck-string': 0,
        'angular/watchers-execution': [0, '$digest'],
        'angular/window-service': 0,
        'camelcase': 'off',
        'no-console': 2,
        'no-debugger': 'off',
        'no-empty-function': 'off',
        'no-loops/no-loops': 1,
        'no-use-before-define': 0,
        'quotes': ['error', 'single']
        /*"@typescript-eslint/camelcase": [
           "error",
           {
               properties: "always",
               allow: [
                   // "APP_INITIALIZER",
                   // "LOCALE_ID",
                   // "error_id",
                   // "event_action",
                   // "event_category",
                   // "event_name",
                   // "http_proxy",
                   // "no_view",
                   // "page_name",
                   // "site_country",
                   // "site_indicator",
                   // "site_language",
                   // "tealium_environment",
                   // "tealium_profile",
                   // "time_stamp",
                   // "utag_cfg_ovrd",
                   // "utag_data"
               ]
           }
       ],*/
    },
    overrides: [
        /**
         * -----------------------------------------------------
         * TYPESCRIPT FILES (COMPONENTS, SERVICES ETC) (.ts)
         * -----------------------------------------------------
         */
        {
            files: ['projects/components/src/*.ts']
            // ... config specific to TypeScript files
        },

        /**
         * -----------------------------------------------------
         * COMPONENT TEMPLATES
         * -----------------------------------------------------
         */
        {
            files: ['projects/components/src/*.component.html']
            // ... config specific to Angular Component templates
        },

        /**
         * -----------------------------------------------------
         * EXTRACT INLINE TEMPLATES (from within .component.ts)
         * -----------------------------------------------------
         */
        {
            files: ['projects/components/src/*.component.ts'],
            // ... applies a special processor to extract the template
            extends: ['plugin:@angular-eslint/template/process-inline-templates']
        }
    ]
};
