import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'dp-header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss']
})

export class DatepickerHeaderComponent {
    @Input() mobileLabel = 'Depart/Return';

    @Output() closed = new EventEmitter<any>();

    constructor() {
    }
};
