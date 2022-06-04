/* eslint-disable */
import React from 'react';
import logo from './logo.svg';
import './App.css';

let _service = {
  get: (e, key = undefined) => {
    let config = {};
    let value = key === '_' ? e._value : e[key];
    let getAll;

    if (key === undefined)
      // TODO call empty _get?
      return e;

    if ('_get' in e) {
      // defer to custom _get function if present
      switch (typeof e._get) {

        case 'object':
          e._get = {
            _parent: e,
            _key: key,
            ...e._get
          }
          //const _get_value = _service.get(e._get, '_value');
          const _get_function = _service.get(e._get, '_function');
          getAll = {
            ...e,
            ..._get_function(e)
          };
          for (const k in Object.keys(getAll)) // TODO _merge
            e[k] = getAll[k];
          value = _get_function(e, key);
          break;

        case 'function':
          // compute e._get() if it's a function
          getAll = {
            ...e,
            ...(e._get)(e)
          };
          for (const k in Object.keys(getAll))
            e[k] = getAll[k];
          value = (e._get)(e, key);
          break;

        default:
          throw "_get must be a function or object defining a function"
      }
    }

    // _value special keyword, returns hard value:
    if (key === '_value' || key === '_')
      return value;
    // _config is identity keyword, returns object always, non-Proxied
    if (key === '_config') {
      return config;
      // TODO allow e._config to augment further?
    }

    // convert value to its config form (_config(value) ?)
    switch (typeof value) {
      case 'object':
        config = value;
        break;
      case 'function':
        config = {
          _function: value
        };
        break;
      case 'undefined':
        config = {}
        break;
      default:
        config = {
          _value: value
        };
    }
    e[key] = {
      _parent: e,
      _key: key,
      ...config
    };

    return new Proxy(e[key], _service);
  },
  has: (e, key) => {
    switch (typeof e[key]) {
      case 'object':
        if (e[key]._value !== undefined || e[key]._function !== undefined)
          return true;
        console.log(e[key], Object.keys(e[key]));
        return _service.ownKeys(e[key]).length > 0;
          // TODO function should be auto-called maybe?
          // TODO parent objects are returning false
      case 'function':
        return true;
      case 'undefined':
        return false;
      default:
        return e[key] !== undefined
    }
    return false;
  },

  ownKeys: (e) => {
    // gets list of keys as if it were a normal object, removing _services
    const allKeys = Reflect.ownKeys(e);
    const someKeys = allKeys.filter((key) => key[0] !== '_');
    // TODO cache in _keys?  TODO _keys defines overrides or db fetches?  when do we use _get?
    return someKeys;
  }

  // TODOS?:
  // config preserves original specs?  
  // set: (e, key, value) => {}
  // [Symbol.toPrimitive] ? (cast to int etc)
  // extend e.g. String prototype
  // could make a certain key signal a call e.g. "__sum" makes it a function
  // can auto-import root configs now
  // can auto-call functions now (lazy load = less lazy now?)
  // can auto compute extends
}


const root2 = {
  users: {
    _get: (e, key = undefined) => {
      if (key === undefined) {
        console.log("Slow db call for all keys")
        // pre-fetch ALL keys
        const dbFetchAll = {
          // simulate db fetch
          alice: 345,
          cynthia: 678
        }
        return dbFetchAll
      }

      if (!_service.has(e, key)) {
        console.log("Slow db call for specific key: ", key)
        // fetch specific key
        const dbFetchOne = {
          // simulate db fetch
          alice: 345,
          cynthia: 678
        }
        return dbFetchOne[key]
      }

      return e[key]
    },
    bob: 123
  }
};

let p = new Proxy(root2, _service)
p.a = 1
p.a.b = 3
console.log(p.a, p.b, p.a.b, p.a.b._value, p.a.b._)
console.log('a' in p, 'b' in p, 'b' in p.a)
console.log(p, p._config, 'users' in p, p.users, p.users.bob, p.users.bob._, p.users.alice, p.users.alice._)


const renderTemplate = (e) => {
  const t = e._template._;
  switch (typeof t) {
    case 'undefined':
      return e._;
    case 'object': 
      if (Array.isArray(t))
        return t.map(
          // list of keys in e
          (key) => render(get(e,key))
        );
      return render(t);
    case 'string':
      // key in e:
      return render(get(e,t));
    case 'function':
      // template function, which reduces into a template
      e._template = initialize(e, '_template');
      const result = e._template._function(e);
      if (React.isValidElement(result))
        return result;
      else
        return render(result);
    default:
      // TODO
      return t;
  }
}



const render = (e) => {

  if (typeof e !== 'object')
    return e;
  if (Array.isArray(e))
    return e.map(render);
  
  const rendered = renderTemplate(e);

  // render using React engine:
  return React.createElement(
    '_type' in e ?  e._type._ : 'div',
    { // props
      className: e._class._,
      key: e._key._
    },
    rendered
  );
}

export default p;