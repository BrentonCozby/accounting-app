import React, { Component } from 'react'
import './edit-user-modal-component.css'
import FormService from 'services/form/form-service.js'
import Input from 'components/general/forms/Input/input-component.js'
import UsereSerivce from 'services/user/user-service.js'

class EditUserModel extends Component {

  state = {
    formError: null,
    fields: {
      userId: {
        label: 'User ID',
        columnSize: 4,
        hide: true,
        attributes: {
          id: 'userId',
          type: 'number',
          required: true,
          value: this.props.user.userId || '',
          disabled: true
        }
      },
      firstName: {
        label: 'First Name',
        columnSize: 4,
        attributes: {
          id: 'firstName',
          type: 'text',
          maxLength: '40',
          required: true,
          autoFocus: true,
          value: this.props.user.firstName || ''
        }
      },
      lastName: {
        label: 'Last Name',
        columnSize: 4,
        attributes: {
          id: 'lastName',
          type: 'text',
          maxLength: '40',
          required: true,
          value: this.props.user.lastName || ''
        }
      },
      email: {
        label: 'Email',
        columnSize: 6,
        attributes: {
          id: 'email',
          type: 'email',
          maxLength: '100',
          required: true,
          value: this.props.user.email || ''
        }
      },
      roles: {
        label: 'Roles',
        columnSize: 6,
        attributes: {
          id: 'roles',
          type: 'text',
          maxLength: '100',
          value: this.props.user.roles || ''
        }
      },
      password: {
        label: 'Password',
        columnSize: 6,
        hide: true,
        attributes: {
          id: 'password',
          type: 'password',
          maxLength: '40',
          required: true,
          value: ''
        }
      },
      confirmPassword: {
        label: 'Confirm Password',
        columnSize: 6,
        hide: true,
        attributes: {
          id: 'confirmPassword',
          type: 'password',
          maxLength: '40',
          required: true,
          value: ''
        }
      }
    }
  }

  componentDidMount() {
    if (this.props.mode === 'New') {
      this.setState(prevState => ({
        isSubmitDisabled: true,
        fields: {...prevState.fields,
          password: {...prevState.fields.password,
            hide: false
          },
          confirmPassword: {...prevState.fields.confirmPassword,
            hide: false
          }
        }
      }))
    }
  }

  onFieldChange = (e, fieldId) => {
    const newFields = FormService.updateFieldValue({ fieldId, newValue: e.target.value, fieldsMap: this.state.fields })

    const newState = { ...this.state, fields: newFields }

    const passwordField = document.querySelector('#password')
    const confirmPasswordField = document.querySelector('#confirmPassword')

    if (passwordField && confirmPasswordField) {
      this.verifyPasswords(newState, passwordField, confirmPasswordField)
    }

    this.setState(newState)
  }

  verifyPasswords = (state, passwordField, confirmPasswordField) => {
    if (passwordField.value && passwordField.value !== confirmPasswordField.value) {
      state.isSubmitDisabled = true

      state.fields.confirmPassword.message = {
        type: 'error',
        text: 'Passwords don\'t match'
      }
    } else if (!passwordField.value) {
      state.isSubmitDisabled = true
      state.fields.confirmPassword.message = null
    } else {
      state.isSubmitDisabled = false
      state.fields.confirmPassword.message = null
    }
  }

  resetForm = () => {
    const newFields = FormService.resetFieldValuesAndMessages(this.state.fields)

    this.setState({...this.state, fields: newFields, formError: null})
  }

  onBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      this.props.closeUserModal()
    }
  }

  submitForm = (e) => {
    e.preventDefault()

    const userData = {
      userId: this.state.fields.userId.attributes.value,
      firstName: this.state.fields.firstName.attributes.value,
      lastName: this.state.fields.lastName.attributes.value,
      email: this.state.fields.email.attributes.value,
      roles: this.state.fields.roles.attributes.value,
      password: this.state.fields.password.attributes.value
    }

    if (this.props.mode === 'New') {
      this.saveEditedUser(userData)
    }

    if (this.props.mode === 'Edit') {
      this.saveNewUser(userData)
    }
  }

  saveEditedUser = (userData) => {
    UsereSerivce.createUser({ ...userData })
    .then(() => {
      this.props.closeUserModal({ refreshUsers: true })
    })
    .catch(err => {
      if (err.messageMap) {
        this.setState({
          fields: FormService.setFieldMessages(this.state.fields, err.messageMap, 'error')
        })
      } else {
        this.setState({ formError: err.message || err })
      }
    })
  }

  saveNewUser = (userData) => {
    UsereSerivce.editUser({ userId: this.props.user.userId, updateMap: userData })
    .then(() => {
      this.props.closeUserModal({ refreshUsers: true })
    })
    .catch(err => {
      if (err.messageMap) {
        this.setState({
          fields: FormService.setFieldMessages(this.state.fields, err.messageMap, 'error')
        })
      } else {
        this.setState({ formError: err.message || err })
      }
    })
  }

  render() {
    return (
      <div className="edit-user-modal-component" onClick={this.onBackgroundClick}>
        <form onSubmit={this.submitForm} className="form">
          <header>
            <h1>{this.props.mode} Usere</h1>
          </header>
          <hr/>
          <main>
            <div className="row">
              {Object.entries(this.state.fields).map(([fieldId, field]) => {
                return !field.hide &&
                <Input
                  key={fieldId}
                  {...field}
                  attributes={{...field.attributes, onChange: (e) => this.onFieldChange(e, fieldId)}}
                />
              })}
            </div>
          </main>
          <footer>
            <div>
              <button type="reset" className="btn btn-link" onClick={this.resetForm}>reset</button>
              <button type="reset" className="btn btn-secondary" onClick={this.props.closeUserModal}>cancel</button>
              <button type="submit" className="btn btn-primary" disabled={this.state.isSubmitDisabled}>Submit</button>
            </div>
            {this.state.formError && (
              <div className="row user-feedback">
                <p className="col-xs-12 color-red">{this.state.formError}</p>
              </div>
            )}
          </footer>
        </form>
      </div>
    )
  }
}

export default EditUserModel
