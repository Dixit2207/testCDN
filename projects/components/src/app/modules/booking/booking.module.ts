import { SmallCalloutModule } from '@aileron/components';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatIconModule } from '@angular/material/icon';
import { MAT_TABS_CONFIG, MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CoreModule } from '@core/core.module';
import { BookingRoutingModule } from '@modules/booking/booking-routing.module';
import { BookingComponent } from '@modules/booking/booking.component';

@NgModule({
    declarations: [
        BookingComponent
    ],
    imports: [
        CoreModule,
        // BookModule,
        // CheckinModule,
        // FlightStatusModule,
        // ManageTripsModule,
        MatToolbarModule,
        MatTabsModule,
        MatIconModule,
        SmallCalloutModule,
        BookingRoutingModule
    ],
    providers: [{ provide: MAT_TABS_CONFIG, useValue: { disablePagination: true, animationDuration: '0ms' } }],
    entryComponents: [BookingComponent]
})
export class BookingModule {
    constructor(private injector: Injector) {
        const bookingComponent = createCustomElement(BookingComponent, { injector });
        customElements.define('hp-booking', bookingComponent);
    }
}
