import { SmallCalloutModule } from '@aileron/components';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { CoreModule } from '@core/core.module';
import { ManageTripsComponent, ManageTripsRoutingModule } from '@modules/manage-trips';

@NgModule({
    declarations: [
        ManageTripsComponent
    ],
    imports: [
        CoreModule,
        SmallCalloutModule,
        ManageTripsRoutingModule
    ],
    exports: [
        ManageTripsComponent
    ],
    entryComponents: [ManageTripsComponent]
})
export class ManageTripsModule {

    constructor(private injector: Injector) {
        const manageTripsComponent = createCustomElement(ManageTripsComponent, { injector });
        customElements.define('hp-manage-trips', manageTripsComponent);
    }
}
