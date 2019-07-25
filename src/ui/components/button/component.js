import Component from '@ember/component';
import BxClassNames from 'carbon/src/mixins/bx-class-names';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

class CarbonButton extends Component.extend(BxClassNames) {
  tagName = '';
  classPrefix = 'bx--btn--'
  confirmText = null;

  @service('carbon::dialog-manager') dialogManager;

  init(...args) {
    super.init(...args);
    this.classMappings = [
      'primary:primary',
      'secondary:secondary',
      'danger:danger',
      'ghost:ghost',
      'small:sm'
    ];
  }

  @action
  onClick(...args) {
    const run = () => {
      const action = this.get('onClick');
      if (action) {
        const ret = action(...args);
        if (ret && ret.finally) {
          this.set('loading', true);
          this.set('disabled', true);
          ret.finally(() => {
            this.set('loading', false);
            this.set('disabled', false);
          });
        }
      }
    };
    if (this.danger) {
      this.dialogManager.open('confirm', {
        type: 'danger',
        header: 'Danger',
        body: this.confirmText || 'Confirm this operation',
        onAccept: run
      });
    } else {
      run();
    }
    // Prevent bubbling, if specified. If undefined, the event will bubble.
    return this.get('bubbles');
  }
}

export default CarbonButton;
