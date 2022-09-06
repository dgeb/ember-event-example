import { modifier } from 'ember-modifier';

const actionModifier = modifier(
  (element, [context, callback, ...args]) => {
    const handler = (event) => {
      const fn = typeof callback === 'string' ? context[callback] : callback;
      if (fn === undefined) {
        throw new Error(
          'Unexpected callback for `action` modifier. Please provide either a function or the name of a method on the current context.'
        );
      }

      if (args.length > 0) {
        return fn.call(context, ...args);
      } else {
        return fn.call(context, event);
      }
    };

    // TODO - Allow for events other than 'click' (e.g. `on="submit"`)
    const eventName = 'click';

    element.addEventListener(eventName, handler);

    return () => {
      element.removeEventListener(eventName, handler);
    };
  },
  { eager: false }
);

export function initialize(appInstance) {
  const renderer = appInstance.lookup('renderer:-dom');
  const lookupModifier = renderer._runtimeResolver.lookupModifier;
  renderer._runtimeResolver.lookupModifier = (name, owner) => {
    if (name === 'action') {
      return actionModifier;
    } else {
      return lookupModifier(name, owner);
    }
  };
}

export default {
  initialize,
};
