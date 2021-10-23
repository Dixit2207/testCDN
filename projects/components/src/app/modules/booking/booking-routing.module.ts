import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'book', loadChildren: () => import('../book/book.module').then(m => m.BookModule) },
    { path: 'manage-trips', loadChildren: () => import('../manage-trips/manage-trips.module').then(m => m.ManageTripsModule) },
    { path: 'check-in', loadChildren: () => import('../checkin/checkin.module').then(m => m.CheckinModule) },
    { path: 'flight-status', loadChildren: () => import('../flight-status/flight-status.module').then(m => m.FlightStatusModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookingRoutingModule {
}
