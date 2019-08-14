import React, {Component} from 'react';
import {Card, CardHeader, CardBody, Row, Col, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label} from 'reactstrap';
import {Link} from 'react-router-dom'
import ScheduleGraph from './ScheduleGraph'
import API from './API'

const FLAG_SHOW_MODAL_DISABLE_CUSTOMER = 'FLAG_SHOW_MODAL_DISABLE_CUSTOMER'

class PageCustomerDetail extends Component {

  constructor(props){

    super(props)

    this.state = {
      data: [],
    }

  }

  handleChange = (event) => {

    let key = event.target.name

    let value = event.target.value

    API.updateEmployee(this.state.data._id, {[key]: value})

    let data = Object.assign({}, this.state.data)

    data[key] = value

    this.setState({data})

  }

  handleAvailabilityChange = (availability) => {

    let data = Object.assign({}, this.state.data)

    data.availability = Object.assign([], availability)

    API.updateCustomer(this.props.match.params.id, {availability})

    this.setState({data})

  }

  toggleModal = (key = 'FLAG_SHOW_MODAL_DEFAULT') => {

    this.setState({[key]: !this.state[key]})

  }

  toggleModal__disableCustomer = () => this.toggleModal(FLAG_SHOW_MODAL_DISABLE_CUSTOMER)

  handleClickConirmDisableCustomer = () => {

    let data = {
      cancellationReason: this.state.data.cancellationReason,
      disabled: (new Date()).toISOString(),
    }

    if (!data.cancellationReason) return alert("Please complete the form.")

    API.updateCustomer(this.state.data._id, data)
    .then(res => {

      this.props.history.push('/customers?tab=inactive')

    })

  }

  onClickMakeCustomer = () => {

    if (window.confirm("Are you sure you want to convert this job candidate to an employee?")) {

      API.updateCustomer(this.state.data._id, {type: 'employee'})
      .then(res => {

        let url = this.props.location.pathname.replace('candidates', 'employees')

        this.props.history.push(url)

      })

    }

  }

  onInteractionSelect = (obj) => {

    this.props.history.push(obj.url)

  }

  onArtifactSelect = (obj) => {

    this.props.history.push(obj.url)

  }

  onAttachmentSelect = (obj) => {

    this.props.history.push(obj.url)

  }

  componentWillMount(){

    API.fetchCustomer(this.props.match.params.id)
    .then(res => {

      let data = res.data

      this.data = JSON.parse(JSON.stringify(data))

      this.setState({data})

    })

  }

  render(props) {

    let data = this.state.data

    if (!data) return (<div>Loading...</div>)

    let artifacts = [
      {name: "Care Plan (coming soon...)", },
      {name: "Shift Checklist (coming soon...)", },
      {name: "Contacts (coming soon...)", },
      {name: "Supervisory Visits"},
      {name: "Complaints (coming soon...)", },
      {name: "Shift Log (coming soon...)", },
      {name: "Care Team (coming soon...)", },
    ]


    let modalProps = {
      isOpen: this.state[FLAG_SHOW_MODAL_DISABLE_CUSTOMER],
      autoFocus: true,
      centered: true,
      backdrop: true,
      toggle: this.toggleModal__disableCustomer
    }
    
    let btnEnable = (<Button className="pull-right" onClick={this.handleClickEnableCustomer} size="sm" color="info">Activate</Button>)

    let btnDisable = (<Button className="pull-right" onClick={this.toggleModal__disableCustomer} size="sm" color="warning">Deactivate</Button>)

    let activationButton = data.disabled ? btnEnable : btnDisable
    
    return (
      <div className="animated fadeIn">
        <Modal {...modalProps}>
          <ModalHeader>
            <span>Deactivate Customer</span>
          </ModalHeader>
          <ModalBody>
            <Label>Discharge Reason</Label>
            <Input type="textarea" name="cancellationReason" placeholder="Enter the reason for discharge/cancellation..." value={data.cancellationReason} onChange={this.handleChange} />
          </ModalBody>
          <ModalFooter className="text-right">
            <Button onClick={this.toggleModal__disableCustomer} size="sm" color="info">Cancel</Button>
            <Button color="warning" size="sm" onClick={this.handleClickConirmDisableCustomer}>Deactivate</Button>
          </ModalFooter>
        </Modal>
        <h1>
          <span>Customer: {data.firstName} {data.lastName}</span>
          {activationButton}
          {/* <Button className="pull-right" color="info">Move to Bench</Button> */}
        </h1>
        
        <Row>
          <Col xs="12" xl="6">
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Overview
              </CardHeader>
              <CardBody>
                Garage codes, contact information, 
                <Input type="textarea" name="textarea-input" id="textarea-input" rows="4" placeholder="Notes..." />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Artifacts
              </CardHeader>
              <CardBody>
                <ul className="artifacts-list">
                {artifacts.map((o, i) => (
                  <li key={i}>
                    {o.url && (<Link to={o.url}>{o.name}</Link>)}
                    {!o.url && o.name}
                  </li>
                ))}
                </ul>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Attachments
              </CardHeader>
              <CardBody>
                Coming soon...
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Interactions
              </CardHeader>
              <CardBody>
                Coming soon...
              </CardBody>
            </Card>
          </Col>          
          <Col xs="12" sm="12" md="6">
            <Card>
              <CardHeader>
                <i className="icon-menu"></i> Schedule
              </CardHeader>
              <CardBody>
                <ScheduleGraph data={data.availability} onChange={this.handleAvailabilityChange} id="availability" />
                {/* Availability
                Expected Hours */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
  
}


export default PageCustomerDetail

