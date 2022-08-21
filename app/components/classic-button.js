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
    console.log('ClassicButton#click', event);
    event.preventDefault();
    if (this.preventEventPropagation) {
      event.stopPropagation();
    }
    this.onClick?.(event);
  },

  mouseDown(event) {
    console.log('ClassicButton#mouseDown', event);
    event.preventDefault();
    if (this.preventEventPropagation) {
      event.stopPropagation();
    }
    this.onMouseDown?.(event);
  },
});
