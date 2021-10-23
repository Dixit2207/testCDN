import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as INSTRUCTIONS from '../aileron-i18n/keyboard/translations';
import * as aileroni18nTranslations from '../aileron-i18n/translation';

@Component({
    selector: 'dp-footer',
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss']
})
export class DatepickerFooterComponent implements OnInit {
    @Output() closed = new EventEmitter<any>();
    @Output() today = new EventEmitter<any>();
    @Input() locale = 'en';
    i18nTranslation = aileroni18nTranslations;

    /**
     * Set this to true when you want instructions to be displayed
     */
    additionInformation = false;

    instructions = INSTRUCTIONS;

    constructor() {
    }

    ngOnInit() {
    }
}
