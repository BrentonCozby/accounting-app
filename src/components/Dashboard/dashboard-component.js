import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Expenditures from 'components/Expenditures/expenditures-component.js'
import Users from 'components/Users/users-component.js'
import AuthService from 'services/auth/auth-service.js'

class Dashboard extends Component {

  render() {
    const roles = AuthService.getAuthenticatedUser().roles || ''
    const canEditUsers = roles.includes('admin') || roles.includes('manager')

    return (
      <div className="dashboard-component">
        <Switch>
          <Route path="/dashboard/expenditures" component={Expenditures}/>
          {canEditUsers && <Route path="/dashboard/users" component={Users}/>}
          <Redirect to="/dashboard/expenditures"/>
        </Switch>
      </div>
    )
  }
}

export default Dashboard
