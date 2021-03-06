const { Builder } = require('broccoli');
const TreeSync = require('tree-sync');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const fs = require('fs');
const path = require('path');
const TemplateDependencyTreeProcessor = require('./dependency-tree');


class PreBuild {
  name = 'ember-cli-preprocess';

  constructor(parent, project) {
    this.parent = parent;
    this.project = project;
  }

  runCommand(commandOptions, rawArgs) {

    let config = {
      defaultAddons: [
        'ember-template-component-import',
        'ember-template-helper-import',
        'ember-template-modifier-import',
        'ember-template-styles-import'
      ],
      useAddons: []
    };
    if (fs.existsSync('config/addon-preprocess.js')) {
      Object.assign(config, require(path.resolve('config/addon-preprocess.js')));
    }

    const allowedAddons = config.defaultAddons.concat(config.useAddons);

    let addonEntry = this.project.pkg["ember-addon"] && this.project.pkg["ember-addon"].main || 'index.js';
    if (!addonEntry.endsWith('.js')) {
      addonEntry += '.js';
    }

    const addonMain = new Funnel('.', {
      files: ['package.json', addonEntry],
      annotation: 'addon main files'
    });

    const js = new Funnel('./addon', {
      include: [/\.js$/],
      destDir: this.project.name(),
      annotation: 'JS Files'
    });

    const hbs = new Funnel('./addon', {
      include: [/\.hbs$/],
      destDir: this.project.name(),
      annotation: 'hbs Files'
    });

    const styles = new Funnel('./app/styles', {
      include: [/\.scss$/],
      destDir: '.',
      annotation: 'styles Files'
    });

    const registry = {
      registries: {},
      load(type) {
        return this.registries[type] || [];
      },
      remove(type, name) {
        this.registries[type] = this.registries[type] || [];
        const i = this.registries[type].findIndex(r => r.name === name);
        if (i < 0) return;
        this.registries[type].splice(i, 1);
      },
      add(type, reg) {
        if (reg.name === 'ember-cli-htmlbars') return;
        this.registries[type] = this.registries[type] || [];
        this.registries[type].push(reg);
      }
    }
    this.project.options = {};
    const Addon = this.parent._packageInfo.getAddonConstructor();
    const rootAddon = new Addon(this.parent, this.project);
    rootAddon.init(this.parent, this.project);
    rootAddon.options = {};

    this.parent.addons.forEach((addon) => {
      if (!allowedAddons.includes(addon.name)) return ;
      addon.parent = rootAddon;
      addon.app = {
        addonPostprocessTree: () => null,
        import: () => null,
        project: this.project,
        env: 'development',
        options: {},
        targets: []
      };
      if (addon.setupPreprocessorRegistry) {
        addon.setupPreprocessorRegistry('parent', registry);
        addon.included && addon.included(rootAddon);
      }
    });

    const deps = new TemplateDependencyTreeProcessor(hbs, {
      root: '.',
      package: this.project.pkg
    });

    let tree = deps;
    registry.registries.template.forEach((reg) => {
      const t = reg.toTree(tree);
      tree = new MergeTrees([tree, t], { overwrite: true });
    });

    const treeForStyles = rootAddon.treeForStyles && rootAddon.treeForStyles(styles) || styles;

    tree = new MergeTrees([js, tree, treeForStyles]);
    tree = new MergeTrees([
      new Funnel(tree, { srcDir: this.project.name(), destDir: 'addon' }),
      new Funnel(tree, { srcDir: 'app', destDir: 'app' }),
      addonMain
    ])

    const builder = new Builder(tree);
    const outputDir = 'dist';
    const outputTree = new TreeSync(builder.outputPath, outputDir);
    return builder.build()
      .then(() => {
        // Calling `sync` will synchronize the contents of the builder's `outPath` with our output directory.
        return outputTree.sync();
      })
      .then(() => {
        fs.writeFileSync('dist/dependencies.json', JSON.stringify(deps.getRules(), null, 2));
        // Now that we're done with the build, clean up any temporary files were created
        return builder.cleanup();
      })
      .catch(err => {
        // In case something in this process fails, we still want to ensure that we clean up the temp files
        console.log(err);
        return builder.cleanup();
      });
  }

  includedCommands() {
    return {
      'run': {
        name: 'run',
        description: 'preprocesses hbs templates',
        works: 'insideProject',
        run: this.runCommand.bind(this)
      }
    };
  }
}

module.exports = PreBuild;


