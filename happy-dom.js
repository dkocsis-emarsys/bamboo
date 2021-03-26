const { Window } = require('happy-dom');

global.window = new Window();
global.document = global.window.document;
global.customElements = global.window.customElements;
global.HTMLElement = global.window.HTMLElement;
global.Event = global.window.Event;
global.CustomEvent = global.window.CustomEvent;
global.MutationObserver = global.window.MutationObserver;
global.DOMParser = global.window.DOMParser;
