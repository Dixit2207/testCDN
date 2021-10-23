import { Dialog, DIALOG_DATA } from '@aileron/components';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { I18NEXT_SERVICE, I18NextPipe, ITranslationService } from 'angular-i18next';
import { MarkdownService } from 'ngx-markdown';
import { AirportService } from './airport.service';

@Component({
    selector: 'airport-lookup',
    templateUrl: './airport-dialog.component.html',
    styleUrls: ['./airport-dialog.component.scss']
})

export class AirportDialogComponent {

    airportForm: FormGroup;
    states: State[] = [];
    airports: Airport[] = [];
    countryCode: string;
    stateCode: string;
    airportCode: string;

    constructor(
        /**
         * @Optional() is used to suggest DIALOG_DATA is an optional dependency
         */
        @Optional() @Inject(DIALOG_DATA) public data: any,
        @Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService,
        private i18NextPipe: I18NextPipe,
        private markdownService: MarkdownService,
        private dialog: Dialog,
        private airportService: AirportService,
        private fb: FormBuilder
    ) {
        this.initForm();
    }

    public close() {
        this.dialog.closeAll();
    }

    public translate(key: string, isMarkdown = false, options = {}): string {
        const opts = { ...options, returnObjects: true, escapeValue: false };
        if (isMarkdown) {
            return this.markdownService.compile(this.i18NextPipe.transform(key, opts));
        }
        return this.i18NextPipe.transform(key, opts);
    }

    public selectCountry(event) {
        this.countryCode = event.target.value;
        this.stateCode = '';
        const locale = localStorage.getItem('i18nextLng');
        this.airportService.getStates(this.countryCode, locale).subscribe(rs => {
            this.states = rs;
            if (this.states && this.states.length < 1) {
                this.searchAirports();
            }
        });
    }

    public selectState(event) {
        this.stateCode = event.target.value;
        this.searchAirports();
    }

    public selectAirport(event) {
        event.preventDefault();
        this.airportCode = event.target.text;
        this.data.selectionEvent.emit(this.airportCode);
        this.close();
    }

    public searchAirports() {
        this.airportService.getAirports(this.countryCode, this.stateCode).subscribe(rs => {
            this.airports = rs;
        });
    }

    private initForm() {
        this.airportForm = this.fb.group({
            country: [''],
            state: ['']
        });
    }
}

export interface Country {
    code: string;
    name: string;
}

export interface State {
    code: string;
    name: string;
}

export interface Airport {
    city: string;
    name: string;
    code: string;
    countryCode: string;
    timeZone: string;
    formattedCityCountryName: string;
    aaserviced: string;
}
