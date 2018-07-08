import React from 'react'
import './navbar-component.css'
import { NavLink } from 'react-router-dom'
import AuthService from 'services/auth/auth-service.js'
import { isAuthenticated, logout } from 'services/auth/auth-service.js'
import logo from './logo.png'

function Logo({ navbarHeight }) {
  const RATIO = 580 / 75

  const containerStyle = {
    boxSizing: 'border-box',
    padding: '7px',
    width: `${(navbarHeight - 14) * RATIO}px`
  }

  const logoStyle = {
    width: '100%'
  }

  return (
    <div style={containerStyle}>
      <img src={logo} alt="Account App logo" style={logoStyle} className="logo"/>
    </div>
  )
}

function Navbar({ height }) {

  function renderDashboardLinks() {
    const roles = AuthService.getAuthenticatedUser().roles || ''

    const links = [
      <NavLink key="expenditures" to="/dashboard/expenditures" className="btn btn-link nav-link" activeClassName="is-active">Expenditures</NavLink>
    ]

    if (roles.includes('manager') || roles.includes('admin')) {
      links.push(<NavLink key="users" to="/dashboard/users" className="btn btn-link nav-link" activeClassName="is-active">Users</NavLink>)
    }

    return links
  }

  return (
    <header className="navbar-component" style={{ height: `${height}px` }}>
      <Logo navbarHeight={height}/>
      <nav>
        {isAuthenticated() && renderDashboardLinks()}
        {isAuthenticated() && <button className="btn btn-link nav-link" onClick={logout}>Logout</button>}
      </nav>
    </header>
  )
}

export default Navbar
