import React, { Component } from 'react'
import './users-component.css'
import UserSerivce from 'services/user/user-service.js'
import ReactTable from 'react-table'
import EditUserModal from './EditUserModal/edit-user-modal-component.js'

class Users extends Component {

  state = {
    usersTableTitle: 'Users',
    usersColumns: [
      {
        Header: 'ID',
        accessor: 'userId',
        minWidth: 15
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
        minWidth: 35
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
        minWidth: 35
      },
      {
        Header: 'Email',
        accessor: 'email',
        minWidth: 50
      },
      {
        Header: 'Roles',
        accessor: 'roles',
        minWidth: 30
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
                onClick={() => this.editUser(cell.original)}>
                <i className="fas fa-edit"></i>
              </button>
              &nbsp;
              &nbsp;
              <button
                title="Delete"
                className="delete"
                onClick={() => this.deleteUser(cell.original.userId)}>
                <i className="fas fa-trash-alt"></i>
              </button>
              &nbsp;
            </div>
          )
        }
      }
    ],
    usersData: []
  }

  componentDidMount() {
    this.getAllUsers()
  }

  getAllUsers = () => {
    UserSerivce.getAllUsers({
      selectFields: ['firstName', 'lastName', 'email', 'roles']
    }).then(res => {
      const newState = {...this.state,
        usersData: res
      }

      this.setState(newState)
    })
  }

  deleteUser = (userId) => {
    if (!window.confirm(`Delete user with userId: ${userId}?`)) {
      return
    }

    UserSerivce.deleteUser({ userId })
    .then(() => {
      this.getAllUsers()
    })
  }

  editUser = (user) => {
    this.setState({ editUserModal: { user } })
  }

  closeUserModal = (options = {}) => {
    this.setState({ editUserModal: null, newUserModal: null })

    if (options.refreshUsers) {
      this.getAllUsers()
    }
  }

  render() {
    return (
      <div className="users-component">
        {this.state.editUserModal && (
          <EditUserModal
            user={this.state.editUserModal.user}
            mode="Edit"
            closeUserModal={this.closeUserModal}
          />
        )}
        {this.state.newUserModal && (
          <EditUserModal
            user={{}}
            mode="New"
            closeUserModal={this.closeUserModal}
          />
        )}
        <div className="table-container">
          <div className="row table-title-row bottom-xs">
            <div className="col-xs-8">
              <h2 className="table-title">{this.state.usersTableTitle}</h2>
            </div>
            <div className="col-xs-4 text-right">
              <button className="btn" onClick={() => {this.setState({ newUserModal: true })}}>
                <i className="fas fa-plus"></i> New User
              </button>
            </div>
          </div>
          <ReactTable
            columns={this.state.usersColumns}
            data={this.state.usersData}
            pageSizeOptions={[5, 10, 15, 20, 50, 100]}
            defaultPageSize={15}
            filterable={true}
            className="users-table -striped -highlight"
          />
        </div>
      </div>
    )
  }
}

export default Users
