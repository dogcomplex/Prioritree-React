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

const myApp = {
  _type:      'div',
  _class:     'App',
  _template:  'header',
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
  footer: {
    _template: ['../header/logo']
  }
};

console.log(AppOld());

const get = (e, key) => {
  // TODO pathing
}

// TODO set parents, keys

const renderElement = (e) => {
  if (typeof e !== 'object')
    return e;
  if (Array.isArray(e)) {
    console.log(e);
    return e.map(render);
  }
  
  var rendered = null;
  if ('_template' in e) {

    const renderTemplate = (t) => {
      switch (typeof t) {
        case 'object': 
          if (Array.isArray(t))
            return t.map(
              // list of keys in e
              (value) => renderElement(e[value])
            );
          return renderElement(t);
        case 'string':
          // key in e:
          return renderElement(e[t]);
        case 'function':
          // template function, which reduces into a template
          const result = t(e);
          if (Array.isArray(result))
            return result.map(renderElement);
          return renderElement(t(e));
        default:
          // TODO
          return t;
      }
    }
    rendered = renderTemplate(e._template);
  
  } else if ('_value' in e) {
    const renderValue = (v) => {
      switch(typeof v) {
        case 'function':
          return v(e);
        case 'string':
        default:
          // TODO array values?
          return v;
      }
    }
    rendered = renderValue(e._value);
  }

  // use React engine:
  return React.createElement(
    e._type ? e._type : 'div',
    { // props
      ...e,
      className: e._class 
    },
    rendered
  );
}


const render = (element) => {
  if (typeof element !== 'object')
    return element;
  
  var children = null;
  if (typeof element.props !== 'undefined' && typeof element.props.children !== 'undefined') {
    if (Array.isArray(element.props.children))
      children = element.props.children.map(render);
    else
      children = render(element.props.children);
  }

  return React.createElement(
    element.type,
    element.props,
    children
  );
}


  console.log(renderElement(myApp));

export default () => renderElement(myApp);
