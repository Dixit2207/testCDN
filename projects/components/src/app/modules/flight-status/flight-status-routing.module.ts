import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightStatusComponent } from '@modules/flight-status/flight-status.component';
// import { I18NEXT_NAMESPACE_RESOLVER } from "angular-i18next";

const routes: Routes = [{
    path: '',
    component: FlightStatusComponent
    // loadChildren: () => import("./book.module").then(m => m.BookModule),
    // data: { i18nextNamespaces: ["common", "error"] },
    // resolve: { i18next: I18NEXT_NAMESPACE_RESOLVER }
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    // providers: [{ provide: LocationStrategy, useClass: NoopLocationStrategy }],
    exports: [RouterModule]
})
export class FlightStatusRoutingModule {
}
