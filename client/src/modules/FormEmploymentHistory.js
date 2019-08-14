// TODO: Explain gaps in employment
// TODO: Create a line where gaps are and a "+" button to automatically add a period of employment that fills the gap.
// TODO: scroll to top of new job when new job is added.

import React, {Component} from 'react'
import FormEmploymentHistoryJob from './FormEmploymentHistoryJob'
import {Button, Table} from 'reactstrap';

let getPeriodInformation = (startMonth, startYear, endMonth, endYear) => {

  let info = {start: null, end: null, duration: null}

  let toPresent = endMonth === 'Present'

  // set the start

  if (startMonth && startYear) info.start = `${startMonth}/${startYear}`

  // set the end

  if (toPresent) {
    
    info.end = endMonth

  } else if (endMonth && endYear){

    info.end = `${endMonth}/${endYear}`

  }

  // set the duration

  if (startMonth && endMonth && endMonth && (endYear || toPresent)) {

    let y1 = parseInt(startYear)

    let y2 = toPresent ? new Date().getFullYear() : parseInt(endYear)
  
    let m1 = parseInt(startMonth)
  
    let m2 = toPresent ? new Date().getMonth() + 1 : parseInt(endMonth)
  
    info.duration = (y2 - y1) * 12 + m2 - m1

  }

  return info

}

let jobSort = (a, b) => {
  return parseInt(a.startYear) - parseInt(b.startYear)
  || parseInt(a.startMonth) - parseInt(b.startMonth)
  || parseInt(a.endYear) - parseInt(b.endYear)
  || parseInt(a.endMonth) - parseInt(b.endMonth)
}

class JobRow extends Component {

  shouldComponentUpdate(props, state){

    return JSON.stringify(props) !== JSON.stringify(this.props)

  }

  render(){

    let item = this.props.data

    let info = getPeriodInformation(item.startMonth, item.startYear, item.endMonth, item.endYear)

    return (

      <tbody>
        <tr onClick={this.props.onHeaderClick} className="pointer text-uppercase btn-warning" >
          <td className="text-center">{this.props.id}</td>
          <td className="text-center">{info.start || '?'}</td>
          <td className="text-center">{info.end || '?'}</td>
          <td className="text-center">{info.duration || '?'}</td>
          <td>{item.companyName || '?'}</td>
          <td>{item.jobTitle || '?'}</td>
          <td>{item.hoursPerWeek || '?'}</td>
          <td>{item.payRate || '?'}</td>
          <td className="text-right"><Button size="sm" onClick={this.props.onDelete}><i className="fa fa-trash"></i></Button></td>
        </tr>
        {/* <Collapse tag="tr" isOpen={this.props.isOpen} className={{hidden: true}}> */}
        <tr className={(!this.props.isOpen ? ' d-none' : '')}>
          <td></td>
          <td colSpan="8">
            <FormEmploymentHistoryJob id={this.props.id} data={item} onChange={this.props.onChange} />
          </td>
        </tr>
        {/* </Collapse> */}
      </tbody>

    )

  }

}

class FormEmploymentHistory extends Component{

  constructor(props) {

    super(props)

    this.state = {}

    this.addEmploymentHistory = this.addEmploymentHistory.bind(this)

  }

  addEmploymentHistory(){

    let k = new Date().toJSON()

    this.props.onUpdate((data) => {

      data[k] = {}

    })

    // this.setState({openJobAccordion: k})

  }

  isAccordionOpen(k, i){

    if (this.state.openJobAccordion) {

      return k === this.state.openJobAccordion

    } else {

      if (i === 0) return true

    }

  }

  toggleAccordion(k){

    this.setState({openJobAccordion: k})

  }

  handleChange(fnModifier, fnAccessor){

    if(this.props.onChange) this.props.onChange((data) => {

      fnModifier(fnAccessor(data))

    })

  }

  handleDelete(item){

    if(window.confirm("Are you sure you want to delete this item?")){

      this.props.onChange((data) => {

        delete data[item.key]
  
      })
  
    }
    
  }

  shouldComponentUpdate(props, state){

    let result = JSON.stringify(props) !== JSON.stringify(this.props) 
    || JSON.stringify(state) !== JSON.stringify(this.state)

    return result
    
  }

  render(){

    let data0 = this.props.data || {}

    let data = Object.keys(data0).map(k => {

      return Object.assign({key: k}, data[k])

    }).sort(jobSort)

    return (

      <div>
        
        { data.length > 0 && 
          <Table size="sm">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">From</th>
                <th className="text-center">To</th>
                <th className="text-center">Duration</th>
                <th>Company</th>
                <th>Title</th>
                <th>Hours</th>
                <th>Pay</th>
                <th></th>
              </tr>
            </thead>
            {data.map((item, i) => {

              let handleUpdate = (fn) => {
                this.props.onUpdate((data) => {
                  fn(data[item.key])
                })
              }

              let props = {
                id: i+1,
                key: item.key,
                data: item,
                isOpen: this.isAccordionOpen(item.key, i),
                onHeaderClick: () => this.toggleAccordion(item.key),
                onDelete: () => this.handleDelete(item),
                onUpdate: handleUpdate,
                // onChange: (fn) => this.handleChange(fn, (data) => data[item.key]),
              }
              return (
                <JobRow {...props} />
              )
            })}
          </Table>
        }

        <div className="text-center">
          <Button onClick={this.addEmploymentHistory} color="primary">Add Work History</Button>
        </div>

      </div>
    )

  }

}

export default FormEmploymentHistory