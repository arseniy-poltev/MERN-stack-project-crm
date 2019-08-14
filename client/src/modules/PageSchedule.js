import React, { PureComponent } from 'react';
import {Card, CardHeader, CardBody, Table, Row, Col, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label} from 'reactstrap';
import API from './API'
import Formatters from './Formatters'

function getMonday(d) {
  d = new Date(new Date(d).toLocaleDateString())
  var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

class PageSchedule extends PureComponent {

  constructor(props){

    super(props)

    this.state = {
      dateOffset: 0,
      viewBy: 'customers',
      hiddenCustomers: [],
      hiddenEmployees: [],
      modalIsOpen__EditShift: false,
      selectedShift: {},
      customers: [],
      employees: [],
      shifts: [],
    }

  }

  handleChangeEvent = (event) => {

    let key = event.target.name

    let value = event.target.value

    this.setState({[key]: value})

  }
  
  handleChangeEventSelectedShift = (event) => {

    let key = event.target.name

    let value = event.target.value

    let selectedShift = Object.assign({}, this.state.selectedShift, {[key]: value})

    if (key === 'customerId') {

      let customer = this.state.customers.filter(o=>o._id === value)[0]

      if (customer) selectedShift.customerName = customer.firstName

    }

    if (key === 'employeeId') {

      let employee = this.state.employees.filter(o=>o._id === value)[0]

      if (employee) selectedShift.employeeName = employee.firstName

    }

    this.setState({selectedShift})

  }
  

  handleClickAddShift = () => {

    this.setState({
      modalIsOpen__EditShift: true,
      selectedShift: {
        customerId: '',
        employeeId: '',
      }
    })

  }

  handleClickShift = (e, selectedShift) => {

    e.preventDefault()

    e.stopPropagation()

    // if (e.ctrlKey) console.log("Clicked shift with CTRL")

    this.setState({
      modalIsOpen__EditShift: true,
      selectedShift
    })

  }

  handleClickCell = (e, row, col, cell) => {

    // if (e.ctrlKey) console.log("CTRL KEY PRESSED")

    let selectedShift = {
      customerId: '',
      employeeId: '',
    }

    if (cell && cell.row) row = cell.row

    if (cell & cell.col) col = cell.col

    if (row && row.rowDataObject && row.rowDataObject.type === "customer") selectedShift.customerId = row.rowDataObject._id
    
    if (row && row.rowDataObject && row.rowDataObject.type === "employee") selectedShift.employeeId = row.rowDataObject._id

    if (col && col.date) selectedShift.startDate = col.date.toISOString().split('T')[0]

    this.setState({
      modalIsOpen__EditShift: true,
      selectedShift
    })

  }

  handleClickSaveShift = () => {

    let selectedShift = this.state.selectedShift

    if (selectedShift._id) {

      API.updateShift(selectedShift._id, selectedShift)
      .then(res => {

        let shifts = JSON.parse(JSON.stringify(this.state.shifts))
        
        shifts.splice(this.state.shifts.indexOf(selectedShift), 1, res.data)

        this.setState({
          modalIsOpen__EditShift: false, 
          shifts
        })

      })

    } else {
      
      API.createShift(selectedShift)
      .then(res => {
        
        let shifts = JSON.parse(JSON.stringify(this.state.shifts)).concat(res.data)

        this.setState({modalIsOpen__EditShift: false, shifts})
      })

    }

  }

  handleClickDeleteShift = (shift) => {

    if(window.confirm("Are you sure you want to do this? This cannot be undone.")){

      API.deleteShift(shift._id)
      .then(res => {

        let shifts = JSON.parse(JSON.stringify(this.state.shifts))

        shifts.splice(this.state.shifts.indexOf(shift), 1)

        this.setState({modalIsOpen__EditShift: false, shifts})

      })

    }

  }

  componentDidMount(){

    // get employees

    API.searchEmployees({
      where: {
        type: 'employee',
        disabled: null,
        deleted: null,
      }
    })
    .then(res => {
      this.setState({employees: res.data})
    })

    // get customers

    API.searchCustomers({
      where: {
        type: 'customer',
        disabled: null,
        deleted: null,
      }
    })
    .then(res => {
      this.setState({customers: res.data})
    })

    // get shifts

    API.searchShifts({
      where: {
        deleted: null
      }
    })
    .then(res => {
      this.setState({shifts: res.data})
    })

  }

  render(){

    let employees = this.state.employees

    let customers = this.state.customers

    let selectedShift = this.state.selectedShift || {}

    if (!employees || !customers) return (<div>Loading...</div>)

    let firstDayOfWeek = getMonday(new Date())

    let dates = Array(7).fill(true).map((o, i) => (new Date(firstDayOfWeek.getTime() + 24*60*60*1000*(i+this.state.dateOffset))))

    let times = Array(16*2).fill(true).map((o,i)=>{
      let time = new Date(new Date(0).getTime()+(1000*60*30*(i+11)))
      let text = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Europe/London' })
      return {text}
    })

    let cols = dates.map((date, colNum) => {

      let col = {date, colNum}

      col.props = {
        key: colNum,
        onClick: (e) => this.handleClickCell(e, null, col, null),
        className: "",
        style: {
          backgroundColor: date.toLocaleDateString() === new Date().toLocaleDateString() && '#383b30',
          // color: date.toLocaleDateString() == new Date().toLocaleDateString() && 'black'
        }
        // add more properties here for the first row in the table
      }

      col.className = "text-center no-select"

      col.title = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()] + ' ' + date.getDate()

      return col

    })

    let rowDataObjects

    if (this.state.viewBy === 'customers') {

      rowDataObjects = [{type: 'customer'}].concat(customers.filter(o => !this.state.hiddenCustomers.includes(o.firstName)))

    } else if (this.state.viewBy === 'employees') {

      rowDataObjects = [{type: 'employee'}].concat(employees.filter(o => !this.state.hiddenEmployees.includes(o.firstName)))

    }

    let rows = rowDataObjects.map((rowDataObject, rowNum) => {

      let row = {rowDataObject, rowNum}

      row.props = {
        key: rowNum,
        className: "",
        // add more properties here for the entire row
      }

      row.headerProps = {
        onClick: (e) => this.handleClickCell(e, row, null, null),
        style: {
          "maxWidth": "120px",
        }
        // add more properties here for the first column in the table.
      }

      row.cells = cols.map(col => {

        let date = col.date

        let cell = {row, col}

        cell.props = {
          key: col.colNum,
          onClick: (e) => this.handleClickCell(e, row, col, cell), 
          style: {
            minWidth: '100px',
            backgroundColor: date.toLocaleDateString() === new Date().toLocaleDateString() && (((row.rowNum % 2 === 0) && '#363b30') || '#383b30')
          },
          onDragOver: e => e.preventDefault(),
          onDrop: e => console.log('onDrop', 'src', e.dataTransfer.getData('text/plain'), cell), 
          // add more properties here for each cell
        }

        let shifts = this.state.shifts

        shifts = shifts.filter(shift => {
    
          // match in date range
    
          if (shift.startDate && date && date < new Date(shift.startDate + ' 00:00:00 MDT')) return false
    
          if (shift.endDate && date && date > new Date(shift.endDate + ' 00:00:00 MDT')) return false
    
          // match on day of week
    
          if (new Date(shift.startDate).getUTCDay() !== date.getUTCDay()) return false
    
          // match on customer

          if (rowDataObject.type === 'customer' && shift.customerId !== (rowDataObject._id || '')) return false

          // match on employee
    
          if (rowDataObject.type === 'employee' && shift.employeeId !== (rowDataObject._id || '')) return false

          // console.log(rowDataObject, rowDataObject._id, rowDataObject.type, shift.customerId, shift.employeeId)

          return true
    
        })
        
        cell.items = shifts.map((shift, i) => {

          let item = {shift}

          let displayShiftStartTime = (!shift.startTime.includes(":00") ? shift.startTime.split(' ')[0] : shift.startTime.split(':')[0]) + (shift.startTime.includes("AM") ? 'a' : 'p')

          let displayShiftEndTime = (!shift.endTime.includes(":00") ? shift.endTime.split(' ')[0] : shift.endTime.split(':')[0]) + (shift.endTime.includes("AM") ? 'a' : 'p')

          item.title = (
            <div>
              <div>{displayShiftStartTime} - {displayShiftEndTime}</div>
              <div>{(rowDataObject.type === 'customer' && shift.employeeName) || shift.customerName}</div>
            </div>
          )
          // <div>{item.shift.startTime}-{item.shift.endTime}</div>
          // <div>{item.title}</div>

          // item.title = (rowDataObject.type === 'customer' && shift.employeeName) || shift.customerName

          let color = "bg-success"
    
          if (!shift.customerId) color = "bg-secondary"
    
          if (!shift.employeeId) color = "bg-danger"

          item.cardProps = {
            key: i,
            className: "mb-0",
            onClick: (e) => this.handleClickShift(e, shift),
            draggable: true,
            onDrag: (e) => {
              e.preventDefault()
            },
            onDragStart: e => {
              e.dataTransfer.setData('text/plain', shift._id)
            }
          }

          item.cardBodyProps = {
            className: "p-1 pointer small text-left " + color
          }

          return item

        })
    
        return cell

      })
      
      row.title = rowDataObject.firstName || 'Unassigned'

      return row

    })

    let data = {
      rows
    }






    /*

    Color Coding
    Open Modal
      List of Exceptions
        Delete Exception
        Edit Exception

    Work Schedule / Shift Schedule / Customer Schedule / The Schedule

      Master schedule vs sketches
      Scheduled Duration

      Watches (individual on ongoing): ['eugene.rice@atlantishomecare.com']

      Exceptions to schedule
        Date
        Scheduled Start
        Scheduled Stop
        Scheduled Duration
        Scheduled Employee ID
        Scheduled Employee Name
        Is Cancelled?
      


    Shift Log
      Work Schedule ID

      Actual Start
      Actual Stop
      Actual Duratiaon
      Actual Employee ID
      Actual Employee Name
      
      Notes

      ? Cross-Training Employee ID
      ? Cross-Training Employee Name
      ? Was Missed Shift
      ? On-Call Employee Name
      ? On-Call Employee ID
      ? Missed shift justified?
      ? Billable Duration
      ? Payable Duration
      ? Is Holiday
      Alternate 


      Attachments



    Time entries will surely be tracked separately and may (usually) or may not be associated with a shift.

    Yesterday and before: Time Entries
    Today (open/not-closed): Time Entries and Scheduled Shifts
    Tomorrow and Forward: Scheduled Shifts

    Do we close out a day? Automatic closing or click button.
      Scheduled shifts without a coresponding time entry should be recorded as a missed shift time entry.
      Missed Shifts
      Cancelled Shifts


    highlight current date

    Get shift logs
    Get schedule
    Combine the two
    Compile a list of customers to retrieve
    Get list of customers
    Compile a list of employees
    Get list of employees

    https://www.html5rocks.com/en/tutorials/dnd/basics/

    */

    return (
      <div className="animated fadeIn">
        <Modal size="xl" isOpen={this.state.modalIsOpen__EditShift} toggle={()=>this.setState({modalIsOpen__EditShift: !this.state.modalIsOpen__EditShift})}>
          <ModalHeader>Edit Shift</ModalHeader>
          <ModalBody>
            <Row>
            <Col xs="3">
                <Label>Start Date</Label>
                <Input type="date" name="startDate" value={selectedShift.startDate || ''} onChange={this.handleChangeEventSelectedShift} />
              </Col>
              <Col xs="3">
                <Label>End Date</Label>
                <Input type="date" name="endDate" value={selectedShift.endDate || ''} onChange={this.handleChangeEventSelectedShift} />
              </Col>
              <Col xs="3">
                <div>Start Time</div>
                <Input type="select" name="startTime" value={selectedShift.startTime || ''} onChange={this.handleChangeEventSelectedShift}>
                  {times.map((o,i)=>(
                    <option key={i} value={o.text}>{o.text}</option>
                  ))}
                </Input>
              </Col>
              <Col xs="3">
                <div>End Time</div>
                <Input type="select" name="endTime" value={selectedShift.endTime || ''} onChange={this.handleChangeEventSelectedShift}>
                  {times.map((o,i)=>(
                    <option key={i} value={o.text}>{o.text}</option>
                  ))}
                </Input>
              </Col>
              <Col xs="3">
                <Label>Customer</Label>
                <Input type="select" name="customerId" value={selectedShift.customerId || ''} onChange={this.handleChangeEventSelectedShift}>
                  <option value="">Unassigned</option>
                  {customers.map((c, i) => (
                    <option key={i} value={c._id}>{c.firstName}</option>
                  ))}
                </Input>
              </Col>
              <Col xs="3">
                <Label>Employee</Label>
                <Input type="select" name="employeeId" value={selectedShift.employeeId || ''} onChange={this.handleChangeEventSelectedShift}>
                  <option value="">Unassigned</option>
                  {employees.map((c, i) => (
                    <option key={i} value={c._id}>{c.firstName}</option>
                  ))}
                </Input>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="text-right">
            {selectedShift._id && (<Button onClick={() => this.handleClickDeleteShift(selectedShift)}><i className="fa fa-trash"></i></Button>)}
            <Button onClick={()=>this.setState({modalIsOpen__EditShift: false})}>Cancel</Button>
            <Button color="primary" onClick={this.handleClickSaveShift}>Save</Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col lg="2">
            { this.state.viewBy === 'employees' && (
            <Card>
              <CardHeader>Employees</CardHeader>
              <CardBody className="pre-scrollable" style={{'maxHeight': '150px'}}>
                <Table size="sm" hover borderless>
                  <tbody>
                    {employees.map((o,i) => (
                      <tr key={i} className="pointer" style={{'color': this.state.hiddenEmployees.includes(o.firstName) && 'gray'}} onClick={() => {
                        this.setState({hiddenEmployees: this.state.hiddenEmployees.includes(o.firstName) ? this.state.hiddenEmployees.filter(v=>v!==o.firstName) : this.state.hiddenEmployees.concat(o.firstName)})
                      }}><td>{o.firstName}</td></tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            )}
            
            { this.state.viewBy === 'customers' && (
            <Card>
              <CardHeader>Customers</CardHeader>
              <CardBody className="pre-scrollable" style={{'maxHeight': '150px'}}>
                <Table size="sm" hover borderless>
                  <tbody>
                    {customers.map((o,i) => (
                      <tr key={i} className="pointer" style={{'color': this.state.hiddenCustomers.includes(o.firstName) && 'gray'}} onClick={() => {
                        this.setState({hiddenCustomers: this.state.hiddenCustomers.includes(o.firstName) ? this.state.hiddenCustomers.filter(v=>v!==o.firstName) : this.state.hiddenCustomers.concat(o.firstName)})
                      }}><td>{o.firstName}</td></tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            )}

          </Col>
          <Col lg="10">
            <Card>
              <CardHeader>Schedule</CardHeader>
              <CardBody className="overflow-auto">
                <Row>
                  <Col xs="3">
                    <Input type="select" name="viewBy" onChange={this.handleChangeEvent} bsSize="sm">
                      <option value="customers">View By: Customer</option>
                      <option value="employees">View By: Employee</option>
                    </Input>
                  </Col>
                  <Col xs="5">
                    <div>
                      <Button size="sm" onClick={()=>this.setState({dateOffset: 0})}>Today</Button>&nbsp; 
                      <Button size="sm" onClick={()=>this.setState({dateOffset: this.state.dateOffset-7})}><i className="icon-arrow-left"/></Button>&nbsp;
                      <Button size="sm" onClick={()=>this.setState({dateOffset: this.state.dateOffset+7})}><i className="icon-arrow-right" /></Button>&nbsp;
                      {Formatters.dateFormatter(dates[0])} - {Formatters.dateFormatter(dates[6])}
                    </div>
                  </Col>
                  <Col xs="4" className="text-right">
                    <Button size="sm" onClick={this.handleClickAddShift}>Add Shift</Button>
                  </Col>
                </Row>
                <Table striped size="sm" hover bordered className="table-schedule">
                  <thead>
                    <tr>
                      <th></th>
                      {cols.map(col => (
                        <th {...col.props}>{col.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map(row => (
                      <tr {...row.props}>
                        <td {...row.headerProps}>{row.title}</td>
                        {row.cells.map(cell => (
                          <td {...cell.props} >{cell.title}
                            {cell.items.map(item => (
                              <Card {...item.cardProps} >
                                <CardBody {...item.cardBodyProps}>
                                  {item.title}
                                </CardBody>
                              </Card>
                            ))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div><span className="bg-success" style={{height:'15px',width:'15px',display:'inline-block'}}></span><span> = Permanent Placement &amp; Alternate</span></div>
                <div><span className="bg-primary" style={{height:'15px',width:'15px',display:'inline-block'}}></span><span> = Permanent Placement &amp; No Alternate</span></div>
                <div><span className="bg-warning text-dark" style={{height:'15px',width:'15px',display:'inline-block'}}></span><span> = Temporarily Staffed</span></div>
                <div><span className="bg-danger" style={{height:'15px',width:'15px',display:'inline-block'}}></span><span> = Needs assignment</span></div>
                <div><span className="bg-info text-dark" style={{height:'15px',width:'15px',display:'inline-block'}}></span><span> = </span></div>
                <div><span className="bg-secondary" style={{height:'15px',width:'15px',display:'inline-block'}}></span><span> = </span></div>
                <div><span className="bg-dark" style={{height:'15px',width:'15px',display:'inline-block'}}></span><span> = </span></div>
                <div><span className="bg-light text-dark" style={{height:'15px',width:'15px',display:'inline-block'}}></span><span> = </span></div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )

  }

}

export default PageSchedule
