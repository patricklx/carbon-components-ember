import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import * as icons from '@carbon/icons';
import { bxClassNames, classPrefix } from 'carbon-components-ember/decorators/bx-class-names';

@classPrefix('bx--icon--')
class CarbonIcon extends Component {
  tagName = '';
  static positionalParams = ['icon'];
  @service('carbon-components-ember@dialog-manager') dialogManager;
  @bxClassNames('info', 'danger', 'disabled') bxClassNames;
  @tracked attrs;
  @tracked loading;
  @tracked disabled;
  get svg() {
    // eslint-disable-next-line eqeqeq
    return Object.values(icons).find(i => i.name === this.attrs.icon && (i.size == (this.attrs.size || 16)));
  }

  @action
  onIconClick() {
    const run = () => {
      const promise = this.attrs.onClick && this.attrs.onClick();
      this.loading = true;
      this.disabled = true;
      if (promise && promise.then) {
        const finish = () => {
          this.loading = false;
          this.disabled = false;
        };
        promise.then(finish, finish);
      } else {
        setTimeout(() => {
          if (this.isDestroyed) return;
          this.loading = false;
          this.disabled = false;
        }, 350);
      }
    };
    if (this.attrs.danger) {
      this.dialogManager.open('confirm', {
        type: 'danger',
        header: 'Danger',
        body: this.attrs.confirmText || 'Confirm this operation',
        onAccept: run
      });
    } else {
      run();
    }
  }
}

export default CarbonIcon;
