import fs from 'fs';
import Netstorage from 'netstorageapi';

export class Deployer {
    private CP_CODE_QA = '970107';
    private CP_CODE_PROD = '970108';
    private config = {
        hostname: 'ctw-nsu.akamaihd.net',
        keyName: process.env.CREDS_USR,
        key: process.env.CREDS_PSW,
        cpCode: this.CP_CODE_QA,
        ssl: true
    };
    private source = './dist/components';
    private ns: any;

    constructor() {
        const argv = require('minimist')(process.argv.slice(2));
        if (argv.qa) {
            console.log('Deploying to QA CDN');
        }
        if (argv.prod) {
            console.log('Deploying to PROD CDN');
        }

        this.config.keyName = process.env.CREDS_USR;
        this.config.key = process.env.CREDS_PSW;

        if (!this.config.keyName || !this.config.key) {
            const dotenv = require('dotenv').config();

            this.config.keyName = process.env.CREDS_USR;
            this.config.key = process.env.CREDS_PSW;

            if (!this.config.keyName || !this.config.key) {
                throw Error('keyName/key is missing.');
                process.exit(1);
            }
        }

        this.ns = new Netstorage(this.config);
        const files = this.getFileList(this.source, []);

        this.uploadAll(files).then((result) => {
            console.info('*** Upload completed ***');
        }, (error) => {
            throw Error('*** Upload FAILED ***');
        });
    }

    private async uploadAll(files: Array<string>) {
        const filePrefix = `/${this.config.cpCode}`;

        try {
            files.forEach(file => {
                const fileScrubbed = file.replace('./dist', '/homepage');
                const fileDest = `${filePrefix}${fileScrubbed}`;
                return this.ns.upload(file, fileDest, (error, response, body) => {
                    if (error) {
                        throw Error(`Got error: ${error.message}`);
                    }
                    return;
                });
            });
        } catch (e) {
            console.log(e);
        }
    }

    private getFileList(dirPath: string, files: Array<string>): Array<string> {
        try {
            const _files = fs.readdirSync(dirPath);

            let arrayOfFiles = files || [];

            _files.forEach(file => {
                if (fs.statSync(dirPath + '/' + file).isDirectory()) {
                    arrayOfFiles = this.getFileList(`${dirPath}/${file}`, arrayOfFiles);
                } else {
                    arrayOfFiles.push(`${dirPath}/${file}`);
                }
            });

            return arrayOfFiles;
        } catch (e) {
            throw Error(e);
        }
    }
}

new Deployer();
