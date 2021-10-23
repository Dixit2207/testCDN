import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from '@modules/book/book.component';
// import { I18NEXT_NAMESPACE_RESOLVER } from "angular-i18next";

const routes: Routes = [{
    path: '',
    component: BookComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookRoutingModule {
}
