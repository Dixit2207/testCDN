import { SmallCalloutModule } from '@aileron/components';
import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { CoreModule } from '@core/core.module';
import { BookRoutingModule } from '@modules/book/book-routing.module';
import { BookComponent } from '@modules/book/book.component';
import { BookService } from '@modules/book/book.service';
import { AirportAutocompleteModule, AirportDialogModule } from '@shared/components/airport';
import { AilDatepickerModule, AilDatepickerService } from '@shared/components/datepicker';
import {PreviousSearchesService} from '@modules/book/previous-searches.service';

@NgModule({
    declarations: [
        BookComponent
    ],
    imports: [
        CoreModule,
        SmallCalloutModule,
        AilDatepickerModule,
        AirportDialogModule,
        AirportAutocompleteModule,
        BookRoutingModule
    ],
    providers: [AilDatepickerService, BookService, PreviousSearchesService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [BookComponent]
})
export class BookModule {
    constructor(private injector: Injector) {
        const bookComponent = createCustomElement(BookComponent, { injector });
        customElements.define('hp-book', bookComponent);
    }
}
