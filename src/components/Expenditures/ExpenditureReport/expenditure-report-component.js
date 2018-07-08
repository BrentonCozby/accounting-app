import React, { Component } from 'react'
import './expenditure-report-component.css'
import { startOfWeek, format, compareDesc } from'date-fns'
import Input from 'components/general/forms/Input/input-component.js'
import ReactTable from 'react-table'

class ExpenditureReport extends Component {

  state = {
    heading: '',
    selectedWeek: '',
    weeksMap: {},
    selectedWeekColumns: [
      {
        Header: 'ID',
        accessor: 'expenditureId',
        minWidth: 15
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
      }
    ],
    selectedWeekData: [],
    allWeeksColumns: [
      {
        Header: 'Week',
        accessor: 'week',
        minWidth: 30,
        Cell: cell => format(cell.value, 'YYYY-MM-DD')
      },
      {
        Header: 'Total Amount',
        id: 'totalAmount',
        accessor: data => parseFloat(data.totalAmount),
        minWidth: 30,
        Cell: cell => '$ ' + cell.value.toFixed(2)
      },
      {
        Header: 'Avg Daily Spending',
        id: 'avgDailySpending',
        accessor: data => parseFloat(data.avgDailySpending),
        minWidth: 30,
        Cell: cell => '$ ' + cell.value.toFixed(2)
      }
    ],
    allWeeksData: [],
    summaryFields: [
      {
        label: 'Total Amount',
        id: 'totalAmount',
        value: '',
        columnSize: 5
      },
      {
        label: 'Avg Daily Spending',
        id: 'avgDailySpending',
        value: '',
        columnSize: 5
      }
    ],
    weekSelectionField: {
      label: 'Viewing Week Of:',
      attributes: {
        id: 'selectedWeek',
        type: 'select',
        value: ''
      },
      selectOptions: []
    }
  }

  componentDidMount() {
    const newState = {...this.state}

    newState.heading = this.props.heading
    newState.weeksMap = this.createWeeksMap()
    newState.weekSelectionField.selectOptions = this.createWeeksOptions(newState.weeksMap)
    newState.selectedWeek = newState.weekSelectionField.selectOptions[0].value
    newState.selectedWeekData = this.createSelectedWeekData(newState.weeksMap, newState.selectedWeek)

    const summaryValues = this.createWeekSummaryValues(newState.selectedWeekData)

    newState.summaryFields = [...newState.summaryFields]
    newState.summaryFields[0].value = `$ ${summaryValues.totalAmount}`
    newState.summaryFields[1].value = `$ ${summaryValues.avgDailySpending}`

    this.setState(newState)
  }

  createWeeksMap = () => {
    const weeksMap = {}

    this.props.expenditures.forEach(expenditure => {
      if (!weeksMap[startOfWeek(expenditure.date)]) {
        weeksMap[startOfWeek(expenditure.date)] = []
      }

      weeksMap[startOfWeek(expenditure.date)].push(expenditure)
    })

    return weeksMap
  }

  createWeeksOptions = (weeksMap) => {
    return Object.keys(weeksMap)
    .map(week => {
      return { value: week, description: format(week, 'YYYY-MM-DD') }
    })
    .sort((a, b) => compareDesc(new Date(a.value), new Date(b.value)))
  }

  updateWeekSelectionFieldValue = (e) => {
    const newState = {...this.state, selectedWeek: e.target.value }

    newState.weekSelectionField = {...newState.weekSelectionField,
      attributes: {...newState.weekSelectionField.attributes,
        value: e.target.value
      }
    }

    newState.selectedWeekData = this.createSelectedWeekData(newState.weeksMap, e.target.value)

    const summaryValues = this.createWeekSummaryValues(newState.selectedWeekData)

    newState.summaryFields = [...newState.summaryFields]
    newState.summaryFields[0].value = `$ ${summaryValues.totalAmount}`
    newState.summaryFields[1].value = `$ ${summaryValues.avgDailySpending}`

    this.setState(newState)
  }

  createSelectedWeekData = (weeksMap, selectedWeek) => {
    return weeksMap[selectedWeek].map(expenditure => {
      return this.props.expenditures.find(e => e.expenditureId === expenditure.expenditureId)
    })
  }

