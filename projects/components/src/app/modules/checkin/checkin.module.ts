import { SmallCalloutModule } from '@aileron/components';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { CoreModule } from '@core/core.module';
import { CheckinRoutingModule } from './checkin-routing.module';
import { CheckinComponent } from './checkin.component';

@NgModule({
    declarations: [
        CheckinComponent
    ],
    imports: [
        CoreModule,
        SmallCalloutModule,
        CheckinRoutingModule
    ],
    entryComponents: [CheckinComponent]
})
export class CheckinModule {

    constructor(private injector: Injector) {
        const checkinComponent = createCustomElement(CheckinComponent, { injector });
        customElements.define('hp-checkin', checkinComponent);
    }
}
