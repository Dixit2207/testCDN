import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AilDatepicker } from './ail-datepicker.component';
import { AilDatepickerDayView } from './datepicker-day-view';
import { AilInputDatepicker } from './datepicker-input';
import { AilDatepickerMonthView } from './datepicker-month-view';
import { AilDatepickerNavigation } from './datepicker-navigation';
import { AilDatepickerNavigationSelect } from './datepicker-navigation-select';
import { DatepickerFooterComponent } from './footer/footer.component';
import { DatepickerHeaderComponent } from './header/header.component';

export { AilDatepicker, AilDatepickerNavigateEvent, AilDatepickerState } from './ail-datepicker.component';
export { AilInputDatepicker } from './datepicker-input';
export { AilCalendar, AilPeriod, AilCalendarGregorian } from './ail-calendar';
export { AilDatepickerMonthView } from './datepicker-month-view';
export { AilDatepickerDayView } from './datepicker-day-view';
export { AilDatepickerNavigation } from './datepicker-navigation';
export { AilDatepickerNavigationSelect } from './datepicker-navigation-select';
export { AilDatepickerConfig } from './datepicker-config';
export { AilInputDatepickerConfig } from './datepicker-input-config';
export { AilDatepickerI18n } from './datepicker-i18n';
export { AilDateStruct } from './ail-date-struct';
export { AilDate } from './ail-date';
export { AilDateAdapter } from './adapters/ail-date-adapter';
export { AilDateNativeAdapter } from './adapters/ail-date-native-adapter';
export { AilDateNativeUTCAdapter } from './adapters/ail-date-native-utc-adapter';
export { AilDateParserFormatter } from './ail-date-parser-formatter';
export { AilDatepickerKeyboardService } from './datepicker-keyboard-service';
export { DatepickerHeaderComponent } from './header/header.component';
export { DatepickerFooterComponent } from './footer/footer.component';

@NgModule({
    declarations: [
        AilDatepicker, AilDatepickerMonthView, AilDatepickerNavigation, AilDatepickerNavigationSelect, AilDatepickerDayView,
        AilInputDatepicker, DatepickerHeaderComponent, DatepickerFooterComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule
    ],
    exports: [AilDatepicker, AilInputDatepicker],
    entryComponents: [AilDatepicker]
})
export class AilDatepickerModule {
}
