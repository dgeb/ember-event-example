/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-classic-components */
import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  type: 'button',
  preventEventPropagation: false,
  onClick: null,
  onMouseDown: null,

  click(event) {
    event.preventDefault();
    if (this.preventEventPropagation) {
      event.stopPropagation();
    }
    this.onClick?.(event);
  },
});
