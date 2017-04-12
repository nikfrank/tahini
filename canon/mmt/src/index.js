import React from 'react';
import { render } from 'react-dom';
import { bootApp, networkMiddleware } from 'tahini';

import App from './App';
import './index.css';

import networkHandlers from './network/';

const RootP = bootApp(
  [ networkMiddleware(networkHandlers) ]
).getDevice(App, [], App.initState);

render(
  <RootP/>,
  document.getElementById('root')
);







() => {
  `import React from 'react';
  import { BrowserRouter as Router, Route } from 'react-router-dom';

  import createBrowserHistory from 'history/createBrowserHistory';

  const history = createBrowserHistory();

  export const bootAppWithRoutes = ({ getDevice }, routes = new Error('cannot bootAppWithRoutes without any routes'))=>{

    const getRoute = ({routePath, dataPath, componentClass, subRoutes=[]})=>(
      <Route path={routePath || componentClass.namespace} key={routePath}
	     component={getDevice(componentClass, dataPath, componentClass.initState)} />
    );

    return (
      <Router history={history}>
        <div>
          {routes.map(getRoute)}
        </div>
      </Router>
    );
  };`
}
