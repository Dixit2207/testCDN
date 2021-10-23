/* Initialization in US English (customized for AA.com) for the datepicker from jQuery UI */
'use strict';

export const en = {
    name: 'en',
    closeText: 'Close',
    prevText: 'Prev',
    nextText: 'Next',
    currentText: 'Today',
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    weekHeader: 'Wk',
    dateFormat: 'mm/dd/yy',
    firstDay: 0,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: '',
    selectedSuffix: ' selected',
    keyboardInstructions: [
        '<div class="ui-datepicker-row-break"></div>',
        '<div class="dpInstructionsContainer" style="padding: 5px 10px; background-color: #ebeff0;">',
        '<hr style="margin: 5px 0"/>',
        '<p id="dpInstructions">To pick dates, type the date as <em>mm/dd/yyyy</em> or use these keys to interact with the calendar:</p>',
        '<ul class="list-basic" style="padding-left: 5px">',
        '<li><kbd>CTRL/COMMAND</kbd> and the arrow keys to move left, right, up or down.</li>',
        '<li><kbd>ENTER/RETURN</kbd> to select the highlighted date.</li>',
        '<li><kbd>ESC</kbd> to close the datepicker.</li>',
        '</ul>',
        '</div>'
    ].join('\n'),
    keyboardInstructionsScreenReader: 'To pick dates, type the date as mm/dd/yyyy or use these keys to interact with the calendar: CTRL or COMMAND and the arrow keys to move left, right, up or down; ENTER or RETURN to select the highlighted date; ESC to close the calendar.'
};
