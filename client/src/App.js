import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './modules/PrivateRoute'
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import './App.scss';
// import './tests/SocketIO.js'
const loading = () => <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});

// Pages
const PageLogin = Loadable({
  loader: () => import('./modules/PageLogin'),
  loading
});

const PageRegister = Loadable({
  loader: () => import('./modules/PageRegister'),
  loading
});

const PageActivate = Loadable({
  loader: () => import('./modules/PageActivate'),
  loading
});

const Page404 = Loadable({
  loader: () => import('./modules/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./modules/Page500'),
  loading
});

class App extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={PageLogin} />
          <Route exact path="/register" name="Register Page" component={PageRegister} />
          <Route exact path="/activate/:email/:activationToken" name="Activation Page" component={PageActivate} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <PrivateRoute path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
