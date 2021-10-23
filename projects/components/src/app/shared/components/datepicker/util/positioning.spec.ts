/* eslint-disable angular/document-service,angular/window-service */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Positioning } from './positioning';

describe('Positioning', () => {

    function createElement(
        height: number, width: number, marginTop: number, marginLeft: number, isAbsolute = false): HTMLElement {
        const el = document.createElement('div');
        if (isAbsolute) {
            el.style.position = 'absolute';
            el.style.top = '0';
            el.style.left = '0';
        }
        el.style.display = 'inline-block';
        el.style.height = height + 'px';
        el.style.width = width + 'px';
        el.style.marginTop = marginTop + 'px';
        el.style.marginLeft = marginLeft + 'px';

        return el;
    }

    function checkPosition(el: HTMLElement, top: number, left: number) {
        const transform = el.style.transform;
        expect(transform).toBe(`translate(${left}px, ${top}px)`);
    }

    let element, targetElement, positioning, documentMargin, bodyMargin;
    beforeAll(() => {
        positioning = new Positioning();
        documentMargin = document.documentElement.style.margin;
        bodyMargin = document.body.style.margin;

        document.documentElement.style.margin = '0';
        document.body.style.margin = '0';
    });

    afterAll(() => {
        document.documentElement.style.margin = documentMargin;
        document.body.style.margin = bodyMargin;
    });

    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [TestComponent] });
        const fixture = TestBed.createComponent(TestComponent);

        element = fixture.nativeElement.querySelector('#element');
        targetElement = fixture.nativeElement.querySelector('#targetElement');
    });

    it('should be defined - targetElement', () => {
        expect(targetElement).toBeDefined();
    });
});

@Component({
    template: `
        <div
            id="element"
            style="display: inline-block; height: 200px; width: 300px; margin-top: 100px; margin-left: 150px"
        ></div>
        <div
            id="targetElement"
            style="position:absolute;top:0;left:0; display: inline-block; height: 50px; width: 100px; margin-top: 10px; margin-left: 20px"
        ></div>
`
})
export class TestComponent {
}
