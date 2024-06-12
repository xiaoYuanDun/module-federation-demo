import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { init } from '@module-federation/runtime';

const mainAppPlugin = () => {
  return {
    name: 'app1-runtime-plugin',
    onLoad: (args) => {
      console.log('--- --- --- ', args.id, ' loaded in [ app1 ].')
      return args
    }
  }
} 

init({ 
  name: 'app1', 
  remotes: [
    {
      name: 'app2',
      entry: 'http://localhost:3002/remoteEntry.js'
    }
  ],
  plugins: [mainAppPlugin()]
});

// 1. save the origin init reference in window.__MY_GLOBAL_ATTR__
window.__MY_GLOBAL_ATTR__ = {
  origin: (args) => init(args)
}

ReactDOM.render(<App />, document.getElementById('root'));
