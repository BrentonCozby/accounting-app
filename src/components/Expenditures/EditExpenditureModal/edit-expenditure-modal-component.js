import React, { Component } from 'react'
import './edit-expenditure-modal-component.css'
import { format } from 'date-fns'
import FormService from 'services/form/form-service.js'
import Input from 'components/general/forms/Input/input-component.js'
import AuthService from 'services/auth/auth-service.js'
import expenditureSerivce from 'services/expenditure/expenditure-service.js'

class EditExpenditureModal extends Component {

  isAdmin = AuthService.getAuthenticatedUser().roles.includes('admin')

  state = {
    formError: null,
    fields: {
      userId: {
        label: 'User ID',
        columnSize: 3,
        hide: true,
        attributes: {
          id: 'userId',
          type: 'number',
          required: true,
          value: this.props.expenditure.userId || this.props.userId || ''
        }
      },
      amount: {
        label: 'Amount',
        columnSize: 3,
        attributes: {
          id: 'amount',
          type: 'text',
          maxLength: '18',
          required: true,
          autoFocus: true,
          value: this.props.expenditure.amount || ''
        }
      },
      date: {
        label: 'Date',
        columnSize: 3,
        attributes: {
          id: 'date',
          type: 'text',
          maxLength: '10',
          value: this.props.expenditure.date ? format(this.props.expenditure.date, 'YYYY-MM-DD') : format(new Date(), 'YYYY-MM-DD')
        }
      },
      time: {
        label: 'Time',
        columnSize: 3,
        attributes: {
          id: 'time',
          type: 'text',
          maxLength: '8',
          value: this.props.expenditure.time || format(new Date(), 'HH:mm:ss')
        }
      },
      description: {
        label: 'Description',
        columnSize: 12,
        attributes: {
          id: 'description',
          type: 'text',
          maxLength: '200',
          value: this.props.expenditure.description || ''
        }
      },
      comment: {
        label: 'Comment',
        columnSize: 12,
        attributes: {
          id: 'comment',
          type: 'textarea',
          maxLength: '800',
          rows: '4',
          value: this.props.expenditure.comment || ''
        }
      }
    }
  }

  componentDidMount() {
    if (this.props.mode === 'New' && this.isAdmin) {
      this.setState(prevState => ({
        fields: {...prevState.fields,
          userId: {...prevState.fields.userId,
            hide: false
          }
        }
      }))
    }
  }

  onFieldChange = (e, fieldId) => {
    const newFields = FormService.updateFieldValue({ fieldId, newValue: e.target.value, fieldsMap: this.state.fields })

    const newState = { ...this.state, fields: newFields }

    this.setState(newState)
  }

  resetForm = () => {
    const newFields = FormService.resetFieldValuesAndMessages(this.state.fields)

    this.setState({...this.state, fields: newFields, formError: null})
  }

  onBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      this.props.closeExpenditureModal()
    }
  }

  submitForm = (e) => {
    e.preventDefault()

    const expenditureData = {
      amount: parseFloat(this.state.fields.amount.attributes.value).toFixed(2),
      date: this.state.fields.date.attributes.value,
      time: this.state.fields.time.attributes.value,
      description: this.state.fields.description.attributes.value,
      comment: this.state.fields.comment.attributes.value
    }

    if (this.props.mode === 'New') {
      expenditureSerivce.createExpenditure({ userId: this.state.fields.userId.attributes.value, expenditureData })
      .then(() => {
        this.props.closeExpenditureModal({ refreshExpenditures: true })
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

    if (this.props.mode === 'Edit') {
      expenditureSerivce.editExpenditure({ expenditureId: this.props.expenditure.expenditureId, updateMap: expenditureData })
      .then(() => {
        this.props.closeExpenditureModal({ refreshExpenditures: true })
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
  }

  render() {
    return (
      <div className="edit-expenditure-modal-component" onClick={this.onBackgroundClick}>
        <form onSubmit={this.submitForm} className="form">
          <header>
            <h1>{this.props.mode} Expenditure</h1>
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
              <button type="reset" className="btn btn-secondary" onClick={this.props.closeExpenditureModal}>cancel</button>
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

export default EditExpenditureModal
