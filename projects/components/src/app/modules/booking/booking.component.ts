import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabItem } from '@modules/booking/tab-item';
import { I18NEXT_SERVICE, I18NextPipe, ITranslationService } from 'angular-i18next';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'hp-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
    public tabsInitialized: boolean = false;
    public tabs: TabItem[];
    public tabName: string;
    public selectedTab: string;
    public activeRoute: any;
    public activeTab: TabItem;

    constructor(
        @Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService,
        private i18NextPipe: I18NextPipe,
        private router: Router,
        private route: ActivatedRoute,
        private window: Window,
        private logger: NGXLogger
    ) {
        this.tabs = [
            {
                label: 'tabs.book',
                route: 'book',
                id: 'tab-book'
            },
            {
                label: 'tabs.manageTrips',
                route: 'manage-trips',
                id: 'tab-manage-trips'
            },
            {
                label: 'tabs.checkin',
                route: 'check-in',
                id: 'tab-checkin'
            },
            {
                label: 'tabs.flightStatus',
                route: 'flight-status',
                id: 'tab-flight-status'
            }
        ];

        this.selectedTab = this.tabs[0].id;

        this.router.navigate(['book'], { skipLocationChange: true }).then(() => {
            // default to "book" route
        });
    }

    /*    @HostListener('selectedTabChange', ['$event.target.id'])
        handleSelectedTabChange(tabId: string) {
            this.logger.debug('handleSelectedTabChange fired!');
        }*/

    public async ngOnInit(): Promise<void> {
        this.i18NextService.events.initialized.subscribe(rs => {
            if (rs) {
                this.loadNamespaces();
            }
        });
    }

    select(tab: string) {
        this.logger.log(`Selected tab => ${this.selectedTab}`);
        this.selectedTab = tab;
    }

    public translate(key: string, options = {}): string {
        return this.i18NextPipe.transform(key, options);
    }

    private loadNamespaces(): void {
        this.i18NextService.loadNamespaces(['common', 'error']).then(() => {
            // console.log("loaded namespaces:" + r);
            // console.log("default language:" + this.i18NextService.languages[0]);
            // console.log("Translating key tabs.book" + this.i18NextPipe.transform("tabs.book", {}));
            this.tabsInitialized = true;
        });
    }
}
