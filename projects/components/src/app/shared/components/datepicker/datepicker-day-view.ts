import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { AilDate } from './ail-date';
import { AilDatepickerI18n } from './datepicker-i18n';

@Component({
    selector: '[ailDatepickerDayView]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./datepicker-day-view.scss'],
    host: {
        'class': 'btn-light',
        '[class.bg-primary]': 'selected',
        '[class.text-white]': 'selected',
        '[class.text-muted]': 'isMuted()',
        '[class.outside]': 'isMuted()',
        '[class.active]': 'focused'
    },
    template: '{{ i18n.getDayNumerals(date) }}'
})
export class AilDatepickerDayView {
    @Input() currentMonth: number;
    @Input() date: AilDate;
    @Input() disabled: boolean;
    @Input() focused: boolean;
    @Input() selected: boolean;

    constructor(public i18n: AilDatepickerI18n) {
    }

    isMuted() {
        return !this.selected && (this.date.month !== this.currentMonth || this.disabled);
    }
}
