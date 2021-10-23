import { Component, OnInit } from '@angular/core';
import { environment } from 'env';

@Component({
    selector: 'hp-hero',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
    public baseHref = environment.baseHref;

    constructor() {
    }

    ngOnInit() {
    }
}
