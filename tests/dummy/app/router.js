import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  docsRoute(this, function () {
    this.route('getting-started', function () {
      this.route('installation');
    });

    this.route('components', function () {
      this.route('button');
      this.route('breadcrumbs');
      this.route('card');
      this.route('charts');
      this.route('checkbox');
      this.route('code-snippet');
      this.route('copy-button');
      this.route('data-table');
      this.route('confirm');
      this.route('form-input');
      this.route('icon');
      this.route('list');
      this.route('loading');
      this.route('menu');
      this.route('modal');
      this.route('notification');
      this.route('pagination');
      this.route('search-input');
      this.route('select');
      this.route('tabs');
      this.route('tag');
      this.route('tile');
      this.route('toggle');
      this.route('ui-shell');
    });
  });
});

export default Router;
