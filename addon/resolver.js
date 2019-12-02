// eslint-disable no-undef global-this._moduleRegistry.get
import Resolver from 'ember-resolver';
import { capitalize } from '@ember/string';


export default Resolver.extend({

  resolve(name, referrer) {
    const root = name.split(':')[1].split('/')[0];
    let al = null;
    const methodName = `resolve${capitalize(name.split(':')[0])}`;
    let result;
    if (this[methodName]) {
      try {
        const parsedName = this.myParseName(name);
        result = this[methodName](parsedName, [root, al]);
      } catch (e) {
        // do nothing
      }
    }
    if (result) return result;
    try {
      result = this._super(name, referrer);
    } catch (e) {
      console.error(e);
    }
    return result;
  },

  resolveService(parsedName) {
    if (parsedName.fullNameWithoutType.includes('@')) {
      let [pkg, name] = parsedName.fullNameWithoutType.split('@');
      const muPath = `${pkg}/src/services/${name}/service`;
      if (this._moduleRegistry.has(muPath)) {
        return this._moduleRegistry.get(muPath).default;
      }
      [pkg, name] = parsedName.fullNameWithoutType.split('@');
      const classicPath = `${pkg}/services/${name}`;
      if (this._moduleRegistry.has(classicPath)) {
        return this._moduleRegistry.get(classicPath).default;
      }
    }
    return undefined;
  },

  resolveTemplate(parsedName) {
    let path = parsedName.fullNameWithoutType.replace('components/', '');
    path = `${path}/template`;
    if (this._moduleRegistry.has(path)) {
      return this._moduleRegistry.get(path).default;
    }
    return undefined;
  },

  resolveComponent(parsedName) {
    let path = parsedName.fullNameWithoutType;
    let path2 = path;
    if (this._moduleRegistry.has(path2) && this._moduleRegistry.get(path2).default.isComponentFactory) {
      if (!this._moduleRegistry.get(path2).helper) {
        return this._moduleRegistry.get(path2).default;
      }
    }
    path2 = `${path}/component`;
    if (this._moduleRegistry.has(path2) && this._moduleRegistry.get(path2).default.isComponentFactory) {
      return this._moduleRegistry.get(path2).default;
    }

    path2 = `demoapp${path}`;
    if (this._moduleRegistry.has(path2) && this._moduleRegistry.get(path2).default.isComponentFactory) {
      return this._moduleRegistry.get(path2).default;
    }
    return undefined;
  },

  resolveHelper(parsedName) {
    let path = parsedName.fullNameWithoutType;
    if (parsedName.fullNameWithoutType.includes('/')) {
      // eslint-disable-next-line prefer-const
      let [pkg, name] = parsedName.fullNameWithoutType.split('/');
      path = `${pkg}/src/ui/components/${name}`;

      if (this._moduleRegistry.has(path)) {
        if (this._moduleRegistry.get(path).helper) return this._moduleRegistry.get(path).helper;
        return this._moduleRegistry.get(path).default;
      }
      path = `${pkg}/helpers/${name}`;
      if (this._moduleRegistry.has(path)) {
        if (this._moduleRegistry.get(path).helper) return this._moduleRegistry.get(path).helper;
        return this._moduleRegistry.get(path).default;
      }
    }
    path = `${parsedName.fullNameWithoutType}/component`;
    if (this._moduleRegistry.has(path)) {
      if (this._moduleRegistry.get(path).helper) return this._moduleRegistry.get(path).helper;
      return this._moduleRegistry.get(path).default;
    }
    path = parsedName.fullNameWithoutType;
    if (this._moduleRegistry.has(path)) {
      if (this._moduleRegistry.get(path).helper) return this._moduleRegistry.get(path).helper;
      return this._moduleRegistry.get(path).default;
    }
    return undefined;
  },

  myParseName(name) {
    if (name.includes('/') && !name.includes('@ember-data')) {
      const [, path] = name.split(':');
      return {
        fullName: name,
        fullNameWithoutType: path
      };
    }
    return this.parseName(name);
  }
});
