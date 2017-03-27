import React from 'react';
import {Router, Route, hashHistory} from 'react-router';

export const bootAppWithRoutes = ({ getDevice }, rootRoute = new Error('cannot bootAppWithRoutes without any routes'))=>{

  const getRoute = ({routePath, dataPath, componentClass, subRoutes=[]})=>(
    <Route path={routePath || componentClass.namespace} key={routePath}
	   component={getDevice(componentClass, dataPath, componentClass.initState)}>
      {subRoutes.map(getRoute)}
    </Route>
  );

  return (<Router history={hashHistory} routes={[rootRoute].map(getRoute)}/>);
};
