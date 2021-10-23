import { AilDate } from '@shared/components/datepicker/ail-date';
import moment, {Moment} from 'moment';

export class DateUtil {
    /**
     * Parses a string date with a specific format into a Moment date.
     * Acceptable formats are mm/dd/yyyy and dd/mm/yyyy.
     * @param dateStr, date string to parse.
     * @param format, param dateStr format.
     */
    static parse(dateStr: string, format: string): Moment {
        if (dateStr && format) {
            const [datePart1, datePart2, datePart3] = dateStr.split('/');

            if (!this.validMonth(datePart1) || !this.validDay(datePart2) || !this.validYear(datePart3)) {
                return null;
            }

            const [formatPart1, formatPart2, formatPart3] = format.split('/');

            if (!this.validMonth(formatPart1) || !this.validDay(formatPart2) || !this.validYear(formatPart3)) {
                return null;
            }

            const { yyyy: year, mm: month, dd: day }: any = {
                [formatPart1]: +datePart1,
                [formatPart2]: +datePart2,
                [formatPart3]: +datePart3
            };
            return moment([year, month, day]);
        }
        return null;
    }

    static validMonth(month: string): boolean {
        return month && (month.length === 1 || month.length === 2);
    }

    static validDay(day: string): boolean {
        return day && (day.length === 1 || day.length === 2);
    }

    static validYear(year: string): boolean {
        return year && year.length === 4;
    }
}
