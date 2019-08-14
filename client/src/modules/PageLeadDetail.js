import React, {Component} from 'react';
import {Card, CardHeader, CardBody, Row, Col, Input, Button} from 'reactstrap';
import {Link} from 'react-router-dom'
import ScheduleGraph from './ScheduleGraph'
import API from './API'

class PageLeadDetail extends Component {

  constructor(props){

    super(props)

    this.state = {
      data: [],
    }

  }

  handleAvailabilityChange = (availability) => {

    let data = Object.assign({}, this.state.data)

    data.availability = Object.assign([], availability)

    API.updateCustomer(this.props.match.params.id, {availability})

    this.setState({data})

  }

  onClickMakeCustomer = () => {

    if (window.confirm("Are you sure you want to convert this sales lead to a customer?")) {

      API.updateCustomer(this.state.data._id, {type: 'customer'})
      .then(res => {

        let url = this.props.location.pathname.replace('leads', 'customers')

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
      {name: "Intake Assessment (coming soon...)", },
      {name: "Contacts (coming soon...)", },
    ]

    let managesCustomers = this.props.session && this.props.session.authorizations && this.props.session.authorizations.includes('manages customers')

    return (
      <div className="animated fadeIn">
        <h1>
          <span>Sales Lead: {data.firstName} {data.lastName}</span>
          {managesCustomers && (
            <Button className="pull-right" color="success" onClick={this.onClickMakeCustomer}>Make Customer</Button>
          )}
          {/* <Button className="pull-right" color="info">Move to Bench</Button> */}
        </h1>
        
        <Row>
          <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Overview
              </CardHeader>
              <CardBody>
                Referral source, budget, summary
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
          <Col xs="12" lg="6">
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


export default PageLeadDetail

