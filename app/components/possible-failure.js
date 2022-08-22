import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @tracked parentClicked = 0;
  @tracked childClicked = 0;
  @tracked preventEventPropagation = false;

  onParentClick = () => {
    this.parentClicked++;
  };

  onChildClick = () => {
    this.childClicked++;
  };

  updatePropagation = (event) => {
    this.preventEventPropagation = event.target.checked;
  };
}
