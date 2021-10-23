import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'booking-tabs',
    styleUrls: ['./tabs.scss'],
    templateUrl: './tabs.component.html'
})

export class TabsComponent implements OnInit {

    constructor(
        private logger: NGXLogger
    ) {
    }

    ngOnInit(): void {
        this.logger.debug('Tabs component has been successfully loaded');
    }
}
