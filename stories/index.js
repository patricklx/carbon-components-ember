import hbs from 'htmlbars-inline-precompile';
import { storiesOf } from '@storybook/ember';

storiesOf('Demo', module)
  .add('heading', () => hbs`<h1>Hello World</h1>`)
  .add('button', () => {
    return {
      template: hbs`<button {{action onClick}}>
        Hello Button
      </button>`,
      context: {
        onClick: (e) => console.log(e)
      }
    }
  })
  .add('component', () => {
    return {
      template: hbs`{{foo-bar
        click=onClick
      }}`,
      context: {
        onClick: (e) => console.log(e)
      }
    }
  });
