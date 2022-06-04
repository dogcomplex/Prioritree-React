/* eslint-disable */
import React from 'react';
import logo from './logo.svg';
import './App.css';

// EXAMPLE
// ========================================================
var appData = {
  _type:      'div',
  class:      'App',
  _template:  ['header', 'body', 'footer'],
  header: {
    _type:      'header',
    class:      'App-header',
    _template:  ['logo', 'instructions', 'link'],
    logo: {
      _type:      'img',
      class:      'App-logo',
      src:        "logo.png",
      alt:        'logo'
    },
    instructions: {
      _type:      'p',
      _template:  (e) => ['Edit ', value(e, 'filename'), ' and save to reload'],
        // TODO not sure I like this
      filename: {
        _type:      'code',
        _value:     'src/App.js'
      },
    },
    link: {
      _type:      'a',
      class:      'App-link',
      href:       'https://reactjs.org',
      target:     '_blank',
      rel:        'noopener noreferrer',
      _value:     'Learn React'
    }
  },
  'test': 'TESTING',
  'body': {
    _template: ['hello', 'world', 'more'],
    
    hello: {
      _template: (e) => 
        <div>
        <p> Hello World of {value(e, '_parent2/test')}</p>
        </div>
    },
    world: {
      _template: (e) => 'Something something ' + value(e, '_parent2/test')
    },
    more: {
      _template: ['_parent2/test', '_parent3/_key']
    }
  },
  footer: {
    _extends: '../body',
    class:    null,
  }
};

let root = {
  _parent: undefined,
  _key: 'root',

  app: {
    ...appData,
    _key: 'application'
  }
}

// ROOT ========================================================

const ROOT = {}
ROOT._key = 'root'
ROOT._parent = undefined

// ELEMENT  ========================================================:
ROOT.element = {
  _description: 'Formats some value into an element object',
  _scaffolding: ['_value', '_function'],
  _function: element,
  _tests: {
    'element(undefined)': {
      _result: {},
      _function: () => element(undefined)
    },
    'element(empty_object)': { 
      _result: {},
      _function: () => element({})
    },
    'element(object)': {
      _result: { a: 1 },
      _function: () => element({ a: 1 })
    },
    'element(array)': {
      _result: {
        _value: [1,2,3]
      },
      _function: () => element([1,2,3])
    },
    'element(function)': {
      _result: {
        _function: () => 'test'
      },
      _function: () => element(() => 'test')
    },
    'element(string)': {
      _result: {
        _value: 'test'
      },
      _function: () => element('test')
    },
    'element(number)': {
      _result: {
        _value: 123
      },
      _function: () => element(123)
    },
    'element(boolean)': {
      _result: {
        _value: true
      },
      _function: () => element(true)
    },
    'element(null)': {
      _result: {
        _value: null
      },
      _function: () => element(null)
    }
  }
}
const element = (value) => {
  switch(typeof value) {
    case 'undefined':
      return {}
    case 'object':
      if (value instanceof Array)
        return {
          _value: value
        }
      return value
    case 'function':
      return {
        _function: value
      }
    default:
      return {
        _value: value
      }
  }
}
console.log(test(ROOT.element))

// INITIALIZE ==============================================================:
ROOT.initialize = {
  _description: 'Initializes the given element key, converting it to an element object or _value.  Returns the element.',
  _scaffolding: ['_parent', '_key', '_value', '_function', '_result'],
  _function: initialize,
  _TODO: 'support paths. (get + initialize loop problem)',
  _tests: {
    'initialize(root, "app")': {
      _function: (e) => initialize({}, 'app'),
      _result: {
        _value: {
          _parent: '/',
          _key: 'app',
        }
      }
    }
  }
}
const initialize = (e, key) => {
  if (key === '_value' || key === '_result')
    return e[key];
  if (key === '_function' && typeof e[key] === 'function')
    // help _function terminate to a _value instead of an endless depth
    return {
      _parent: e,
      _key: key,
      _value: e[key]
    }
  return {
    _parent: e,
    _key: key,
    ...element(e[key])
  }
}

// GET =====================================================================:
ROOT.get = {
  _description: "Returns the element at the given path.  Returns empty object at path if not found.  Returns an object unless the key is _value",
  _dependencies: ['initialize'],
  _scaffolding: ['_parent', '_value'],
  _TODO: '_path, _extends',
  _function: get
}
const get = (e, path = '') => {
  if (path === '')
    return e;
  const [key, ...rest] = path.split('/');
  const remaining = rest.join('/');
  if (key === '_value')
    return rest.length ? undefined : e._value; // cant go further
  if (key === '_parent')
    return e._parent;
  const initialized = initialize(e, key);
  if (rest.length)
    return get(initialized, remaining);
  return initialized;
}


