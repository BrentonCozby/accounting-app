import React from 'react'
import './input-component.css'
import Select from './select/select-component.js'
import Textarea from './textarea/textarea-component.js'

function Input({
  label,
  attributes,
  selectOptions,
  message,
  columnSize
}) {

  function renderInputElement(type) {
    if (type === 'select') {
      return <Select attributes={attributes} selectOptions={selectOptions}/>
    }

    if (type === 'textarea') {
      return <Textarea attributes={attributes}/>
    }

    return <input {...attributes}/>
  }

  return (
    <div className={`input-component form-input ${columnSize ? `col-xs-${columnSize}` : ''}`}>
      {label && <label htmlFor={attributes.id || ''}>{label}</label>}
      {renderInputElement(attributes.type)}
      {message && <span className={`message ${message.type}`}>{message.text}</span>}
    </div>
  )
}

export default Input
