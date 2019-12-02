import { computed } from '@ember/object';

export function classPrefix(prefix) {
  return (target) => {
    target.prototype.classPrefix = prefix;
  };
}

export function bxClassNames(...names) {
  return (target, name, descriptor) => {

    const attrs = names.map(m => m.split(':'));

    function createMapping() {
      const mapping = {};
      attrs.forEach(([a, c]) => {
        if (!c) c = a;
        mapping[a] = target.classPrefix + c;
      });
      return mapping;
    }

    const props = attrs.map(a => `attrs.${a[0]}`);
    const decorator = computed(
      props.join(','),
      function () {
        const mapping = createMapping();
        return attrs.map(a => a[0]).map(a => ((String(this[a]) === 'true') ? mapping[a] : null)).compact().join(' ');
      }
    );
    return decorator(target, name, descriptor);
  };
}

export function argsCompat(target, name, descriptor) {

  const init = descriptor.initializer;
  descriptor.initializer = function() {
    const args = init(this);
    const context = this;
    Object.keys(args).forEach((k) => {
      Object.defineProperty(args, k, {
        get() {
          return context[k];
        }
      })
    });
    return args;
  };

  return descriptor;
}
