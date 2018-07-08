import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import { isAuthenticated } from 'services/auth/auth-service.js'
import LoadingService from 'services/loading/loading-service.js'
import history from './history.js'

import 'css/sanitize.css';
import 'css/html5boilerplate.css';
import 'react-table/react-table.css'
import 'css/react-table-overrides.css'
import 'css/resets.css';
import 'css/print.css';
import 'css/utils.css';
import 'css/buttons.css';
import 'components/general/forms/forms.css';

import NoMatch from 'components/NoMatch/no-match-component.js'
import Navbar from 'components/Navbar/navbar-component.js'
import Dashboard from 'components/Dashboard/dashboard-component.js'
import LoadingOverlay from 'components/Loading/loading-overlay-component.js'
import Login from 'components/Login/login-component.js'
import SignUp from 'components/SignUp/sign-up-component.js'

class App extends Component {

  state = {
    navbarHeight: 40,
    isLoadingQueueEmpty: true
  }

  shouldGoToDashboard = () => {
    return isAuthenticated() && ['/', '/login'].includes(history.location.pathname)
  }

  componentDidMount() {
    if (!isAuthenticated() && history.location.pathname !== '/sign-up') {
      history.redirect('/login')
    }

    if (this.shouldGoToDashboard()) {
      history.redirect('/dashboard')
    }

    LoadingService.listen('App.js', isLoadingQueueEmpty => {
      this.setState({ ...this.state, isLoadingQueueEmpty })
    })
  }

  componentDidUpdate() {
    if (!isAuthenticated() && history.location.pathname !== '/sign-up') {
      history.redirect('/login')
    }

    if (this.shouldGoToDashboard()) {
      history.redirect('/dashboard')
    }
  }

  renderRoutes = () => {
    return (
      <Switch>
        <Route path={'/dashboard'} component={Dashboard}/>
        <Route path={'/login'} component={Login}/>
        <Route path={'/sign-up'} component={SignUp}/>
        <Route component={NoMatch}/>
      </Switch>
    )
  }

  render() {
    const mainStyle = {
      padding: '10px',
      paddingTop: `${this.state.navbarHeight + 10}px`,
      backgroundColor: '#f8f8f8',
      minHeight: '100vh',
      position: 'relative'
    }

    return (
      <div className='App'>
        <Navbar height={this.state.navbarHeight}/>
        <main style={mainStyle}>
          {!this.state.isLoadingQueueEmpty && <LoadingOverlay/>}
          {this.renderRoutes()}
        </main>
      </div>
    );
  }
}

export default App;
