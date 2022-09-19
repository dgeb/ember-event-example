import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | simple-classic-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it allows instance-specific event handlers regardless of registration order', async function (assert) {
    let i = 0;

    this.setProperties({
      onClick: () => this.set('clicked', i++),
      clicked: undefined,
    });

    await render(hbs`
      <SimpleClassicButton>No click handler</SimpleClassicButton>
      <SimpleClassicButton id="clickableButton" @click={{this.onClick}}>Click handler</SimpleClassicButton>
    `);

    await click('#clickableButton');

    assert.strictEqual(this.clicked, 0);
  });

  module('nested classic-button components', function () {
    skip('it handles click events and allows propagation by default', async function (assert) {
      let i = 0;

      this.setProperties({
        onParentClick: () => this.set('parentClicked', i++),
        onChildClick: () => this.set('childClicked', i++),
        parentClicked: undefined,
        childClicked: undefined,
      });

      await render(hbs`
        <SimpleClassicButton id="parentButton" @click={{this.onParentClick}}>
          <SimpleClassicButton id="childButton" @click={{this.onChildClick}} />
        </SimpleClassicButton>
      `);

      await click('#childButton');

      assert.strictEqual(this.childClicked, 0);
      assert.strictEqual(this.parentClicked, 1);
    });

    skip('it handles click events and can prevent event propagation in event handler', async function (assert) {
      let i = 0;

      this.setProperties({
        onParentClick: () => this.set('parentClicked', i++),
        onChildClick: (e) => {
          this.set('childClicked', i++);
          e.stopPropagation();
        },
        parentClicked: undefined,
        childClicked: undefined,
      });

      await render(hbs`
        <SimpleClassicButton id="parentButton" @click={{this.onParentClick}}>
          <SimpleClassicButton id="childButton" @click={{this.onChildClick}} />
        </SimpleClassicButton>
      `);

      await click('#childButton');

      assert.strictEqual(this.childClicked, 0);
      assert.strictEqual(this.parentClicked, undefined);
    });
  });
});
