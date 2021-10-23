import { Injectable } from '@angular/core';
import { AilDateStruct } from '../ail-date-struct';
import { isInteger } from '../util/util';

export function AIL_DATEPICKER_DATE_ADAPTER_FACTORY() {
    return new AilDateStructAdapter();
}

/**
 * An abstract service that does the conversion between the internal datepicker `AilDateStruct` model and
 * any provided user date model `D`, ex. a string, a native date, etc.
 *
 * The adapter is used **only** for conversion when binding datepicker to a form control,
 * ex. `[(ngModel)]="userDateModel"`. Here `userDateModel` can be of any type.
 *
 * The default datepicker implementation assumes we use `AilDateStruct` as a user model.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details
 * and the [custom adapter demo](#/components/datepicker/examples#adapter) for an example.
 */
@Injectable({ providedIn: 'root', useFactory: AIL_DATEPICKER_DATE_ADAPTER_FACTORY })
export abstract class AilDateAdapter<D> {
    /**
     * Converts a user-model date of type `D` to an `AilDateStruct` for internal use.
     */
    abstract fromModel(value: D): AilDateStruct;

    /**
     * Converts an internal `AilDateStruct` date to a user-model date of type `D`.
     */
    abstract toModel(date: AilDateStruct): D;
}

@Injectable()
export class AilDateStructAdapter extends AilDateAdapter<AilDateStruct> {
    /**
     * Converts a AilDateStruct value into AilDateStruct value
     */
    fromModel(date: AilDateStruct): AilDateStruct {
        return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
            { year: date.year, month: date.month, day: date.day } :
            null;
    }

    /**
     * Converts a AilDateStruct value into AilDateStruct value
     */
    toModel(date: AilDateStruct): AilDateStruct {
        return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
            { year: date.year, month: date.month, day: date.day } :
            null;
    }
}
