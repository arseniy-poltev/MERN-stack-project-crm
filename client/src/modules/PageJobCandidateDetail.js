import React, {Component} from 'react';
import {Card, CardHeader, CardBody, Row, Col, Input, Button, Table, Label, Progress} from 'reactstrap';
import {Link} from 'react-router-dom'
import ScheduleGraph from './ScheduleGraph'
import API from './API'
import Formatters from './Formatters'

class PageJobCandidateDetail extends Component {

  constructor(props){

    super(props)

    this.state = {
      data: [],
    }

  }

  handleChangeEvent = (event) => {

    let key = event.target.name

    let value = event.target.value

    API.updateEmployee(this.props.match.params.id, {[key]: value})

    this.setState(Object.assign(this.state.data, {[key]: value}))

  }

  handleAvailabilityChange = (availability) => {

    let data = Object.assign({}, this.state.data)

    data.availability = Object.assign([], availability)

    API.updateEmployee(this.props.match.params.id, {availability})

    this.setState({data})

  }

  onClickMakeEmployee = () => {

    if (window.confirm("Are you sure you want to convert this job candidate to an employee?")) {

      API.updateEmployee(this.state.data._id, {type: 'employee'})
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

    API.fetchEmployee(this.props.match.params.id)
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
      {name: "Phone Screen", url: this.props.location.pathname + "/phone-screen"},
      {name: "Job Application", url: this.props.location.pathname + "/application"},
      {name: "In-Person Interview", url: this.props.location.pathname + "/in-person-interview"},
    ]

    let managesEmployees = this.props.session && this.props.session.authorizations && this.props.session.authorizations.includes('manages employees')

    let managedFields = API.employeeManagedFields

    return (
      <div className="animated fadeIn">
        <Progress multi className="mb-4">
          <Progress bar value={100/6} className={(data.phoneScreenDate && 'bg-success') || 'bg-secondary'}>1) Phone Interview</Progress>
          <Progress bar value={100/6} className={(data.jobApplicationDate && 'bg-success') || 'bg-secondary'}>2) Job Application</Progress>
          <Progress bar value={100/6} className={(data.inPersonInterviewDate && 'bg-success') || 'bg-secondary'}>3) In-Person Interview</Progress>
          <Progress bar value={100/6} className={(data.referenceChecksCompleteDate && data.doraCheckCompleteDate && 'bg-success') || 'bg-secondary'}>4) Pre-Hire Due Diligence</Progress>
          <Progress bar value={100/6} className={(data.hireCompleteDate && 'bg-success') || 'bg-secondary'}>5) Hire</Progress>
          <Progress bar value={100/6} className={(data.qboSetupCompleteDate && data.drugScreenReviewCompleteDate && data.capsCheckCompleteDate && data.criminalBackgroundCheckCompleteDate && 'bg-success') || 'bg-secondary'}>6) Post-Hire Due Diligence</Progress>
        </Progress>

        <h1>
          <span>Candidate: {data.firstName} {data.lastName}</span>
          {managesEmployees && (
            <Button className="pull-right" color="success" onClick={this.onClickMakeEmployee}>Make Employee</Button>
          )}
          {/* <Button className="pull-right" color="info">Move to Bench</Button> */}
        </h1>
        <Row>
          <Col xs="12" xl="6">
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Overview
              </CardHeader>
              <CardBody>
                {/*
                Someone we would hire: Yes, No (if so, reason),  null
                Would we hire
                Red Flags
                Accent
                Criminal
                Drug
                */}

                {(data.phone || data.email || data.address) && (<h6>Contact </h6>)}
                <span>{Formatters.phoneLinkFormatter(data.phone)}</span> 
                {data.phone && data.email && (<span> - </span>)} 
                <span>{Formatters.emailLinkFormatter(data.email)}</span>
                {data.email && data.address && (<span> - </span>)} 
                <span>{Formatters.addressLinkFormatter(data.address, data.city, data.state, data.zip)}</span>

                <h6 className="mt-4">Progress</h6>
                <div className="job-candidate-process-list">
                  <div><i className={(data.phoneScreenDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'} ></i><span>Step 1: Phone Interview</span></div>
                  <div><i className={(data.jobApplicationDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span>Step 2: Job Application</span></div>
                  <div><i className={(data.inPersonInterviewDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span>Step 3: In-Person Interview</span></div>
                  <div><i className={(data.referenceChecksCompleteDate && data.doraCheckCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span>Step 4: Pre-Hire Due Diligence</span></div>
                  <div><i className={(data.referenceChecksCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>Professional Reference Checks</span></span></div>
                  <div><i className={(data.doraCheckCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>DORA Background Check</span></span></div>
                  <div><i className={(data.hireCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span>Step 5: Hiring Process</span></div>
                  <div><i className={(data.i9SignatureDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>I9</span></span></div>
                  <div><i className={(data.attachments && data.attachments.filter(o=>o.name="Identification").length > 0 && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>Proof of Identity (scan)</span></span></div>
                  <div><i className={(data.attachments && data.attachments.filter(o=>o.name="Proof of Eligibility to Work in U.S.").length > 0 && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>Proof of Eligibility to Work in the U.S. (scan)</span></span></div>
                  <div><i className={(data.w4SignatureDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>W4</span></span></div>
                  <div><i className={(data.directDepositCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>Direct Deposit Information and Consent</span></span></div>
                  <div><i className={(data.attachments && data.attachments.filter(o=>o.name="Employee Photo").length && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>Employee Photo</span></span></div>
                  <div><i className={(data.employmentAgreementSignatureDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>Employment Agreement</span></span></div>
                  <div><i className={(data.cocoaOrientationCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>Cocoa Orientation</span></span></div>
                  <div><i className={(data.qboSetupCompleteDate && data.drugScreenReviewCompleteDate && data.capsCheckCompleteDate && data.criminalBackgroundCheckCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span>Step 6: Post-Hire Due Diligence</span></div>
                  <div><i className={(data.qboSetupCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>QBO Setup</span></span></div>
                  <div><i className={(data.drugScreenReviewCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>Drug Screen</span></span></div>
                  <div><i className={(data.capsCheckCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>CAPS Check</span></span></div>
                  <div><i className={(data.criminalBackgroundCheckCompleteDate && "fa fa-check-circle text-success") || 'fa fa-circle text-secondary'}></i><span><span>Criminal Background Check</span></span></div>
                </div>

                <h6 className="mt-4">Notes</h6>
                <Input type="textarea" name="textarea-input" id="textarea-input" rows="4" placeholder="Notes..." name="summary" onChange={this.handleChangeEvent} value={data.summary} />
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
                {/* < data={artifacts} onRowClick={this.onArtifactSelect} /> */}
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
          <Col xs="12" sm="12" md="6">
            <Card>
              <CardHeader>
                <i className="icon-menu"></i>Schedule and Availability
              </CardHeader>
              <CardBody>
                <ScheduleGraph data={data.availability} onChange={this.handleAvailabilityChange} id="availability" onCall />
                <Label>Availability Notes</Label>
                <Input type='textarea' name="availabilityNotes" value={data.availabilityNotes} placeholder="Availability notes..." onChange={this.handleChangeEvent} />
                <Label>Desired Hours Per Week</Label>
                <Row>
                  <Col xs="6">
                    From: <Input type="number" name="desiredHoursStart" value={data.desiredHoursStart || ''} onChange={this.handleChangeEvent} onWheelCapture={e=>e.target.blur()} />
                  </Col>
                  <Col xs="6">
                    To: <Input type="number" name="desiredHoursEnd" value={data.desiredHoursEnd || ''} onChange={this.handleChangeEvent} onWheelCapture={e=>e.target.blur()} />
                  </Col>
                </Row>
                <Input type="textarea" name="desiredHoursNotes" maxLength="150" value={data.desiredHoursNotes || ''} onChange={this.handleChangeEvent} onWheelCapture={e=>e.target.blur()} placeholder="Note about desired hours?" />
              </CardBody>
            </Card>
          </Col>             
        </Row>
      </div>
    );
  }
}


export default PageJobCandidateDetail

// TODO: Turn the overview into tabs

// TODO: Order the interactions by date desc
// TODO: Add "+" button for interactions
// TODO: Get the user name from session and save with interactions
// TODO: Open interactions in modal window
// TODO: Create availability table
/*


          { "type": "InputBlock", "label": "Status", "id": "disposition", "inputType": "select", "items": [{"label": "New"},{"label": "No Contact"},{"label": "Rejected"},{"label": "Awaiting Orientation"},{"label": "Awaiting In-Person Interview"},{"label": "Qualified/Bench"},{"label": "No Longer Available"}]}, 
          { "type": "InputBlock", "label": "Rejection Reason", "id": "rejectReason", "inputType": "select", "conditionalDisplayKey": "Status", "conditionalDisplayValue": "Rejected", "items": [{"label": "Geography"},{"label": "Criminal History"},{"label": "Language"},{"label": "Personality"},{"label": "Work History"},{"label": "Other"}]}, 
          { "type": "InputBlock", "label": "Rejection Notes", "id": "rejectNotes", "inputType": "textarea", "conditionalDisplayKey": "Status", "conditionalDisplayValue": "Rejected"}, 
        ]},


        { "type": "InputBlock", "label": "Birthdate", "id": "dob", "inputType": "date"},
        // { "type": "Collection", "label": "Other Phones", "collectionType": "modal", "labelKey": "Phone", "items": [
        //   { "type": "InputBlock", "label": "Phone", "inputType": "text"},
        //   { "type": "InputBlock", "label": "Type", "inputType": "select", "items": [{"label": "Mobile"}, {"label": "Home"}]},
        //   { "type": "InputBlock", "label": "Notes", "inputType": "text"},
        // ]}
      ]}, 



Dashboard
  Location/Map
  Skills


***Contact Information (tab)
  Map (box)



***Availability (tab)
  Weekly Schedule
  Desired Hours/Wk
  Availability Notes

Attachments, e.g. resume, video recording



Profile
  Ok with smoke: Yes/No/Don't Know
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
	Overview: status (new, candidates, bench, in progress, rejected), rating, rejection reason, notes, 
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
