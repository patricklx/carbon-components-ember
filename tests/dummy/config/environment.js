module.exports = function (environment) {
  return {
    modulePrefix: 'dummy',
    rootURL: '/carbon-components-ember/versions/' + require('child_process').execSync('git branch | grep \\* | cut -d \' \' -f2').toString().trim(),
    locationType: 'auto',
    environment,
    podModulePrefix: 'dummy/pods',
    'ember-cli-addon-docs': {
      snippetSearchPaths: ['tests/dummy/src']
    },
    'ember-component-css': {
      namespaceStyles: true,
      componentRootPaths: [],
      routeRootPaths: []
    }
  };
};
