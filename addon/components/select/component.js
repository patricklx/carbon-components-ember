import Component from '@ember/component';
import { set, action } from '@ember/object';
import { isBlank } from '@ember/utils';


export default class SelectComponent extends Component {
  searchMatcher(item, term) {
    if (!term || term === '') return true;
    const pass = Object.values(item.toJSON ? item.toJSON() : item)
      .filter(v => v && !v.defaultAdapter)
      .some(v => (typeof v === 'string' ? v.includes(term) : JSON.stringify(v).includes(term)));
    if (pass) return 1;
    return -1;
  }

  @action
  onChange(choice) {
    if (this.multiple) {
      choice.forEach((item) => {
        if (!this.content || !this.content.includes(item)) {
          if (this.addItem) this.addItem(item);
        }
      });
      if (this.content) {
        this.content.forEach((item) => {
          if (!choice.includes(item)) {
            if (this.removeItem) this.removeItem(item);
          }
        });
      }
      return;
    }
    if (this.onSelect) this.onSelect(choice);
  }
  @action
  selectFocused(...args) {
    return this.selectFocused && this.selectFocused(...args);
  }
  @action
  handleKeydown(select, event) {
    const selected = this.get('content') || [];


    let backspaceHandled = false;

    // Delete the entire last tag if backspacing into the tags area.
    if (event.keyCode === 8 && isBlank(event.target.value)) { // BACKSPACE === 8
      if (this.removeItem) this.removeItem(selected.slice(-1)[0]);
      event.preventDefault();
      backspaceHandled = true;
      return false;
    }

    if (event.keyCode === 13) { // enter === 8
      set(select, 'searchText', '');
      backspaceHandled = true;
    }

    if (backspaceHandled) {
      event.preventDefault();
    }
    return undefined;
  }

  didInsertElement() {
    this.$('.ember-power-select-status-icon').replaceWith(''
      + '<svg class="bx--dropdown__arrow ember-power-select-status-icon" '
      + 'width="10" height="6" viewBox="0 0 10 6">\n'
      + '    <path d="M5 6L0 1 0.7 0.3 5 4.6 9.3 0.3 10 1z"></path>\n'
      + '  </svg>');
  }
}
