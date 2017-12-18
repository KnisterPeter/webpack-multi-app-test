import * as React from "react";
import * as ReactDOM from "react-dom";

import * as sub from 'sub';

export {
  React,
  ReactDOM
}

const script = document.createElement('script');
script.src = './dist/sub/index.js';
script.onload = function() {
  console.log('loaded', (window as any).api.sub);
  const App: React.ComponentType = (window as any).api.sub.App;
  ReactDOM.render(<App />, document.getElementById('app'));
}
document.body.appendChild(script);
