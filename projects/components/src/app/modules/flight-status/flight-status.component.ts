import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18NextPipe } from 'angular-i18next';
import { MarkdownService } from 'ngx-markdown';

@Component({
    selector: 'hp-flight-status',
    templateUrl: './flight-status.component.html',
    styleUrls: ['./flight-status.component.scss']
})
export class FlightStatusComponent implements OnInit {
    inputForm: FormGroup;

    constructor(private i18NextPipe: I18NextPipe,
                private markdownService: MarkdownService,
                private window: Window,
                private formBuilder: FormBuilder) {
        this.initForm();
    }

    ngOnInit(): void {
    }

    submitForm(inputForm: FormGroup) {
        this.inputForm.markAllAsTouched();
    }

    public translate(key: string, isMarkdown = false, options = {}): string {
        const opts = { ...options, returnObjects: true, escapeValue: false };
        if (isMarkdown) {
            return this.markdownService.compile(this.i18NextPipe.transform(key, opts));
        }
        return this.i18NextPipe.transform(key, opts);
    }

    private initForm() {
        this.inputForm = this.formBuilder.group(
            {
                originAirport: ['', Validators.required],
                toAirport: ['', Validators.required],
                departureDate: ['', Validators.required]
            },
            { updateOn: 'submit' }
        );
    }
}
