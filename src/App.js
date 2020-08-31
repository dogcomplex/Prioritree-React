import React from 'react';
import logo from './logo.svg';
import './App.css';

function AppOld() {
  return (
    <div
      className="App"
    >
      <header 
        className="App-header"
      >
        <img 
          src       = {logo} 
          className = "App-logo" 
          alt       = "logo" />
        <p>
          {"Edit "}
          <code>src/App.js</code>
          {" and save to reload."}
        </p>
        <a
          className = "App-link"
          href      = "https://reactjs.org"
          target    = "_blank"
          rel       = "noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const originalApp = {
  type: "div",
  key: null,
  ref: null,
  _owner: null,
  _store: {
    validated: false
  },
  _source: {
    fileName: "C:\\CODE\\prioritree-react\\src\\App.js",
    lineNumber: 7
  },
  props: {
    className: 'App',  
    children: {
      type: 'header',
      props: {
        className: 'App-header',
        children: [
          {
            type: 'img',
            props: {
              src: "/static/media/logo.5d5d9eef.svg",
              className: 'App-logo',
              alt: 'logo'
            }
          },
          {
            type: 'p',
            props: {
              children: [
                'Edit ',
                {
                  type: 'code',
                  props: {
                    children: 'src/App.js'
                  }
                },
                ' and save to reload'
              ]
            }
          },
          {
            type: 'a',
            props: {
              className: 'App-link',
              href: 'https://reactjs.org',
              target: '_blank',
              rel: 'noopener noreferrer',
              children: 'Learn React'
            }
          }
        ]
      }
    } 
  }
};


const renderOld = (element) => {
  if (typeof element !== 'object')
    return element;
  
  var children = null;
  if (typeof element.props !== 'undefined' && typeof element.props.children !== 'undefined') {
    if (Array.isArray(element.props.children))
      children = element.props.children.map(renderOld);
    else
      children = renderOld(element.props.children);
  }

  return React.createElement(
    element.type,
    element.props,
    children
  );
}




var myApp = {
  _type:      'div',
  _class:     'App',
  _template:  ['header', 'body', 'footer'],
  header: {
    _type:      'header',
    _class:     'App-header',
    _template:  ['logo', 'instructions', 'link'],
    logo: {
      _type:      'img',
      _class:     'App-logo',
      src:        "/static/media/logo.5d5d9eef.svg",
      alt:        'logo'
    },
    instructions: {
      _type:      'p',
      _template:  (e) => ['Edit ', e.filename, ' and save to reload'],
        // TODO not sure I like this
      filename: {
        _type:      'code',
        _value:     'src/App.js'
      },
    },
    link: {
      _type:      'a',
      _class:     'App-link',
      href:       'https://reactjs.org',
      target:     '_blank',
      rel:        'noopener noreferrer',
      _value:     'Learn React'
    }
  },
  'body': {
    _template: ['hello', 'world', 'more'],
    hello: {
      _template: (e) => 
        <body>
        <p> Hello World of {get(e, '_parent3/_key')}</p>
        </body>
    },
    world: {
      _template: (e) => 'Something something ' + get(e, '_parent3/_key')
    },
    more: {
      _template: ['And ', '_parent3/_key']
    }
  },
  footer: {
    '_extends': '../header/logo',
    // _template: '../header/logo'
    _class:     null,
  }
};

console.log(AppOld());

const initializeRoot = (e) => {
  e._parent = e;
  e._key = 'application';

  return extend(e);
}

// TODO deep extends.
// idea: just move "_extend" flag down into each child
// or conflicting child.  Lazy-style.
// if they have extends already, do multi ['extend1', 'extend2']
// [highest priority, ... lowest_priority]
const extend = (e) => {
  switch(typeof e._extends) {
    case 'undefined':
      return e;  
    case 'object':
      if (Array.isArray(e._extends))
        return e._extends.reduce((topLayers, ext) => ({
          ...get(e, ext),
          ...topLayers
        }), e);
      return {
        ...get(e, e._extends._value),
        ...e
      };
    case 'function':
      return {
        ...e._extends(e),
        ...e
      };
    default:
    case 'string':
      return {
        ...get(e, e._extends),
        ...e
      };
  }
}


const extend2 = {
  _switchType: {
    object: (e) => ({
      // if e._extends._value is an object (for some reason)
      ...e._extends._value,
      ...e,
      _extends: {
        ...e._extends,
        _value: undefined
      }
    }),
    array: (e) => extend({
      // slice off each extension in array and recurse
      ...get(e, e._extends._value.first()),
      ...e,
      _extends: {
        ...e._extends,
        _value: e._extends._value.length > 0 
          ? e._extends._value.slice(1) 
          : undefined
      }
    }),
    function: (e) => extend({
      // run the function and recurse
      ...e,
      _extends: {
        ...e._extends,
        _value: e._extends._value(e)
      }
    }),
    default: (e) => ({
      ...get(e, e._extends._value),
      ...e,
      _extends: {
        ...e._extends,
        _value: undefined
      }
    }),
    /*
    e._value.reduce(
      (topLayers, ext) => ({
        ...get(e, ext),
        ...topLayers
      }),
      e
    ),
    */
  }
};

const switchType = (e, value) => {
  const st = e._switchType;
  switch (typeof value) {
    case 'number':
    case 'bigint':
    // zero
    // positiveNumber
    // negativeNumber
    // decimal
      // float
      // double
    // bit (0/1)

    case 'string':
    // emptystring
    // date
    // timestamp
    // year
    // char
    // binary

    case 'boolean':
    // true
    // false

    case 'null':
    case 'undefined':

    case 'object':
    // array
    // function
    // emptyObject

    case 'symbol': // ?

    // default
      // any
    break;

  }
}

const initialize = (e, key) => {
  switch (typeof e[key]) {
    case 'undefined':
      e[key] = {
        _key: key,
        _parent: e
      }
      break;
    case 'object':
      if (!Array.isArray(e[key]) && Object.isExtensible(e[key])) {
        if ('_key' in e[key] && e[key]._key !== key) {
          console.error(key, e[key]._key);
          throw 'Key mismatch';
        }
        e[key]._key = key; // TODO nonstring keys
        if ('_parent' in e[key] && e[key]._parent !== e)
          throw 'Parent mismatch'
        e[key]._parent = e;
        break;
      }
      break;
    case 'function':
      e[key] = {
        _value: e[key],
        _key: key,
        _parent: e
      }
        // set essential services before running
      e[key]._value(e);
      break;
    default:
      switch (key) {
        case '_value':
        case '_key':
          // for now, treat these as string constants
          return e[key];
        default:
          // everything else is an object shorthand
          e[key] = {
            _value: e[key],
            _key: key,
            _parent: e
          }
      }
      break;
  }

  e[key] = extend(e[key]);

  return e[key];
}

const set = (e, path, value) => {
  const pos = get(e, path, true);
  console.log(e, path, pos);
  switch (typeof value) {
    default:
      pos._value = value;
      return pos;
    case 'undefined':
      return pos;
    case 'object':
      return pos = {
        ...pos,
        ...value
      }; // TODO deep merge
  }
}

const get = (e, path, initUndefined = false) => {
  // TODO pathing
  if (e === undefined)
    return undefined;

  var pos = e;
  const steps = path.split('/')
  const step = steps.shift();

  switch (step) {
    case '.':
      break;
    case '..':
    case '_parent':
      if ('_parent' in pos)
        pos = pos._parent;
      else {
        console.error('_parent not found', step, pos, path, steps);
        throw 'Top level reached or _parent not defined';
      }
      break;
    default:
      if (step.startsWith('_parent')) {
        const parentLevels = parseInt(step.substring(7));
        for (var i = 0; i < parentLevels; i++) {
          pos = get(pos, '_parent');
        }
        break;
      } else if (initUndefined || typeof pos[step] !== 'undefined') {
        pos = initialize(pos, step);
      } else {
        console.error('Key not found', step, pos, path, steps);
        return undefined;
      }
      break;
  }

  if (steps.length > 0)
    return get(pos, steps.join('/'));
  return pos;
}

const renderValue = (e) => {
  switch(typeof e._value) {
    case 'function':
      return e._value(e);
    case 'undefined':
      return null;
    case 'string':
    default:
      // TODO array values?
      return e._value;
  }
}

const renderTemplate = (e) => {
  const t = e._template;
  switch (typeof t) {
    case 'undefined':
      return renderValue(e);
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
      const result = e._template._value(e);
      if (React.isValidElement(result))
        return result;
      else
        return render(result);
    default:
      // TODO
      return t;
  }
}

const has = (e, path) => {
  var pos = e;
  const steps = path.split('/');
  var found = true;
  steps.forEach((step) => {
    switch (step) {
      case '.':
        break;
      case '..':
      case '_parent':
        if ('_parent' in pos)
          pos = pos._parent;
        else {
          console.error('_parent not found', step, pos, path, steps);
          throw '_parent not defined';
        }
        break;
      default:
        if (typeof pos[step] !== 'undefined') {
          pos = initialize(pos, step);
        } else 
          found = false;
    }
  });

  return found;
}

const render = (e) => {
  console.log(e);

  if (typeof e !== 'object')
    return e;
  if (Array.isArray(e))
    return e.map(render);
  
  const rendered = renderTemplate(e);

  // use React engine:
  return React.createElement(
    e._type ? e._type : 'div',
    { // props
      ...e,
      className: e._class,
      key: e._key
    },
    rendered
  );
}



myApp = initializeRoot(myApp);

console.log(render(myApp));

console.log(myApp);

// set(myApp, 'footer/_class', 'App-logo2');

export default () => render(myApp);
