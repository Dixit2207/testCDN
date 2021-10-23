import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18NEXT_SERVICE, I18NextPipe, ITranslationService } from 'angular-i18next';
import { MarkdownService } from 'ngx-markdown';

@Component({
    selector: 'hp-manage-trips',
    templateUrl: './manage-trips.component.html',
    styleUrls: ['./manage-trips.component.scss']
})
export class ManageTripsComponent implements OnInit {

    manageTripForm: FormGroup;
    submitted: boolean;
    errorCount = 0;
    firstErrorName = '';
    errorMessage = '';
    inputFormInitialized: boolean = false;

    constructor(private fb: FormBuilder,
                private changeRef: ChangeDetectorRef,
                @Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService,
                private i18NextPipe: I18NextPipe,
                private markdownService: MarkdownService
    ) {
        this.initForm();
    }

    ngOnInit() {
        this.inputFormInitialized = true;
        this.changeRef.detectChanges();
    }

    public submitForm(inputForm: FormGroup) {
        this.submitted = true;
        this.manageTripForm.markAllAsTouched(); // Needed in order to set invalid fields red if they haven't been touched
        this.getErrorCount(this.manageTripForm);

        if (this.errorCount > 0) {
            /**
             * @TODO - should not need to a timeout
             */
            // eslint-disable-next-line angular/timeout-service
            setTimeout(() => {
                // this will make the execution after the above boolean has changed
                // this.errorCountControl.nativeElement.querySelector("a").focus();
            }, 0);
        }
    }

    getErrorCount(formGroup: FormGroup) {
        let errorCount = 0;
        const errors = [];

        for (const control in formGroup.controls) {
            if (formGroup.controls[control].errors) {
                errorCount += 1; // Adds to the amount of errors
                errors.push(control); // Adds the name of the control to an array of errors
            }
        }

        this.firstErrorName = errors[0];

        if (this.errorCount > 1) {
            this.errorMessage = this.translate('error:ERRCODE408.messageWithCount', false,
                { count: errorCount, errorField: this.firstErrorName });
        } else {
            this.errorMessage = this.translate('error:ERRCODE408.messageWithCount_plural', false,
                { count: errorCount, errorField: this.firstErrorName });
        }

        this.errorCount = errorCount;

    }

    public translate(key: string, isMarkdown = false, options = {}): string {
        const opts = { ...options, returnObjects: true, escapeValue: false };
        if (isMarkdown) {
            return this.markdownService.compile(this.i18NextPipe.transform(key, opts));
        }
        return this.i18NextPipe.transform(key, opts);
    }

    private initForm() {
        this.manageTripForm = this.fb.group(
            {
                findYourTripFor: [''],
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                recordLocator: ['', Validators.required]
            },
            { updateOn: 'submit' }
        );
    }

}
