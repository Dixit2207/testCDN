module.exports = {
    files: [
        './homepage-client/src/!**!/!*.{html,css,js,ts}',
        './components/dist/components/**/*.{html,css,js,ts}'
    ],
    injectChanges: true,
    logConnections: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'AA-HOMEPAGE-BROWSERSYNC',
    logSnippet: true,
    middleware: false,
    minify: true,
    notify: {
        styles: [
            'padding: 6px 15px 3px;',
            'position: fixed;',
            'font-size: 0.8em;',
            'z-index: 9999;',
            'right: 5px;',
            'top: 5px;',
            'color: rgb(74, 74, 74);',
            'background-color: rgb(17, 17, 17, .8);',
            'color: rgb(229, 229, 229);'
        ]
    },
    open: false,
    port: 3000,
    proxy: 'http://localhost:4200',
    /*proxy: {
        target: "http://localhost:4200",
    },*/
    reloadOnRestart: true,
    server: false,
    /*server: {
        baseDir: "./homepage-client/src",
    },*/
    serveStatic: [
        // "./booking/dist/booking/**/*.{html,css,js,ts}",
        // "./hero/dist/hero/!**/!*.{html,htm,css,js,ts}",
    ],
    watchEvents: [
        'add',
        'addDir',
        'change',
        'unlink',
        'unlinkDir'
    ],
    single: true,
    watchOptions: {
        ignoreInitial: true,
        ignored: ['*.js', '*.txt', 'node_modules']
    }
};
