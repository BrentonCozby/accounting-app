import React, { Component } from 'react'
import './expenditures-component.css'
import AuthService from 'services/auth/auth-service.js'
import expenditureSerivce from 'services/expenditure/expenditure-service.js'
import ReactTable from 'react-table'
import EditexpenditureModal from './EditExpenditureModal/edit-expenditure-modal-component.js'
import ExpenditureReport from './ExpenditureReport/expenditure-report-component.js'

class Expenditures extends Component {

  authenticatedUser = AuthService.getAuthenticatedUser()

  state = {
    expendituresTableTitle: `${this.authenticatedUser.firstName} ${this.authenticatedUser.lastName}`,
    expendituresColumns: [
      {
        Header: 'ID',
        accessor: 'expenditureId',
        minWidth: 15
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
        minWidth: 35,
        show: false
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
        minWidth: 35,
        show: false
      },
      {
        Header: 'Amount',
        id: 'amount',
        accessor: data => parseFloat(data.amount),
        minWidth: 40,
        Cell: cell => '$ ' + cell.value.toFixed(2)
      },
      {
        Header: 'Description',
        accessor: 'description',
        minWidth: 40
      },
      {
        Header: 'Date',
        accessor: 'date',
        minWidth: 40,
        Cell: cell => cell.value.substr(0, 10)
      },
      {
        Header: 'Time',
        accessor: 'time',
        minWidth: 35,
      },
      {
        Header: 'Comment',
        accessor: 'comment',
        sortable: false
      },
      {
        Header: '',
        accessor: 'buttonsCell',
        minWidth: 15,
        filterable: false,
        sortable: false,
        Cell: cell => {
          return (
            <div className="cell-buttons text-right">
              <button
                title="Edit"
                className="edit"
                onClick={() => this.editExpenditure(cell.original)}>
                <i className="fas fa-edit"></i>
              </button>
              &nbsp;
              &nbsp;
              <button
                title="Delete"
                className="delete"
                onClick={() => this.deleteExpenditure(cell.original.expenditureId)}>
                <i className="fas fa-trash-alt"></i>
              </button>
              &nbsp;
            </div>
          )
        }
      }
    ],
    expendituresData: []
  }

  componentDidMount() {
    this.getExpendituresForAuthenticatedUser()
  }

  toggleNameColumns = ({ show, columns }) => {
    return columns.map(column => {
      if (['firstName', 'lastName'].includes(column.accessor)) {
        column.show = show
      }

      return column
    })
  }

  getExpendituresForAuthenticatedUser = () => {
    expenditureSerivce.getExpendituresByUserId({
      userId: this.authenticatedUser.userId,
      selectFields: ['amount', 'description', 'date', 'time', 'comment']
    }).then(res => {
      const newState = {...this.state,
        expendituresData: res,
        expendituresTableTitle: `${this.authenticatedUser.firstName} ${this.authenticatedUser.lastName}`,
        activeNavBtn: 'authUser'
      }

      newState.expendituresColumns = this.toggleNameColumns({ show: false, columns: newState.expendituresColumns })

      this.setState(newState)
    })
  }

  getAllExpenditures = () => {
    expenditureSerivce.getAllExpenditures({
      selectFields: ['firstName', 'lastName', 'amount', 'description', 'date', 'time', 'comment']
    }).then(res => {
      const newState = {...this.state,
        expendituresData: res,
        expendituresTableTitle: 'All Users',
        activeNavBtn: 'allUsers'
      }

      newState.expendituresColumns = this.toggleNameColumns({ show: true, columns: newState.expendituresColumns })

      this.setState(newState)
    })
  }

  searchForExpenditures = (e) => {
    let userId = this.state.searchForUserId

    if (e) {
      userId = window.prompt('Get expenditures for userId: ')

      if (!userId) {
        return
      }

      this.setState({ searchForUserId: userId })
    }

    expenditureSerivce.getExpendituresByUserId({
      userId: userId,
      selectFields: ['firstName', 'lastName', 'amount', 'description', 'date', 'time', 'comment']
    })
    .then(res => {
      let fullName

      if (res[0] && res[0].firstName && res[0].lastName) {
        fullName = `${res[0].firstName} ${res[0].lastName}`
      }

      const newState = {...this.state,
        expendituresData: res,
        expendituresTableTitle: `${fullName ? fullName : `userId: ${userId}`}`,
        activeNavBtn: 'search'
      }

      newState.expendituresColumns = this.toggleNameColumns({ show: false, columns: newState.expendituresColumns })

      this.setState(newState)
    })
  }

