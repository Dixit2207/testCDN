import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HeroComponent } from './hero.component';

@NgModule({
    declarations: [HeroComponent],
    imports: [
        CommonModule
    ],
    entryComponents: [HeroComponent]
})
export class HeroModule {
    constructor(private injector: Injector) {
        const heroElement = createCustomElement(HeroComponent, { injector });
        customElements.define('hp-hero', heroElement);
    }
}
