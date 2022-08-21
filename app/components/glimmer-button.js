import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class GlimmerButton extends Component {
  @action
  click(event) {
    console.log('GlimmerButton#click', event);
    event.preventDefault();
    if (this.args.preventEventPropagation) {
      event.stopPropagation();
    }
    this.args.onClick?.(event);
  }

  @action
  mouseDown(event) {
    console.log('GlimmerButton#mouseDown', event);
    event.preventDefault();
    if (this.args.preventEventPropagation) {
      event.stopPropagation();
    }
    this.args.onMouseDown?.(event);
  }
}