  refreshExpenditures = () => {
    switch (this.state.activeNavBtn) {
      case 'authUser':
        this.getExpendituresForAuthenticatedUser()
        break
      case 'allUsers':
        this.getAllExpenditures()
        break
      case 'search':
        this.searchForExpenditures()
        break
      default:
        this.getExpendituresForAuthenticatedUser()
    }
  }

  deleteExpenditure = (expenditureId) => {
    if (!window.confirm(`Delete expenditure with expenditureId: ${expenditureId}?`)) {
      return
    }

    expenditureSerivce.deleteExpenditure({ expenditureId })
    .then(() => {
      this.refreshExpenditures()
    })
  }

  editExpenditure = (expenditure) => {
    this.setState({ editExpenditureModal: { expenditure } })
  }

  closeExpenditureModal = (options = {}) => {
    this.setState({ editExpenditureModal: null, newExpenditureModal: null })

    if (options.refreshExpenditures) {
      this.refreshExpenditures()
    }
  }

  closeExpenditureReport = () => {
    this.setState({ viewExpenditureReport: null })
  }

  openExpenditureReport = () => {
    this.setState({...this.state,
      viewExpenditureReport: {
        heading: this.state.expendituresTableTitle,
        expenditures: this.state.expendituresData
      }
    })
  }

  render() {
    const isAdmin = this.authenticatedUser.roles.includes('admin')

    return (
      <div className="expenditures-component">
        {this.state.editExpenditureModal && (
          <EditexpenditureModal
            expenditure={this.state.editExpenditureModal.expenditure}
            mode="Edit"
            closeExpenditureModal={this.closeExpenditureModal}
          />
        )}
        {this.state.newExpenditureModal && (
          <EditexpenditureModal
            expenditure={{}}
            mode="New"
            closeExpenditureModal={this.closeExpenditureModal}
            userId={this.authenticatedUser.userId}
          />
        )}
        {this.state.viewExpenditureReport && (
          <ExpenditureReport
            expenditures={this.state.viewExpenditureReport.expenditures}
            heading={this.state.viewExpenditureReport.heading}
            closeExpenditureReport={this.closeExpenditureReport}
          />
        )}
        {isAdmin && (
          <div className="row">
            <div className="col-xs-12">
              <div className="table-actions-row">
                <h3 className="label">Table<br/>Filters</h3>
                <button
                  className={`btn ${this.state.activeNavBtn === 'authUser' ? 'is-active' : ''}`}
                  onClick={this.getExpendituresForAuthenticatedUser}>
                  Your Expenditures
                </button>
                <button
                  className={`btn ${this.state.activeNavBtn === 'allUsers' ? 'is-active' : ''}`}
                  onClick={this.getAllExpenditures}>
                  All Users' Expenditures
                </button>
                <button
                  className={`btn ${this.state.activeNavBtn === 'search' ? 'is-active' : ''}`}
                  onClick={this.searchForExpenditures}>
                  Search For Expenditures
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="table-container">
          <div className="row table-title-row bottom-xs">
            <div className="col-xs-8">
              <h2 className="table-title">Expenditures for {this.state.expendituresTableTitle}</h2>
            </div>
            <div className="col-xs-4 text-right">
              <button className="btn" onClick={this.openExpenditureReport}>
                Summary Report
              </button>
              <button className="btn" onClick={() => {this.setState({ newExpenditureModal: true })}}>
                <i className="fas fa-plus"></i> New Expenditure
              </button>
            </div>
          </div>
          <ReactTable
            columns={this.state.expendituresColumns}
            data={this.state.expendituresData}
            pageSizeOptions={[5, 10, 15, 20, 50, 100]}
            defaultPageSize={15}
            filterable={true}
            className="expenditures-table -striped -highlight"
          />
        </div>
      </div>
    )
  }
}

export default Expenditures
