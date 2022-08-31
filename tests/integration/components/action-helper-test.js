import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | action helper test', function (hooks) {
  setupRenderingTest(hooks);

  module('nested `action` usage inside classic', function () {
    test('it handles click events and allows propagation by default', async function (assert) {
      let i = 0;

      this.setProperties({
        onParentClick: () => this.set('parentClicked', i++),
        onChildClick: () => this.set('childClicked', i++),
        parentClicked: undefined,
        childClicked: undefined,
      });

      await render(hbs`
        <ClassicButton id="parentButton" @onClick={{this.onParentClick}}>
          <button id="childButton" {{action this.onChildClick}} />
        </ClassicButton>
      `);

      await click('#childButton');

      assert.strictEqual(this.childClicked, 0);
      assert.strictEqual(this.parentClicked, 1);
    });

    test('it handles click events and can prevent event propagation', async function (assert) {
      let i = 0;

      this.setProperties({
        onParentClick: () => this.set('parentClicked', i++),
        onChildClick: (event) => {
          event.stopPropagation();
          this.set('childClicked', i++);
        },
        parentClicked: undefined,
        childClicked: undefined,
      });

      await render(hbs`
        <ClassicButton id="parentButton" @onClick={{this.onParentClick}}>
          <button id="childButton" {{action this.onChildClick}} />
        </ClassicButton>
      `);

      await click('#childButton');

      assert.strictEqual(this.childClicked, 0);
      assert.strictEqual(this.parentClicked, undefined);
    });
  });

  module('nested `action` usage inside glimmer', function () {
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
          <button id="childButton" {{action this.onChildClick}} />
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
        onChildClick: (event) => {
          event.stopPropagation();
          this.set('childClicked', i++);
        },
        parentClicked: undefined,
        childClicked: undefined,
      });

      await render(hbs`
        <GlimmerButton id="parentButton" @onClick={{this.onParentClick}}>
          <button id="childButton" {{action this.onChildClick}} />
        </GlimmerButton>
      `);

      await click('#childButton');

      assert.strictEqual(this.childClicked, 0);
      assert.strictEqual(this.parentClicked, undefined);
    });
  });
});
