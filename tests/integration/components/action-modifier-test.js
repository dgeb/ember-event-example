import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, doubleClick, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | action modifier test', function (hooks) {
  setupRenderingTest(hooks);

  test('`action` can target a function', async function (assert) {
    let i = 0;

    this.setProperties({
      onChildClick: () => this.set('childClicked', i++),
      childClicked: undefined,
    });

    await render(hbs`
      <button id="childButton" {{action this.onChildClick}} />
    `);

    await click('#childButton');

    assert.strictEqual(this.childClicked, 0);
  });

  test('`action` can target a method on the current context by name', async function (assert) {
    let i = 0;

    this.setProperties({
      onChildClick: () => this.set('childClicked', i++),
      childClicked: undefined,
    });

    await render(hbs`
      <button id="childButton" {{action 'onChildClick'}} />
    `);

    await click('#childButton');

    assert.strictEqual(this.childClicked, 0);
  });

  test('`action` can specify an event other than `click` via `on`', async function (assert) {
    let i = 0;

    this.setProperties({
      onDblClick: () => this.set('dblClicked', i++),
      dblClicked: undefined,
    });

    await render(hbs`
      <button id="childButton" {{action this.onDblClick on='dblclick'}} />
    `);

    await doubleClick('#childButton');

    assert.strictEqual(this.dblClicked, 0);
  });

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
