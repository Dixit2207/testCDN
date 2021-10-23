import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import localePt from '@angular/common/locales/pt';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { BookModule } from '@modules/book';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlightStatusModule } from '@modules/flight-status';

registerLocaleData(localeFr);
registerLocaleData(localeEs);
registerLocaleData(localePt);

@NgModule({
    declarations: [AppComponent],
    imports: [
        CoreModule,
        // BookingModule should only be included when tabs are included for deployment
        // When tabs are ready, BookingModule will be included and the 4 individual modules will be removed
        // BookingModule,
        // BookModule,
        // CheckinModule,
        FlightStatusModule,
        // ManageTripsModule,
        // Adding HeroModule adds bulk to scripts so include only when ready to integrate
        // HeroModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule {
}
