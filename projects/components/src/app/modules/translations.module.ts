import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { defaultInterpolationFormat, I18NEXT_SERVICE, I18NextModule, I18NextPipe, I18NextTitle, ITranslationService } from 'angular-i18next';
import { environment } from 'env';
import i18nextLanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

export const SUPPORTED_LOCALES = ['en_US', 'es', 'fr', 'pt'];

const order = ['contentLocale', 'querystring', 'cookie', 'htmlTag'];

export const url = environment.baseHref;

export const i18nextOptions = {
    backend: {
        loadPath: `${url}/assets/locales/{{lng}}/{{ns}}.json`,
        crossDomain: true,
        customHeaders: {
            'Access-Control-Allow-Origin': `${environment.server}`,
            'Origin': `${environment.server}`
        },
        overrideMimeType: false,
        requestOptions: {
            // used for fetch, can also be a function (payload) => ({ method: 'GET' })
            mode: 'cors',
            credentials: 'same-origin',
            cache: 'default'
        }
    },
    debug: false,
    defaultNS: 'common',
    fallbackLng: 'en_US',
    interpolation: {
        format: I18NextModule.interpolationFormat(defaultInterpolationFormat)
    },
    nonExplicitWhitelist: true,
    ns: ['common', 'error'],
    returnEmptyString: false,
    whitelist: SUPPORTED_LOCALES
};

export const languageDetector = new i18nextLanguageDetector(null, {
    lookupCookie: 'sessionLocale',
    lookupQuerystring: 'locale',
    order
});

languageDetector.detect = function(): string {
    // console.log(`URL Loading Path => [${url}]`);

    let detected = [];

    order.forEach(detectorName => {
        if (this.detectors[detectorName]) {
            let lookup = this.detectors[detectorName].lookup(this.options);

            if (lookup && typeof lookup === 'string') {
                lookup = [lookup.replace('_', '-')];
            }

            if (lookup) {
                detected = detected.concat(lookup);
            }
        }
    });

    let found;

    detected.forEach(lng => {
        if (found) {
            return;
        }

        const cleanedLng = this.services.languageUtils.formatLanguageCode(lng);

        if (this.services.languageUtils.isSupportedCode(cleanedLng)) {
            found = cleanedLng;
        }
    });

    if (!found) {
        let fallbacks = this.i18nOptions.fallbackLng;

        if (typeof fallbacks === 'string') {
            fallbacks = [fallbacks];
        }

        if (!fallbacks) {
            fallbacks = [];
        }

        found =
            Object.prototype.toString.apply(fallbacks) === '[object Array]'
                ? fallbacks[0]
                : fallbacks[0] || (fallbacks.default && fallbacks.default[0]);
    }

    return found;
};

export function appInit(i18next: ITranslationService) {
    return () => i18next.use(HttpApi).use(languageDetector).init(i18nextOptions);
}

export function localeIdFactory(i18next: ITranslationService): string {
    return i18next.language;
}

export const I18N_PROVIDERS = [
    {
        provide: APP_INITIALIZER,
        useFactory: appInit,
        deps: [I18NEXT_SERVICE],
        multi: true
    },
    {
        provide: Title,
        useClass: I18NextTitle
    },
    {
        provide: LOCALE_ID,
        deps: [I18NEXT_SERVICE],
        useFactory: localeIdFactory
    }
];

@NgModule({
    imports: [I18NextModule.forRoot()],
    providers: [I18N_PROVIDERS, I18NextPipe]
})
export class TranslationsModule {
}
