import { SmallCalloutModule } from '@aileron/components';
import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { CoreModule } from '@core/core.module';
import { FlightStatusRoutingModule } from '@modules/flight-status/flight-status-routing.module';
import { FlightStatusComponent } from '@modules/flight-status/flight-status.component';
import { Button } from '@aileron/button';
import { Ripple } from '@aileron/ripple';

@NgModule({
    declarations: [
        FlightStatusComponent
    ],
    imports: [
        CoreModule,
        SmallCalloutModule,
        FlightStatusRoutingModule
    ],
    providers: [Button, Ripple],
    exports: [
        FlightStatusComponent
    ],
    entryComponents: [FlightStatusComponent],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class FlightStatusModule {
    constructor(private injector: Injector) {
        const flightStatusComponent = createCustomElement(FlightStatusComponent, { injector });
        customElements.define('hp-flight-status', flightStatusComponent);
    }
}
