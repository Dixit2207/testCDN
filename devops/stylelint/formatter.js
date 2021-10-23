/* eslint:disabled */
const chalk = require('chalk');
const filter = require('lodash.filter');
const flatMap = require('lodash.flatmap');
const forEach = require('lodash.foreach');
const map = require('lodash.map');
const orderBy = require('lodash.orderby');
const find = require('lodash.find');
const padStart = require('lodash.padstart');
const max = require('lodash.max');
const { relative } = require('path');

const RED = chalk.hex('#F52305');
const GRAY = chalk.hex('#9DA6AB');
const BLUE = chalk.hex('#0078D2');
const GREEN = chalk.hex('#008712');
const YELLOW = chalk.yellow;

// const failIcon = RED.bold('✘')
const failIcon = RED(' \u{274C} ');
// const warnIcon = YELLOW.bold('⚠')
const warnIcon = YELLOW.bold(' \u{26A0} ');
const greenCheckIcon = ' \u{2705} ';

const isProd = !process.env.NODE_ENV || process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const stats = results => {
    let errors = orderBy(results.error, ['count'], ['desc']);
    let warnings = orderBy(results.warning, ['count'], ['desc']);

    if (isDev && errors.length === 0 && warnings.length === 0) {
        return '\n' + greenCheckIcon + ' ' + GREEN.bold('No Linting Errors!!\n');
    }

    let stats = '\n';

    if (errors.length > 0 && warnings.length > 0) {
        stats =
            stats +
            BLUE.bold(`${results.errorCount + results.warningCount} problems (`) +
            RED(`${results.errorCount} Errors`) +
            BLUE.bold(', ') +
            chalk.yellow(`${results.warningCount} Warnings`) +
            BLUE.bold(')') +
            '\n\n';
    } else if (errors.length > 0) {
        stats = stats + RED(`${results.errorCount} Errors`) + '\n\n';
    } else if (warnings.length > 0) {
        stats = stats + chalk.yellow(`${results.warningCount} Warnings`) + '\n\n';
    }

    let errorPaddingSize = errors.length ? errors[0].count.toString().length : 0;
    let warningPaddingSize = warnings.length ? warnings[0].count.toString().length : 0;

    let paddingSize = max([errorPaddingSize, warningPaddingSize]) + 1;

    if (errors.length > 0) {
        stats = stats + failIcon + RED(' Errors:\n');

        forEach(errors, error => {
            stats =
                stats +
                padStart(error.count, paddingSize) +
                `  ${chalk.underline(`https://stylelint.io/user-guide/rules/${error.rule}`)}\n`;
        });

        stats = stats + '\n';
    }

    if (warnings.length > 0) {
        stats = stats + warnIcon + chalk.yellow(' Warnings:\n');

        forEach(warnings, warning => {
            stats =
                stats +
                padStart(warning.count, paddingSize) +
                `  ${chalk.underline(`https://stylelint.io/user-guide/rules/${warning.rule}`)}\n`;
        });
    }

    return stats + '\n';
};

module.exports = results => {
    let _stats = {
        error: [],
        errorCount: 0,
        warning: [],
        warningCount: 0
    };

    let report = flatMap(results, result => {
        if (isProd) {
            result.warnings = filter(result.warnings, warning => warning.severity == 'error');
        }

        let currentFile = null;
        let icon = null;
        let message = null;
        let relativeFilePath = null;
        let startLine = '';

        // console.log(results);

        return map(result.warnings, warning => {
            icon = warning.severity === 'warning' ? warnIcon : failIcon;
            message = warning.text.replace(/\s\(.+\)$/g, '');
            relativeFilePath = relative('.', result.source);

            if (warning.severity === 'error') {
                _stats.errorCount = _stats.errorCount + 1;
            } else if (warning.severity === 'warning') {
                _stats.warningCount = _stats.warningCount + 1;
            }

            // console.log(warning);
            // console.log(`warnings :: ${ _stats.warningCount }`);

            let x = find(_stats[warning.severity], { rule: warning.rule });

            if (x === undefined) {
                _stats[warning.severity].push({
                    rule: warning.rule,
                    count: 1
                });
            } else {
                x.count = x.count + 1;
            }
            message = message.replace(/\B"(.*?)"\B|\B'(.*?)'\B/g, (m, p1, p2) => chalk.bold(p1 || p2));

            if (currentFile === null) {
                startLine = '\n\n';
            } else {
                startLine = '';
            }

            currentFile = relativeFilePath;

            return (
                startLine +
                `${icon} ` +
                // `\t` +
                `${message}` +
                ` ${chalk.gray.dim(warning.rule)} ` +
                '\t' +
                `${chalk.underline(`${relativeFilePath}:${warning.line}:${warning.column}`)}` +
                '\t' +
                `[${chalk.cyan.underline(`https://stylelint.io/user-guide/rules/${warning.rule}`)}]`
            );
        });
    }).join(`\n`);

    return report + stats(_stats);
};
