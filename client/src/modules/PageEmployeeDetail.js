import React, {PureComponent} from 'react';
import {Card, CardHeader, CardBody, Row, Col, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter, Label, Table} from 'reactstrap';
import {Link} from 'react-router-dom'
import ScheduleGraph from './ScheduleGraph'
import API from './API'
import Formatters from './Formatters'

const FLAG_SHOW_MODAL_DISABLE_EMPLOYEE = 'FLAG_SHOW_MODAL_DISABLE_EMPLOYEE'

class PageEmployeeDetail extends PureComponent {
  constructor(props){

    super(props)

    this.state = {
      data: [],
    }    

  }

  // LIFE CYCLE EVENTS
  // //////////////////////////////////////////////////////////////////////////////////////////////

  componentWillMount(){

    API.fetchEmployee(this.props.match.params.id)
    .then(res => {

      let data = res.data

      this.setState({data})

    })

    // this.props.fetchEmployee(this.props.match.params.id)

    // this.setState({loading: true})

    // fetch('api/v1/employees/' + this.props.match.params.id)
    // .then(res => res.json())
    // .then(res => {

    //   // TODO: These can be removed when we ar etrackign this data in the object.

    //   res.data.interactions = [
    //     {id: 1, created: new Date(), user: 'Jerimiah Baldwin', type: 'Phone Screen Completed'},
    //     {id: 2, created: new Date(), user: 'Jerimiah Baldwin', type: 'Phone Screen Completed'},
    //     {id: 3, created: new Date(), user: 'Jerimiah Baldwin', type: 'Phone Screen Completed'},
    //   ]

    //   res.data.attachments = [
    //     {id: 1, created: new Date(), user: 'Jerimiah Baldwin', name: 'In-Person Interview Recording'},
    //     {id: 2, created: new Date(), user: 'Jerimiah Baldwin', name: 'Resume'},
    //     {id: 3, created: new Date(), user: 'Jerimiah Baldwin', name: 'Photo'},
    //     {id: 4, created: new Date(), user: 'Jerimiah Baldwin', name: 'DORA Check'},
    //   ]

    //   this.setState({data: res.data, loading: false})

    // })

  }

  // EVENT HANDLERS
  // //////////////////////////////////////////////////////////////////////////////////////////////

  handleChangeEvent = (event) => {

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

    API.updateEmployee(this.props.match.params.id, {availability})

    this.setState({data})

  }

  handleClickEnableEmployee = () => {

    let data = this.state.data

    if (window.confirm("Are you sure you want to activate this employee?")) {

      API.updateEmployee(data._id, {disabled: null})
      .then(res => {

        this.props.history.push('/employees?tab=active')

      })

    }

  }

  toggleModal = (key = 'FLAG_SHOW_MODAL_DEFAULT') => {

    this.setState({[key]: !this.state[key]})

  }

  toggleModal__disableEmployee = () => this.toggleModal(FLAG_SHOW_MODAL_DISABLE_EMPLOYEE)

  handleClickConirmDisableEmployee = () => {

    let data = {
      terminationReason: this.state.data.terminationReason,
      disabled: (new Date()).toISOString(),
    }

    if (!data.terminationReason) return alert("Please complete the form.")

    API.updateEmployee(this.state.data._id, data)
    .then(res => {

      this.props.history.push('/employees?tab=inactive')

    })

  }

  // RENDER FUNCTIONS
  // //////////////////////////////////////////////////////////////////////////////////////////////
  
