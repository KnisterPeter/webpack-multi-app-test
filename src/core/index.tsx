import * as React from "react";
import * as ReactDOM from "react-dom";

export { Plugin } from './plugin';

export {
  React,
  ReactDOM
}

const script = document.createElement('script');
script.src = './dist/sub/index.js';
script.onload = function() {
  console.log('loaded api.sub', (window as any).api.sub);
  const plugin = new (window as any).api.sub.default;
  const App: React.ComponentType = plugin.main;
  ReactDOM.render(<App />, document.getElementById('app'));
}
document.body.appendChild(script);
