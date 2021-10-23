import { ButtonModule, CheckboxModule, FooterModule, HeaderModule, InputModule, LinkModule, LoaderModule } from '@aileron/components';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { I18NextModule } from 'angular-i18next';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        A11yModule,
        BrowserModule,
        ButtonModule,
        CheckboxModule,
        CommonModule,
        FooterModule,
        FormsModule,
        HeaderModule,
        HttpClientModule,
        I18NextModule,
        InputModule,
        LinkModule,
        LoaderModule,
        ReactiveFormsModule,
        MarkdownModule.forRoot({
            markedOptions: {
                provide: MarkedOptions,
                useValue: {
                    sanitize: true
                }
            }
        }),
        LoggerModule.forRoot(
            {
                colorScheme: ['#00467f', '#0078d2', '#d0dae0', '#d0dae0', '#c30019', '#d14904', '#c30019'],
                level: NgxLoggerLevel.TRACE,
                enableSourceMaps: true
            }),
        AppRoutingModule],
    providers: [{ provide: Window, useValue: window }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule {
}
