import React from 'react'
import './loading-component.css'
import Spinner from  './loading-spinner-component.js'

function LoadingOverlay() {
  return (
    <div className="loading-overlay-component">
      <Spinner/>
    </div>
  )
}

export default LoadingOverlay
