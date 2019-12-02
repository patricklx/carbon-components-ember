import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | Button', (hooks) => {
  setupRenderingTest(hooks);

  test('should set as primary', async function (assert) {
    assert.expect(1);

    this.set('isPrimary', 'true');

    await render(hbs`<Button @primary={{this.isPrimary}} />`);

    assert.ok(this.element.querySelector('div').getAttribute('class').includes('primary'));
  });
});