  render() {

    let data = this.state.data

    if (!data) return (<div>Loading...</div>)

    let btnEnable = (<Button className="pull-right" onClick={this.handleClickEnableEmployee} size="sm" color="info">Activate</Button>)

    let btnDisable = (<Button className="pull-right" onClick={this.toggleModal__disableEmployee} size="sm" color="warning">Deactivate</Button>)

    let activationButton = data.disabled ? btnEnable : btnDisable

    let managesEmployees = this.props.session && this.props.session.authorizations && this.props.session.authorizations.includes('manages employees')

    let managedFields = API.employeeManagedFields

    let artifacts = [
      {name: "Phone Screen", url: this.props.location.pathname + "/phone-screen"},
      {name: "Job Application", url: this.props.location.pathname + "/application"},
      {name: "In-Person Interview", url: this.props.location.pathname + "/in-person-interview"},
      {name: "Written Test (coming soon...)"},
      {name: "Social Media Investigation (coming soon...)"},
      {name: "Professional Reference Checks (coming soon...)"},
      {name: "New Hire Checklist (coming soon...)"},
      {name: "Performance Reviews (coming soon...)"},
      {name: "Supervisory Visits (coming soon...)"},
      {name: "Absenteeism and Tardiness (coming soon...)"},
      managesEmployees && {name: "Exit Interview", url: (this.props.location.pathname + '/exit-interview')},
    ]

    let attachments = [
      {name: "CAPS Background Check (coming soon...)"},
      {name: "Criminal History Check (coming soon...)"},
      {name: "DORA Background Check (coming soon...)"},
      {name: "Drug Screen (coming soon...)"},
    ]

    let modalProps = {
      isOpen: this.state[FLAG_SHOW_MODAL_DISABLE_EMPLOYEE],
      autoFocus: true,
      centered: true,
      backdrop: true,
      toggle: this.toggleModal__disableEmployee
    }

    return (
      <div className="animated fadeIn">
        <Modal {...modalProps}>
          <ModalHeader>
            <span>Deactivate Employee</span>
          </ModalHeader>
          <ModalBody>
            <Label>Termination Reason</Label>
            <Input type="textarea" name="terminationReason" placeholder="Enter the reason for termination..." value={data.terminationReason} onChange={this.handleChangeEvent} />
          </ModalBody>
          <ModalFooter className="text-right">
            <Button onClick={this.toggleModal__disableEmployee} size="sm" color="info">Cancel</Button>
            <Button color="warning" size="sm" onClick={this.handleClickConirmDisableEmployee}>Deactivate</Button>
          </ModalFooter>
        </Modal>
        <h1>
          <span>Employee: {data.firstName} {data.lastName}</span>
          {managesEmployees && activationButton}
          {/* <Button className="pull-right" color="info">Move to Bench</Button> */}
        </h1>
        <Row>
          <Col xs="12" xl="6">
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Overview
              </CardHeader>
              <CardBody>
                {(data.phone || data.email || data.address) && (<span>Contact: </span>)}
                <span>{Formatters.phoneLinkFormatter(data.phone)}</span> 
                {data.phone && data.email && (<span> - </span>)} 
                <span>{Formatters.emailLinkFormatter(data.email)}</span>
                {data.email && data.address && (<span> - </span>)} 
                <span>{Formatters.addressLinkFormatter(data.address, data.city, data.state, data.zip)}</span>

                {data.disabled && managesEmployees && (
                  <div>
                    <Label>Termination Reason</Label>
                    <Input type="textarea" name="terminationReason" placeholder="Enter a reason for termination" onChange={this.handleChangeEvent} value={data.terminationReason} />
                  </div>
                )}

                {/* Someone we would hire: Yes, No (if so, reason),  null
                Would we hire
                Red Flags
                Accent
                Criminal
                Drug */}
                {/* <Input type="textarea" name="textarea-input" id="textarea-input" rows="4" placeholder="Notes..." /> */}
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
                <i className="icon-menu"></i>Interactions
              </CardHeader>
              <CardBody>
                Coming soon.
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Attachments
              </CardHeader>
              <CardBody>
                <ul className="artifacts-list">
                {attachments.map((o, i) => (
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
                <i className="icon-menu"></i>Other Information
              </CardHeader>
              <CardBody>
                <Table size="sm" striped hover>
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(data).filter(k=>!managedFields.includes(k)).map((k,i) => (
                      <tr key={i}>
                        <td>{k}</td>
                        <td>{(typeof data[k] === 'object' && JSON.stringify(data[k])) || data[k]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>          
          <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Availability
              </CardHeader>
              <CardBody>
                <ScheduleGraph data={data.availability} onChange={this.handleAvailabilityChange} id="availability" onCall />
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


export default PageEmployeeDetail
/*

next shift
status: not clocked-in
hours worked this week
average working hours (3 week rolling average)
Separate Screens/Applications
  Digital Living Room (for customers, family, and friends)
    Schedule
      Cancel a shift
      Add a shift (one-time or ongoing)
      Adjust a shift (one-time or ongoing)
    Care Team
    Care Plan
      Checklist
    Care Log

  Care Portal (for employees)
    Dashboard
      Score
      Next Shift
      Hours Worked This Week
    Schedule
      Cancel a shift
      Available Shifts
    Profile
      Availability
      Desired Hours
      Cross Training
    Care Notes
    Performance
      Compass Contributions
      Absenteeism
      Tardiness
      Goals
      Supervisory Visits
      Performance Evaluations
  
  Application
    ***

EMPLOYEE SPECIFIC
New hire checklist
  Reference checks
  Written Test
  Drug Screen
  CBI
  DORA
  QBO
  TSheets
  etc.
Orientation Date
Observed Competencies
Positive Feedback
Negative Feedback
Performance Review
Tardiness
Absenteeism
Goals
Supervisory Visits
Availability
Desired Hours
Profile
Schedule
Cross Training
Skills
Observed Competencies
Training
Education





Contact Information
General Notes
Someone we would hire: Yes, No (if so, reason), null
***Application
  Work History
    Dates, Company, Title, Pay Rate, Reason for Leaving, Good Terms  
  Education
  Certifications
  Training
***Phone Screen
***In-Person Interview
***Interactions, e.g. bench calls, other scheduling calls, rescheduling, etc.
  person, date, notes
Availability
Expected hours per week
Expected Pay Rate
Desired Hours
Attachments, e.g. resume, vidoe recording
Map

Profile
  Ok with smoke
  Ok with cats
  Ok with dogs
  Ok with stairs
  Smokes tobacco
  Smokes Marijuana
  Lives with smoker
  ***Skills
    Hoardindg
    Alcoholism
    Dementia
Race
Language/Accent
Goals and ambitions
Future Education Plans
Family situation
  Spouse
  Kids
    Support network
Personality/Interests
Soft Skill
Professional Conduct
Professional Appearance
Fitness
  Obesity
  Injuries





The application itself is not that bad.
It does not specify that we want continuous work history.
We need to call the desired hours out a little bigger.
There is not enough room for the full address, city, state, zip.
There is not enough room for email.
There is not enough room for stating the reason for leaving.
There is no explanation on how to populate availability.
There are some important skills and abilities that I think are omitted from the list at the bottom. We should 









AHC: Create new interview form
Personal introduction
Family life and other obligations
Complete work history
Name of reference for each job
Reason for leaving each job
Where do you see yourself in 5 years?


Recruitment
	Overview: status (new, employees, bench, in progress, rejected), rating, rejection reason, notes, 
	Contact Information
	Profile: skills, gender, age, race, picture/photo id, availability, desired hours per week, allergies/sensitivities, 
	Phone Screen
	In Person Interview
	Job Application: skills, work history, pay expectations, availability, desired hours per week, allergies/sensitivities, 
	Interactions: date, notes






Prelude caregiver search criteria:
CNA
QMAP
Smoker
Lives with Smoker
Gender
Language proficiency
Race
City
Distance from point
Ok with Cats
Ok with Dogs
Ok with Smoke
Ok with Men
Expected Compensation
Criminal History
Drug Screen
Marijuana
Able to Lift
Reliable Vehicle
Job Application
Work History and References
4 years continuous work history; will be verified; must explain all gaps in employment;
1 reference for each company worked at over the last 4 years.
Consent to check references
Residence History
Location lived and dates.
Contact information
Phone 1
Phone 2
Personal Profile
Gender
Height?
Weight?
Race?
Accent?
Attractiveness?
Birthdate
Spouse
Children/Dependents
Year/Make/Model vehicle
Are you a Citizenship or Permanent Resident: Yes/No
Country of citizenship
Country of residence
Education
Highschool Diploma/GED
College
Training
Future education
Certifications
Expected Pay
Skills Matrix
Schedule
Desired work hours per week
Time completely unavailable
Ideal schedule
Criminal History
Goals and direction and ambitions
Closing interview response:
First In-Person Interview
“You’ve done a great job today. I think that you’re the kind of person that we would like to have on our team. I’ll have to send this up to my manager and he/she will decide whether to move forward or not with a follow-up interview. If we decide to move forward then you’ll get a phone call. If not, then you’ll receive an email. Either way, you’ll hear back from us within 5 business days. Thank you for your interest in working with our company and for taking the time to interview today.”
Second In-Person Interview: 
“You did a great job today. This is the final stage of the interviewing process. We’ll need up to 3 business days to reach a decision. Thank you for your interest in working with our company and for taking time to interview today.”
Qualified and shifts available:
“We have some shifts available that meet your own availability. If we don’t have all the hours you’re looking for right now then that may change in the future. I can’t promise when that will happen, but we’re always getting new customers so it’s only a matter of time. What we have available is … Would you like to get started with that work schedule?”
Qualified, but no shifts available: 
“You would be an awesome addition to the team. But, I don’t have any shifts open right now that align with your availability and there’s nothing I can move around right now that would meeting your availability. So, if you agree I’m going to touch base with you once or twice a week and see where you’re at with your job hunting. If you find something else before I can get you the work schedule you want then that’s not a problem. But, I’m going to keep working on finding a work schedule that fits your needs. Does that sound ok?”  



*/