// SET =====================================================================:
ROOT.set = {
  _description: 'Sets the value at the given path, overwriting by default.  Returns the resulting element object.',
  _dependencies: ['get', 'merge'],
  _TODO: 'listen to set rules e.g. _set, _static, etc',
  _function: set
}
const set = (e, path = '', newValue = undefined) => {
  const old = get(e, path)
  return merge(old, newValue, true)
}

// MERGE =====================================================================:
ROOT.merge = {
  _description: 'Merges some value (object, string, element, etc) into the given element, potentially overwriting existing values.  Returns the merged element.',
  _dependencies: ['element', 'get'],
  _scaffolding: ['_value'],
  _function: merge
}
const merge = (e, newValue, overwrite = false) => {
  const newElement = element(newValue)

  return Object.keys(newElement).reduce((merged, key) => {
    if (key === '_value' || key === '_result')
      return overwrite ? newElement[key] : e[key] || newElement[key]
    return {
      ...merged,
      [key]: merge(get(e, key), newElement[key], overwrite)
    }
  }, { ...e })
}

// CALL =====================================================================:
ROOT.call = {
  _description: 'Returns value of given path, calling function if not found or if caching dictates a call is necessary.',
  _dependencies: ['get', 'value'],
  _scaffolding: ['_function', '_value'],
  _function: call,
  _TODO: 'MAJOR decision making needed here.  Can args be an object always? Can we bind this? Can we infer args via reflection on e?  Should _function be a terminal, never an object?',
  _examples: {
    simple_sum: {
      a: 1,
      b: 2,
      _args: ['a', 'b'],
      _function: (e, args) => {
        // like this except would be nice if it were even simpler...
        // can we kill 'merged' and just use a + b?
        const merged = merge(e, args)
        return merged.a + merged.b

        // even better:
        // () => this.a + this.b

        // (a, b) => a + b
      },
      _result: 3
    },
    phone_number1: {
      country_code: '1',
      area_code: '123',
      number: '4567890',
      _function: (e) => `${value(e, 'country_code')}-${value(e, 'area_code')}-${value(e, 'number')}`,
    },
    phone_number2: {
      country_code: '1',
      area_code: '123',
      number: '4567890',
      _description: 'Wishful thinking: would require implicit binding of this to e, and each args value to this.  Would either need explicit listing of args via _args array, brute force value() on all args, or overloading of this._get magic somehow.',
      _function: () => `${this.country_code}-${this.area_code}-${this.number}`,
    },
    phone_number3: {
      country_code: '1',
      area_code: '123',
      number: '4567890',
      _description: 'Even more Wishful thinking: if going this extreme, might as well go whole hog',
      _function: () => `${country_code}-${area_code}-${number}`,
    },
    complex_function1: {
      country_codes: {
        canada: 1,
        usa: 1,
        uk: 44,
        germany: 49,
        france: 33
        // ...
      },
      user: {
        country: 'canada',
        phone_number: {
          area_code: '123',
          number: '4567890',
          _description: 'Extreme wishful thinking: getting ROOT and _parent hooks so we can look beyond the current element',
          _function: () => `${_ROOT.country_codes[_parent.country]}-${area_code}-${number}`,
        }
      },
    },
    complex_function2: {
      country_codes: {
        canada: 1,
        usa: 1,
        uk: 44,
        germany: 49,
        france: 33
        // ...
      },
      user: {
        country: 'canada',
        phone_number: {
          area_code: '123',
          number: '4567890',
          _description: 'Slightly easier: using this to get said hooks',
          _function: () => `${this._root().country_codes[this._parent().country]}-${this.area_code}-${this.number}`,
        }
      },
    }
  }
}
const call = (e, ...args) => {
  const value = value(e)
  if (value !== undefined) // TODO or _cache rules
    return value;
  const fn = value(e, '_function');
  if (typeof fn !== 'function')
    return undefined;
  // TODO: _function/_function recursion...
  return fn(e, ...args);
}
const call2 = (e, args) => {
  const merged = merge(e, args, true)
  const value = value(merged)
  if (value !== undefined) // TODO or _cache rules
    return value;
  const fn = value(merged, '_function');
  if (typeof fn !== 'function')
    return undefined;
  return fn.bind(merged)();
}

// HAS =====================================================================:
ROOT.has = {
  _description: 'Returns true if the given path exists in the given element and has a non-undefined value.',
  _dependencies: ['get', 'value'],
  _function: has
}
const has = (e, path = '') => {
  const element = get(e, path);
  return value(element) !== undefined;
}

// VALUE =====================================================================:
ROOT.value = {
  _description: 'Returns the value of the given element.  Returns undefined if the element is not found.  Does not invoke a call function if undefined.',
  _dependencies: ['get'],
  _scaffolding: ['_value'],
  _function: value,
  _TODO: '_extends'
}
const value = (e, path = '') => {
  return get(get(e, path), '_value');
}

