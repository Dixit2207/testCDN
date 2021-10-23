/* eslint-disable angular/document-service */
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Key } from './util/key';

export function getNavigationLinks(element: HTMLElement): HTMLElement[] {
    return <HTMLElement[]>Array.from(element.querySelectorAll('button'));
}

export function getMonthSelect(element: HTMLElement): HTMLSelectElement {
    return element.querySelectorAll('select')[0] as HTMLSelectElement;
}

export function getYearSelect(element: HTMLElement): HTMLSelectElement {
    return element.querySelectorAll('select')[1] as HTMLSelectElement;
}

export function createGenericTestComponent<T>(
    html: string,
    type: { new(...args: any[]): T },
    detectChanges = true
): ComponentFixture<T> {
    TestBed.overrideComponent(type, { set: { template: html } });
    const fixture = TestBed.createComponent(type);
    if (detectChanges) {
        fixture.detectChanges();
    }
    return fixture as ComponentFixture<T>;
}

export function createKeyEvent(
    key: Key,
    options: { type: 'keyup' | 'keydown' } = {
        type: 'keyup'
    }
) {
    const event = document.createEvent('KeyboardEvent') as any;
    const initEvent = (event.initKeyEvent || event.initKeyboardEvent).bind(event);
    initEvent(options.type, true, true, window, 0, 0, 0, 0, 0, key);
    Object.defineProperties(event, { which: { get: () => key } });

    return event;
}

export function triggerEvent(
    element: DebugElement | HTMLElement,
    eventName: string
) {
    const evt = document.createEvent('Event');
    evt.initEvent(eventName, true, false);
    (element instanceof DebugElement
            ? element.nativeElement
            : element
    ).dispatchEvent(evt);
}
