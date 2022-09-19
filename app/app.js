import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'ember-event-example/config/environment';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  constructor(...args) {
    super(...args);

    reopenComponent(this);
  }
}

loadInitializers(App, config.modulePrefix);

// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component';

/** @type {Record<string, string>} */
const EVENTS = {
  touchstart: 'touchStart',
  touchmove: 'touchMove',
  touchend: 'touchEnd',
  touchcancel: 'touchCancel',
  keydown: 'keyDown',
  keyup: 'keyUp',
  keypress: 'keyPress',
  mousedown: 'mouseDown',
  mouseup: 'mouseUp',
  contextmenu: 'contextMenu',
  click: 'click',
  dblclick: 'doubleClick',
  focusin: 'focusIn',
  focusout: 'focusOut',
  submit: 'submit',
  input: 'input',
  change: 'change',
  dragstart: 'dragStart',
  drag: 'drag',
  dragenter: 'dragEnter',
  dragleave: 'dragLeave',
  dragover: 'dragOver',
  drop: 'drop',
  dragend: 'dragEnd',
};

/**
 * @type {WeakMap<object, { event: string; method: string }[]>}
 */
const COMPONENT_SETUP = new WeakMap();

const INTERNAL = Symbol('INTERNAL');

/**
 * @param {Application} app
 */
// eslint-disable-next-line no-unused-vars
function reopenComponent(app) {
  const allEvents = { ...EVENTS };

  if (app.customEvents) {
    for (const [event, methodName] of Object.entries(app.customEvents)) {
      allEvents[event] = methodName;
    }
  }

  const allEventMethods = {};
  for (const [event, methodName] of Object.entries(EVENTS)) {
    allEventMethods[methodName] = event;
  }

  Component.reopen({
    /**
     * @param {string | typeof INTERNAL} name
     * @param {unknown[]} args
     */
    trigger(name, ...args) {
      if (name in allEvents) {
        return;
      } else if (name === INTERNAL) {
        return this._super(...args);
      } else {
        return this._super(name, ...args);
      }
    },

    // eslint-disable-next-line ember/no-component-lifecycle-hooks
    didInsertElement(...args) {
      this._super(...args);

      const proto = Object.getPrototypeOf(this);
      let protoEvents = COMPONENT_SETUP.get(proto);

      if (!protoEvents) {
        protoEvents = [];
        COMPONENT_SETUP.set(proto, protoEvents);

        for (const method of Object.keys(allEventMethods)) {
          if (this.has(method)) {
            const event = allEventMethods[method];
            protoEvents.push({ event, method });
          }
        }
      }

      addComponentEventListeners(this, protoEvents);

      const ownProps = Reflect.ownKeys(this);
      let ownEvents;
      for (const method of Object.keys(allEventMethods)) {
        if (ownProps.includes(method)) {
          const event = allEventMethods[method];
          ownEvents ??= [];
          ownEvents.push({ event, method });
        }
      }

      if (ownEvents) {
        addComponentEventListeners(this, ownEvents);
      }
    },
  });
}

function addComponentEventListeners(component, events) {
  for (const { event, method } of events) {
    component.element.addEventListener(event, (event) => {
      return component.trigger.call(component, INTERNAL, method, event);
    });
  }
}
