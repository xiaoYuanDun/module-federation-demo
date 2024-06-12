import React, { Suspense, useState, useEffect } from 'react';
import { init, loadRemote } from '@module-federation/runtime';

const subAppPlugin = () => {
  return {
    name: 'app2-runtime-plugin',
    onLoad: (args) => {
      console.log('--- --- --- ', args.id, ' loaded in [ app2 ].')
      return args
    }
  }
}

const dynamicRemoteConfig = {
  name: 'app2',
  remotes: [
    {
      name: 'app3',
      entry: 'http://localhost:3003/remoteEntry.js'
    }
  ],
  plugins: [subAppPlugin()]
}


// 2. read the origin init, and use it in app2
const globalInit = window.__MY_GLOBAL_ATTR__.origin


// 2.1. is not work, and it will add the plugin to mf_instance__app1

// except: when i click "get App3 Widget", the subAppPlugin can work like 2.2

// can debug here
globalInit(dynamicRemoteConfig)


// 2.2. work
// init(dynamicRemoteConfig)






function useDynamicImport({ module, scope }) {
  const [component, setComponent] = useState(null);

  useEffect(() => {
    if (!module && !scope) return;

    const loadComponent = async () => {
      const { default: component } = await loadRemote(`${scope}/${module}`);
      setComponent(() => component);
    };
    loadComponent();
  }, [module, scope]);
  const fallback = () => null;
  return component || fallback;
}

export default function Widget() {
  const [visible, setVisible] = useState(false)
  const Component = useDynamicImport(visible ? { scope: 'app3', module: 'Widget' } : { module: '', scope: '' });
  return (
    <div
      style={{
        borderRadius: '4px',
        padding: '2em',
        backgroundColor: 'red',
        color: 'white',
      }}
    >
      <h2>I am App 2 Widget</h2>
      <button onClick={() => setVisible(true)}>get App3 Widget.</button>
      <div style={{ marginTop: '2em' }}>
        <Suspense fallback="Loading System">
          <Component />
        </Suspense>
      </div>
    </div>
  );
}
