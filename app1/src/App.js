import React, { useState, useEffect, Suspense } from 'react';
import { loadRemote } from '@module-federation/runtime';


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

const App = () => {
  const [visible, setVisible] = useState(false)

  const Component = useDynamicImport(visible ? { scope: 'app2', module: 'Widget' } : { module: '', scope: '' });
   
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      }}
    >
      <h2>App 1</h2>
      <button onClick={() => setVisible(true)}>show App2 remote component.</button>
      <br />

      <div style={{ marginTop: '2em' }}>
        <Suspense fallback="Loading System">
          <Component />
        </Suspense>
      </div>
    </div>
  );
};

export default App;
