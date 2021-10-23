const fs = require('fs-extra');
const concat = require('concat');

const projectName = 'components';
const bundleName = 'homepage-webcomponents-bundle';

let filesES2015 = [
    './dist/' + projectName + '/polyfills-es2015.js',
    './dist/' + projectName + '/scripts.js',
    './dist/' + projectName + '/polyfill-webcomp.js',
    './dist/' + projectName + '/main-es2015.js'
];

let filesES5 = [
    './dist/' + projectName + '/polyfills-es5.js',
    './dist/' + projectName + '/scripts.js',
    './dist/' + projectName + '/polyfill-webcomp-es5.js',
    './dist/' + projectName + '/main-es5.js'
];

build = async (files, bundleName) => {
    files = files.filter(function(value, index, arr) {
        return fs.pathExistsSync(value);
    });

    await fs.ensureDir('./dist/' + projectName);
    await concat(files, './dist/' + projectName + '/' + bundleName + '.js');
};
build(filesES2015, bundleName + '-es2015');
build(filesES5, bundleName + '-es5');
