import { DialogModule } from '@aileron/components';
import { NgModule } from '@angular/core';
import { CoreModule } from '@core/core.module';
import { AirportDialogComponent } from '@shared/components/airport/airport-dialog.component';

@NgModule({
    declarations: [
        AirportDialogComponent
    ],
    imports: [
        CoreModule,
        DialogModule
    ],
    providers: [],
    entryComponents: [AirportDialogComponent]

})

export class AirportDialogModule {
}
