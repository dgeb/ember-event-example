import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | glimmer-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<GlimmerButton />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <GlimmerButton>
        template block text
      </GlimmerButton>
    `);

    assert.dom(this.element).hasText('template block text');
  });

  module('nested glimmer-button components', function () {
    test('it handles click events and allows propagation by default', async function (assert) {
      let i = 0;

      this.setProperties({
        onParentClick: () => this.set('parentClicked', i++),
        onChildClick: () => this.set('childClicked', i++),
        parentClicked: undefined,
        childClicked: undefined,
      });

      await render(hbs`
        <GlimmerButton id="parentButton" @onClick={{this.onParentClick}}>
          <GlimmerButton id="childButton" @onClick={{this.onChildClick}} />
        </GlimmerButton>
      `);

      await click('#childButton');

      assert.strictEqual(this.childClicked, 0);
      assert.strictEqual(this.parentClicked, 1);
    });

    test('it handles click events and can prevent event propagation', async function (assert) {
      let i = 0;

      this.setProperties({
        onParentClick: () => this.set('parentClicked', i++),
        onChildClick: () => this.set('childClicked', i++),
        parentClicked: undefined,
        childClicked: undefined,
      });

      await render(hbs`
        <GlimmerButton id="parentButton" @onClick={{this.onParentClick}}>
          <GlimmerButton id="childButton" @preventEventPropagation={{true}} @onClick={{this.onChildClick}} />
        </GlimmerButton>
      `);

      await click('#childButton');

      assert.strictEqual(this.childClicked, 0);
      assert.strictEqual(this.parentClicked, undefined);
    });
  });
});