  createAllWeeksData = (weeksMap) => {
    return Object.entries(weeksMap).map(([weekDate, expenditures]) => {
      const weekData = this.createSelectedWeekData(weeksMap, weekDate)
      const summaryValues = this.createWeekSummaryValues(weekData)

      return {
        week: weekDate,
        totalAmount: summaryValues.totalAmount,
        avgDailySpending: summaryValues.avgDailySpending
      }
    })
  }

  createAllWeeksSummaryValues = (allWeeksData) => {
    const summaryValues = {
      totalAmount: '',
      avgDailySpending: ''
    }

    summaryValues.totalAmount = allWeeksData.reduce((sum, week) => {
      return sum + parseFloat(week.totalAmount)
    }, 0)

    summaryValues.avgDailySpending = ''

    return summaryValues
  }

  showAllWeeksData = () => {
    const newState = {...this.state, viewAllWeeks: !this.state.viewAllWeeks }

    newState.allWeeksData = this.createAllWeeksData(newState.weeksMap)

    let summaryValues

    if (!this.state.viewAllWeeks) {
      summaryValues = this.createAllWeeksSummaryValues(newState.allWeeksData)
    } else {
      summaryValues = this.createWeekSummaryValues(newState.selectedWeekData)
    }

    newState.summaryFields = [...newState.summaryFields]
    newState.summaryFields[0].value = `$ ${summaryValues.totalAmount}`
    newState.summaryFields[1].value = `$ ${summaryValues.avgDailySpending}`

    this.setState(newState)
  }

  createWeekSummaryValues = (selectedWeekData) => {
    const values = {
      totalAmount: '',
      avgDailySpending: ''
    }

    values.totalAmount = selectedWeekData.reduce((sum, week) => {
      return sum + parseFloat(week.amount)
    }, 0).toFixed(2)

    values.avgDailySpending = parseFloat(values.totalAmount / 7).toFixed(2)

    return values
  }

  printReport = () => {

  }

  render() {
    return (
      <div className="expenditure-report-component" id="expenditure-report-component">
        <div className="main-frame">
          <header className="title-row row">
            <div className="col-xs-8">
              <h1>Expenditure Report for {this.state.heading}</h1>
            </div>
            <div className="col-xs-4 title-row-buttons text-right">
              <button className="btn btn-primary print" onClick={this.printReport}>print</button>
              <button className="btn btn-secondary close" onClick={this.props.closeExpenditureReport}>close</button>
            </div>
          </header>
          <hr/>
          <main>
            <div className="row bottom-xs table-header-row">
              <div className="col-xs-3">
                {!this.state.viewAllWeeks &&
                  <Input
                    key="selectedWeek"
                    {...this.state.weekSelectionField}
                    attributes={{...this.state.weekSelectionField.attributes, onChange: this.updateWeekSelectionFieldValue}}
                  />
                }
              </div>
              <div className="col-xs-3">
                <button className="btn btn-secondary" onClick={this.showAllWeeksData}>
                  {!this.state.viewAllWeeks ? 'Compare Weeks' : 'View One Week'}
                </button>
              </div>
              <div className="col-xs-6 summary-fields">
                <div className="row end-xs">
                  {this.state.summaryFields.map(field => (
                    <div key={field.id} className={`display-field ${field.columnSize ? `col-xs-${field.columnSize}` : ''}`}>
                      <label>{field.label}</label>
                      <span>{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                {!this.state.viewAllWeeks && (
                  <ReactTable
                    columns={this.state.selectedWeekColumns}
                    data={this.state.selectedWeekData}
                    defaultPageSize={50}
                    showPagination={false}
                    filterable={true}
                    className="selected-week-table -striped -highlight"
                  />
                )}
                {this.state.viewAllWeeks && (
                  <ReactTable
                    columns={this.state.allWeeksColumns}
                    data={this.state.allWeeksData}
                    defaultPageSize={50}
                    showPagination={false}
                    filterable={true}
                    className="all-weeks-table -striped -highlight"
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }
}

export default ExpenditureReport
