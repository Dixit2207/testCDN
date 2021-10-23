import { ButtonModule, CheckboxModule, InputModule, LinkModule, LoaderModule, RadioModule } from '@aileron/components';
import { A11yModule } from '@angular/cdk/a11y';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationsModule } from '@modules/translations.module';
import { AAi18nPipe } from '@shared/pipes';
import { I18NextModule } from 'angular-i18next';
import { environment } from 'env';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

@NgModule({
    imports: [
        A11yModule,
        ButtonModule,
        CheckboxModule,
        CommonModule,
        RadioModule,
        FormsModule,
        I18NextModule,
        InputModule,
        LinkModule,
        LoaderModule,
        ReactiveFormsModule,
        LoggerModule.forRoot(
            {
                colorScheme: ['#00467f', '#0078d2', '#d0dae0', '#d0dae0', '#c30019', '#d14904', '#c30019'],
                level: environment.production ? NgxLoggerLevel.ERROR : NgxLoggerLevel.TRACE,
                enableSourceMaps: true
            }),
        MarkdownModule.forRoot({
            markedOptions: {
                provide: MarkedOptions,
                useValue: {
                    sanitize: true
                }
            }
        })
    ],
    declarations: [
        AAi18nPipe
    ],
    providers: [
        { provide: Window, useValue: window },
        { provide: APP_BASE_HREF, useValue: environment.baseHref }
    ],
    exports: [
        TranslationsModule,
        CommonModule,
        ButtonModule,
        CheckboxModule,
        RadioModule,
        FormsModule,
        ReactiveFormsModule,
        LinkModule,
        InputModule,
        I18NextModule,
        LoaderModule,
        A11yModule,
        LoggerModule,
        MarkdownModule,
        AAi18nPipe
    ]
})

export class CoreModule {
}
