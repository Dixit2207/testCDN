import { Inject, Pipe, PipeTransform } from '@angular/core';
import { I18NEXT_SERVICE, I18NextPipe, ITranslationService } from 'angular-i18next';
import { MarkdownService } from 'ngx-markdown';

@Pipe({
    name: 'aai18n',
    pure: false
})
/**
 * Angular pipe used for scrubbing string objects with embedded markup
 */
export class AAi18nPipe implements PipeTransform {

    constructor(
        @Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService,
        private i18NextPipe: I18NextPipe,
        private markdownService: MarkdownService
    ) {
    }

    transform(key: any, isMarkdown = false, options = {}): any {
        const opts = { ...options, returnObjects: true, escapeValue: true };
        if (isMarkdown) {
            return this.markdownService.compile(this.i18NextPipe.transform(key, opts));
        }
        return this.i18NextPipe.transform(key, opts);
    }
}