// PARENT =====================================================================:
ROOT.parent = {
  _description: 'Returns the parent of the given element.',
  _dependencies: ['get'],
  _function: parent
}
const parent = (e) => {
  return get(e, '_parent');
}

// TEMPLATE ================================================================:
ROOT.template = {
  _description: 'Builds a template of the given element.',
  _dependencies: ['get', 'call'],
  _scaffolding: ['_template'],
  _function: template,
  _TODO: 'If _template is a string, look for variables to parse out and render those as templates recursively.  Return a template element with callable _function',
  _examples: {
    greeting: {
      _template: 'Hello, {{name}}!',
      name: '{{first_name}} {{last_name}}', // infer this is a _template ? what about _value and _function?
      first_name: 'Bob',
      last_name: 'Dole',
      _result: 'Hello, Bob Dole!'
    }
  }
}
const template = (e) => {
  if (has(e, '_template'))
    return get(e, '_template');
  // default template:
  return {
    _function: (e) => {
      const value = call(parent(e))
      switch(typeof value) {
        case 'undefined':
          return 'undefined'
        case 'number':
          return value.toString()
        case 'object':
          if (value === null)
            return 'null';
          if (Array.isArray(value))
            return value.map((v) => v.toString()).join('')
        case 'function':
          return value.toString()
        case 'string':
        default:
          return value;
      }
    }
  }
}

// RENDER =====================================================================:
ROOT.render = {
  _description: 'Renders the given element according to a template. e.g. "Hello, {{name}}" => "Hello, John"',
  _scaffolding: ['_value'],
}
const render = (e, template = '{{_value}}') => {
  const tokens = template.match(/{{[^}]*}}/g);
  if (tokens === null)
    return template;
  const tokensStr = tokens.join(' ');
  return template.replace(tokensStr, (...args) => {
    const token = args[0];
    const tokenStr = token.replace(/{{|}}/g, '');
    const value = get(e, tokenStr);
    return value;
  });
}

// TEST =====================================================================:
ROOT.test = {
  _description: 'Tests the given element against a test function.  Returns true if the test function returns true, false otherwise.',
  _dependencies: ['get', 'call'],
  _scaffolding: ['_test', '_tests'],
  _TODO: 'run _valid, other shorthand tests',
  _function: test,
  _examples: {
    user: {
      name: 'John',
      _tests: {
        get_var: {
          _function: (e) => get(e, 'name'),
          _result: 'John'
        },
        overwrite_var: {
          name: "Bob",
          _function: (e) => get(e, 'name'),
          _result: 'Bob'
        }
      }
    }
  }
}
// run a particular test
const runTest = (e, test) => {
  // merge in the test over the element defaults
  const subject = merge(e, test, true)
  // run the test function
  const result = call(subject);
  const expected = value(subject, '_result');
  return {
    result: result,
    valid: result === expected
  }
}
// default test batcher
const test = (e) => {
  // if _test implemented, override this default test batcher
  // TODO recursive test
  let results = {}
  if (has(e, '_test'))
    return call(e, '_test');
  if (has(e, '_tests')) {
    const tests = get(e, '_tests')
    results = {
      ...keys(tests).reduce((r, key) => {
        r[key] = runTest(e, tests[key]);
      }, {})
    }
  }
  return results
}

// KEYS =====================================================================:
ROOT.keys = {
  _description: 'Returns an array of keys for the given element.',
  _dependencies: ['get'],
  _function: keys,
  _tests: {
    default_usage: {
      a: 1,
      b: 2,
      c: 3,
      _function: (e) => keys(e),
      _result: ['a', 'b', 'c']
    },
    with_override: {
      _keys: ['x', 'y', 'z'],
      a: 1,
      b: 2,
      c: 3,
      _function: (e) => keys(e),
      _result: ['x', 'y', 'z']
    }
  }
}
const keys = (e) => {
  if (has(e, '_keys'))
    return value(e, '_keys');
  return Object.keys(get(e)).filter((key) => {
    // filter out _*
    return key[0] !== '_';
  });
}

// PROXY =====================================================================:
ROOT.proxy_handles = {
  get: (e, path = undefined) => new Proxy(get(e, path), ROOT.proxy_handles),
  set: (e, path, value) => new Proxy(set(e, path, value), ROOT.proxy_handles),
  has: (e, path = undefined) => has(e, path),
  ownKeys: (e) => keys(e),
  // apply: alias?
  // deleteProperty
  // enumerate
  // defineProperty
  // getOwnPropertyDescriptor
}
const root = new Proxy(ROOT, ROOT.proxy_handles);