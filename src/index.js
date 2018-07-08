import React from 'react'
import ReactDOM from 'react-dom'
import 'whatwg-fetch'
import App from './App'
// import registerServiceWorker from './registerServiceWorker'
import history from './history.js'
import { Router } from 'react-router-dom'

ReactDOM.render((
  <Router history={history}>
    <App />
  </Router>
), document.getElementById('root'))
// registerServiceWorker()
