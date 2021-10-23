Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
    value: () => {
        return {
            display: 'none',
            appearance: ['-webkit-appearance']
        };
    }
});

Object.defineProperty(document, 'doctype', {
    value: '<!DOCTYPE html>'
});
// eslint-disable-next-line angular/document-service
Object.defineProperty(document.body.style, 'transform', {
    value: () => {
        return {
            enumerable: true,
            configurable: true
        };
    }
});
HTMLBodyElement.prototype.scrollIntoView = (config: unknown) => {
};
