import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AirportAutocompleteComponent } from '@shared/components/airport/airport-autocomplete.component';
import { AirportService } from '@shared/components/airport/airport.service';
import { ListItemModule } from '@shared/components/list-item/list-item.module';

@NgModule({
    imports: [
        CommonModule,
        ListItemModule
    ],
    declarations: [
        AirportAutocompleteComponent
    ],
    exports: [
        AirportAutocompleteComponent
    ],
    providers: [AirportService],
    entryComponents: []
})

export class AirportAutocompleteModule {

}
