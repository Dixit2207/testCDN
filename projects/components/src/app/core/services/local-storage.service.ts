import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private readonly localStorage: Storage;

    constructor(private window: Window) {
        this.localStorage = this.window.localStorage;
    }

    private get isLocalStorageSupported(): boolean {
        return !!this.localStorage;
    }

    public get(key: string) {
        if (this.isLocalStorageSupported) {
            const val = this.localStorage.getItem(key);
            return val ? val : null;
        }
        return null;
    }

    public set(key: string, value: string | JSON): void {
        if (this.isLocalStorageSupported) {
            if (typeof value === 'string') {
                this.localStorage.setItem(key, value);
            } else {
                const jsonValue = JSON.stringify(value);
                this.localStorage.setItem(key, jsonValue);
            }
        }
    }

    public remove(key: string): boolean {
        if (this.isLocalStorageSupported) {
            this.localStorage.removeItem(key);
        }
        return;
    }

    public clear(): undefined {
        if (this.isLocalStorageSupported) {
            this.localStorage.clear();
        }
        return;
    }
}
