// serve translations
import express from 'express';

// i18next in action...
import i18next from 'i18next';

import HttpBackend from 'i18next-http-backend';

const app = express();
app.use('/locales', express.static('src/assets/locales'));
app.listen(8080);
// const HttpBackend = require('../../cjs')

i18next.use(HttpBackend).init(
    {
        lng: 'en',
        fallbackLng: 'en',
        preload: ['en', 'de'],
        ns: ['translation'],
        defaultNS: 'translation',
        backend: {
            loadPath: 'http://localhost:8080/locales/{{lng}}/{{ns}}.json'
        }
    },
    (err, t) => {
        if (err) return console.error(err);
    }
);
