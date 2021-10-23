import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18NEXT_SERVICE, I18NextPipe, ITranslationService } from 'angular-i18next';
import { MarkdownService } from 'ngx-markdown';

@Component({
    selector: 'hp-checkin',
    templateUrl: './checkin.component.html',
    styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {
    @ViewChild('firstName', { read: ElementRef, static: true }) firstNameControl: ElementRef;
    @ViewChild('lastName', { read: ElementRef, static: true }) lastNameControl: ElementRef;
    @ViewChild('pnr', { read: ElementRef, static: true }) departDateControl: ElementRef;
    @ViewChild('ticketNumber', { read: ElementRef, static: true }) returnDateControl: ElementRef;

    inputForm: FormGroup;

    constructor(@Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService,
                private i18NextPipe: I18NextPipe,
                private markdownService: MarkdownService,
                private formBuilder: FormBuilder) {
        this.initForm();
    }

    ngOnInit() {
    }

    public submitForm(inputForm: FormGroup) {

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
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                recordLocator: [''],
                ticketNumber: ['']
            },
            { updateOn: 'submit' }
        );
    }
}
