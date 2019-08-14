import React, {PureComponent} from 'react'
import {Row, Col, Label, Popover, PopoverBody, Input, FormGroup, Card, CardHeader, CardBody, Table} from 'reactstrap'
import {AppSwitch} from '@coreui/react'

import ScheduleGraph from './ScheduleGraph'
import API from './API'

import CollapsableCardBody from './CollapsableCardBody'

class PagePhoneScreen extends PureComponent {

  constructor(props){

    super(props);

    this.state = {
      openCard: 'Interview'
    }
    
  }

  handleChangeEvent = (event) => {

    let key = event.target.name

    let value

    if (event.target.hasOwnProperty('checked')){

      value = event.target.checked ? event.target.value : null

    } else {

      value = event.target.value

    }

    API.updateEmployee(this.props.match.params.id, {[key]: value})

    let data = Object.assign({}, this.state.data, {[key]: value})

    this.setState({data})

  }

  handleAvailabilityChange = (availability) => {

    let data = Object.assign({}, this.state.data)

    data.availability = Object.assign([], availability)

    API.updateEmployee(this.props.match.params.id, {availability})

    this.setState({data})

  }

  componentWillMount(){

    API.fetchEmployee(this.props.match.params.id)
    .then(res => {

      this.data = JSON.parse(JSON.stringify(res.data))

      this.setState({data: res.data})

    })

  }

  togglePopover = (name) => {

    let key = `popover${name}`

    this.setState({[key]: !this.state[key]})

  }

  render() {

    let data = this.state.data

    if (!data) return (<div></div>)

    let config = {
      questions: [{
        title: `Skills / Competency (self-reported)`,
        name: `generalCompetencyFlag`,
        notesFieldname: 'generalCompetencyNotes',
        talkScript: `Do you feel you are presently qualfiied and experienced in providing care to the elderly and disabled including housekeeping, bathing, brief changes, transfers, dressing, and grooming?`,
        positiveValue: `is qualified`,
        positiveLabel: `Yes`,
        negativeValue: `is not qualified`,
        negativeLabel: `No`,
        policyDescription: `A candidate must be confident with all of the most commonly required technical skills to be eligible to be hired. The most commonly required technical skills are housekeeping, bathing, brief changes, transfers, dressing, and grooming of the elderly and disabled.`
      }, {
        title: `Driver's License`,
        name: `driversLicenseFlag`,
        notesFieldname: 'driversLicenseNotes',
        talkScript: `Do you have a valid driver's license?`,
        positiveValue: `has driver's license`,
        positiveLabel: `Yes`,
        negativeValue: `does not have driver's license`,
        negativeLabel: `No`,
        policyDescription: `A candidate must have a valid driver's license to be eligible to be hired.`
      }, {
        title: `Motor Vehicle Report`,
        name: `dirtyDriversLicenseFlag`,
        notesFieldname: 'dirtyDriversLicense',
        talkScript: `Do you have any history of DUI, DWI, or DWAI in the last 10 years or have any restrictions on your driver's license?`,
        positiveValue: `does not have dirty drivers license`,
        positiveLabel: `No`,
        negativeValue: `has dirty drivers license`,
        negativeLabel: `Yes`,
        policyDescription: `A candidate must not have a DUI, DWI, or DWAI in the last 10 years to be eligible to be hired. A candidate must also not have any restrictions on their driver's license to be eligible to be hired.`
      }, {
        title: `Exclusive Vehicle Use`,
        name: `vehicleOwnershipFlag`,
        notesFieldname: 'vehicleShareNotes',
        talkScript: `Do you own and have exclusive use of your own vehicle?`,
        positiveValue: `has vehicle ownership`,
        positiveLabel: `Yes`,
        negativeValue: `does not have vehicle ownership`,
        negativeLabel: `No`,
        policyDescription: `A candidate must have exclusive use of a vehicle to be eligible to be hired.`
      }, {
        title: `Vehicle Reliability`,
        name: `reliableVehicleStatusFlag`,
        notesFieldname: 'reliableVehicleStatus',
        talkScript: `If we asked your previous employers would they say that you have ever missed a day of work on account of transportation related issues within the last two years?`,
        positiveValue: `has reliable vehicle status`,
        positiveLabel: `No`,
        negativeValue: `has unreliable vehicle status`,
        negativeLabel: `Yes`,
        policyDescription: `A candidate must have a reliable vehicle to be eligible to be hired.`
      }, {
        title: `Criminal History`,
        name: `criminalHistoryFlag`,
        notesFieldname: 'criminalHistory',
        talkScript: `We run a criminal background report on all our employees. Do you have any criminal history to report?`,
        positiveValue: `does not have criminal history`,
        positiveLabel: `No`,
        negativeValue: `has criminal history`,
        negativeLabel: `Yes`,
        policyDescription: `Each and every offense reported in criminal history must be examined and if permissable a written statement is required attesting that there is no reasonable suspicion that the nature of the offense could pose any risk to the customer, other caregivers or the organization. A candidate with indismissable offenses is not eligible to be hired.`
      }, {
        title: `Drug-Free (self-reported)`,
        name: `drugScreenConcernsFlag`,
        notesFieldname: 'drugScreenConcerns',
        talkScript: `We require all our employees to submit to a drug screen at the time of employment and periodically throughout their employment. Do you have any reason to suspect that you will not pass a drug screen including the use of marijuana?`,
        positiveValue: `does not have drug screen concern`,
        positiveLabel: `No`,
        negativeValue: `has drug screen concern`,
        negativeLabel: `Yes`,
        policyDescription: `A candidate must not have concern with passing a drug screen including the use of marijuana, even with a medical marijuana card to be eligible to be hired.`
      }, {
        title: `Smart Phone`,
        name: `smartPhoneFlag`,
        notesFieldname: 'smartPhoneNotes',
        talkScript: `Do you own a smartphone? Are you able to use it to proficiently send and receive text messages and also view websites through a mobile browser and fill out an online form?`,
        positiveValue: `has smart phone`,
        positiveLabel: `Yes`,
        negativeValue: `does not have smart phone`,
        negativeLabel: `No`,
        policyDescription: `A candidate must have a smart phone to be eligible to be hired.`
      }, {
        title: `Phone Service Stability`,
        name: `phoneServiceReliability`,
        notesFieldname: 'phoneServiceReliabilityNotes',
        talkScript: `Has your phone been disconnected or out of service any time in the last five years?`,
        positiveValue: `has reliable phone service`,
        positiveLabel: `No`,
        negativeValue: `has unreliable phone service`,
        negativeLabel: `Yes`,
        policyDescription: `A candidate must have stable phone service to be eligible to be hired. If a candidate has had their phone service disconnected within the last five years then they are not eligible to be hired.`
      }, {
        title: `Lifting`,
        name: `heavyLiftingConcernsFlag`,
        notesFieldname: 'notesFieldName',
        talkScript: `Do you have any medical conditions that would prevent you from lifting up to 50 lbs?`,
        positiveValue: `does not have lifting restriction`,
        positiveLabel: `No`,
        negativeValue: `has lifting restriction`,
        negativeLabel: `Yes`,
        policyDescription: `A candidate must be able to lift up to 50 lbs to be eligible to be hired.`
      }, {
        title: `Continuous Work History`,
        name: `continuousWorkHistoryFlag`,
        notesFieldname: 'continuousWorkHistoryNotes',
        talkScript: `We verify employment history before we ever extend a job offer. Do you have continuous employment for the last four years? When you had breaks in between jobs was each break less than 30 days?`,
        positiveValue: `has continuous work history`,
        positiveLabel: `Yes`,
        negativeValue: `does not have continuous work history`,
        negativeLabel: `No`,
        policyDescription: `A candidate must have four years of continuous, verifiable employment to be eligible to be hired. Self-employment or working for personal relatives may not be counted toward the period of continuous work history. Any period of unemployment lasting 30 days or more is considered a break/gap in continuous employment.`
      }, {
        title: `Professional Reputation`,
        name: `professionalReputationFlag`,
        notesFieldname: 'professionalReputationNotes',
        talkScript: `Are you on good terms with all your previous employers over the last four years? Did you maintain a positive relationship with each and every one of them and provide them adequate notice before leaving?`,
        positiveValue: `has good professional reputation`,
        positiveLabel: `Yes`,
        negativeValue: `does not have good professional reputation`,
        negativeLabel: `No`,
        policyDescription: `A candidate must be on good terms with previous employers over the last four years to be eligible to be hired.`
      }, {
        title: `Language Proficiency`,
        name: `languageProficiencyFlag`,
        notesFieldname: 'languageProficiencyNotes',
        description: `Was the candidate easy to understand with respect to volume, accent, and properly composed English sentences? Did the candidate also comprehend you the interviewer with ease?`,
        positiveValue: `is proficient in english`,
        positiveLabel: `Yes`,
        negativeValue: `is not proficient in english`,
        negativeLabel: `No`,
        policyDescription: `A candidate must be easy to understand`
      }, {
        title: `Professional Communication`,
        name: `professionalCommunicationFlag`,
        notesFieldname: 'professionalCommunicationNotes',
        description: `Did the candidate speak clearly and succinctly? Did the candidate speak respectfully? Was the candidate's manner of speech generally positively-oriented?`,
        positiveValue: `communicates professionally`,
        positiveLabel: `Yes`,
        negativeValue: `does not communicate professionally`,
        negativeLabel: `No`,
      }]
    }

    let eligibilityFailures = config.questions.filter(q => data[q.name] !== q.positiveValue)

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <h1>{data.firstName + ' ' + data.lastName}</h1>

            <Card>
              <CardHeader >
                <h4 className="text-uppercase m-0 p-0">Instructions</h4>
              </CardHeader>
              <CardBody>
                <div className="font-italic">OBJECTIVE: The objective of the phone screen is NOT to gather all information neccessary to make a final hiring decision. The objective is to eliminate some candidates based on information that is easily obtained over the phone and to prepare the remaining candidate for an in-person interview. </div>
                <div className="font-italic">PROCEDURE: The specific phone screen questions should be asked exactly as they are worded. Phone screens must be limited to 15 minutes. <span className="text-warning">Follow the colored prompts below.</span></div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => {this.setState({openCard: 'Interview'})}}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Interview</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Interview'}>
                <h5 className="text-warning">"Hi! My name is &lt;your name&gt; from Atlantis Home Care. I'm reaching out to because you applied to work for our company and I think you might be a good fit for the position. Do you have a few minutes to talk? "</h5>
                <h5 className="text-warning">"Can you start by telling me a little bit about yourself?"</h5>
                <Row className="mb-4">
                  <Col xs="12" md="6" xl="4">
                    <Label>First Name</Label>
                    <Input type='text' name="firstName" value={data.firstName} placeholder="Enter first name" onChange={this.handleChangeEvent} />
                  </Col>
                  <Col xs="12" md="6" xl="4">
                    <Label>Last Name</Label>
                    <Input type='text' name="lastName" value={data.lastName} placeholder="Enter last name" onChange={this.handleChangeEvent} />
                  </Col>
                  <Col xs="12" md="6" xl="4">
                    <Label>Phone</Label>
                    <Input type='text' name="phone" value={data.phone} placeholder="Enter phone" onChange={this.handleChangeEvent} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" xl="4">
                    <Card className="">
                      <CardHeader>
                        <Label className="mb-0">Personal Notes</Label>
                      </CardHeader>
                      <CardBody >
                        <Input type='textarea' name="personalNotes" value={data.personalNotes} placeholder="Personal notes..." onChange={this.handleChangeEvent} rows="5"/>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xs="12" xl="4">
                    <Card className="">
                      <CardHeader>
                        <Label className="mb-0">Professional Experience</Label>
                      </CardHeader>
                      <CardBody>
                        <Input type='textarea' name="experienceNotes" value={data.experienceNotes} placeholder="Professional experience..." onChange={this.handleChangeEvent} rows="5" />
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xs="12" xl="4">
                    <Card className="">
                      <CardHeader>
                        <Label className="mb-0">Availability Notes</Label>
                      </CardHeader>
                      <CardBody>
                        <Input type='textarea' name="availabilityNotes" value={data.availabilityNotes} placeholder="Availability notes..." onChange={this.handleChangeEvent} rows="5" />
                      </CardBody>
                    </Card>
                  </Col>
                  <Col>
                    <Card className="">
                      <CardHeader>
                        <Label className="mb-0">Other Notes</Label>
                      </CardHeader>
                      <CardBody>
                        <h5>
                          <div className="text-warning">Tell me briefly about a positive experience you've had caring for others.</div>
                          <div className="text-warning">Where would you like to be in your career five years from now?</div>
                          <div className="text-warning">Why are you leaving your current job?</div>
                          <div className="text-warning">Tell me what you know about the role.</div>
                          <div className="text-warning">Which job in your past was the job that you stayed at longer than any other job?</div>
                        </h5>
                        <Input type='textarea' name="otherNotes" value={data.otherNotes} placeholder="Other notes..." onChange={this.handleChangeEvent} rows="5" />                         
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </CollapsableCardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => this.setState({openCard: 'Contact Information'})}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Contact Information</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Contact Information'}>
                <h5 className="text-warning">"Great. Thank you for that. I've got some other questions to ask you. But first, before we go any further I want to make sure I've got your contact information correct. &lt;ask for missing information &gt;"</h5>
                <Row>
                  <Col xl="4">
                    <Label>First Name</Label>
                    <Input type='text' name="firstName" value={data.firstName || ''} placeholder="Enter first name" onChange={this.handleChangeEvent} />
                  </Col>
                  <Col xl="4">
                    <Label>Last Name</Label>
                    <Input type='text' name="lastName" value={data.lastName || ''} placeholder="Enter last name" onChange={this.handleChangeEvent} />
                  </Col>
                  <Col xl="4">
                    <Label>Phone</Label>
                    <Input type='text' name="phone" value={data.phone || ''} placeholder="Enter phone" onChange={this.handleChangeEvent} />
                  </Col>
                  <Col xl="8">
                    <Label>Address</Label>
                    <Input type='text' name="address" value={data.address || ''} placeholder="Enter address" onChange={this.handleChangeEvent} />
                    <FormGroup row className="my-0">
                      <Col xs="12" lg="6">
                        <Label>City</Label>
                        <Input type='text' name="city" value={data.city || ''} placeholder="Enter city" onChange={this.handleChangeEvent} />
                      </Col>
                      <Col xs="12" lg="3">
                        <Label>State</Label>
                        <Input type='text' name="state" value={data.state || ''} placeholder="Enter state" onChange={this.handleChangeEvent} />
                      </Col>
                      <Col xs="12" lg="3">
                        <Label>Postal Code</Label>
                        <Input type='text' name="zip" value={data.zip || ''} placeholder="Enter postal code" onChange={this.handleChangeEvent} />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xl="4">
                    <Label>Email</Label>
                    <Input type='text' name="email" value={data.email || ''} placeholder="Enter email" onChange={this.handleChangeEvent} />
                  </Col>
                </Row>
              </CollapsableCardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => {this.setState({openCard: 'Employment Eligibility'})}}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Employment Eligibility</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Employment Eligibility'}>
                <h5 className="text-warning">"I have a few basic questions for you related to your eligibility."</h5>
                <Table striped={true} hover className="employmentEligibilityTable">
                  <tbody>
                    {config.questions.map((item, i) => (
                      <tr key={i} className="pb-4">
                        <td width="20px">#{i+1}</td>
                        <td className="min-w-400">
                          <h6>{item.title}</h6>
                          {item.talkScript && (<h5 className="text-warning">{item.talkScript || item.description}</h5>)}
                          {item.description && (<div>{item.description}</div>)}
                        </td>
                        <td width="100px" className="text-center">
                          <div>{item.positiveLabel}</div>
                          <AppSwitch variant='pill' outline='alt' dataOn={'\u2713'} dataOff={'\u2715'} color="success" label checked={data[item.name] === item.positiveValue} name={item.name} value={item.positiveValue} onChange={this.handleChangeEvent} />
                        </td>
                        <td width="100px" className="text-center">
                          <div>{item.negativeLabel}</div>
                          <AppSwitch variant='pill' outline='alt' dataOn={'\u2713'} dataOff={'\u2715'} color="danger" label checked={data[item.name] === item.negativeValue} name={item.name} value={item.negativeValue} onChange={this.handleChangeEvent} />
                        </td>
                        <td width="400px">
                          <Input type="textarea" name={item.notesFieldname} value={data[item.notesFieldname]} onChange={this.handleChangeEvent} placeholder="Please explain..." rows="4" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CollapsableCardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => this.setState({openCard: 'Schedule and Availability'})}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Schedule and Availability</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Schedule and Availability'} >
                <Row>
                  <Col lg="10" xl="8">
                    <h5 className="text-warning">Now let's talk about your availability. What days are you available to work?</h5>
                    <Label>Mark "green" the times available to work.</Label>
                    <ScheduleGraph data={data.availability} onChange={this.handleAvailabilityChange} id="availability" onCall />
                    <Label>Availability Notes</Label>
                    <div>
                      <h5 className="text-warning">What do you do during the time that you are not available? <i className="fa fa-info-circle pointer" onClick={() => this.togglePopover('availabilityNotes')} id="popoveravailabilityNotes"></i></h5>
                      <Popover placement="auto" target="popoveravailabilityNotes" isOpen={this.state.popoveravailabilityNotes} toggle={() => this.togglePopover('availabilityNotes')} >
                        <PopoverBody>
                          It is important to know how negotiable a person's unavailable time may be so that we can offer them the greatest opportunity to meet their scheduling expectations.
                        </PopoverBody>
                      </Popover>
                    </div>
                    <Input type='textarea' name="availabilityNotes" value={data.availabilityNotes} placeholder="Availability notes..." onChange={this.handleChangeEvent} />
                    <Label>Desired Hours Per Week</Label>
                    <h5 className="text-warning">How many hours do you want to be working each week?</h5>
                    <Row>
                      <Col xs="6">
                        From: <Input type="number" name="desiredHoursStart" value={data.desiredHoursStart || ''} onChange={this.handleChangeEvent} onWheelCapture={e=>e.target.blur()} />
                      </Col>
                      <Col xs="6">
                        To: <Input type="number" name="desiredHoursEnd" value={data.desiredHoursEnd || ''} onChange={this.handleChangeEvent} onWheelCapture={e=>e.target.blur()} />
                      </Col>
                    </Row>
                    <Input type="textarea" name="desiredHoursNotes" maxLength="150" value={data.desiredHoursNotes || ''} onChange={this.handleChangeEvent} onWheelCapture={e=>e.target.blur()} placeholder="Note about desired hours?" />
                  </Col>
                </Row>
                <Label>Start Date</Label>
                <h5 className="text-warning">If we extended an offer to you when could you start?</h5>
                <Row>
                  <Col xl="3" md="6">
                    <Input type="date" name="desiredStartDate" value={data.desiredStartDate || ''} onChange={this.handleChangeEvent} />
                  </Col>
                </Row>
              </CollapsableCardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => this.setState({openCard: 'Evaluation'})}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Evaluation</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Evaluation'}>
                {eligibilityFailures.length > 0 && (
                  <div>
                    <h4 className="text-danger">This candidate is not eligible to be hired for the following reasons:</h4>
                    <ul>
                      {eligibilityFailures.map((q,i) => (
                        <li key={i}>{q.title}: {!data[q.name] && 'Did not answer.'}{data[q.name] && (
                          <div>
                            <h3 className="text-danger">{data[q.name]}; {data[q.notesFieldname] && (<span>"{data[q.notesFieldname]}"</span>)}</h3>
                            <span>{q.policyDescription && (
                              <div>Associated Policy: <span className="font-italic">{q.policyDescription}</span></div>
                            )}</span>
                          </div>

                          
                          
                        )}</li>
                      ))}
                    </ul>
                    <div>
                      <h5 className="text-warning">"Excellent. That's all the questions I have for you now. Thanks for taking some time to talk with me today. We'll review this and if we decide to move forward with an in-person interview then we'll give you a call back shortly. Do you have any questions for me before we close up today?"</h5>
                    </div>
                  </div>
                )}

                {eligibilityFailures.length === 0 && (
                  <div>
                    <h5 className="text-success">This candidate is eligibile to be hired!</h5>
                    <h5 className="text-warning">"Excellent. You sound like a great fit for our company. Would you be available to come in for an in-person interview tomorrow at &lt;choose a convenient time&gt;?"</h5>
                  </div>
                )}

                <Label>Phone Screen Date</Label>
                <Row>
                  <Col xl="2" md="4">
                    <Input type="date" name="phoneScreenDate" value={data.phoneScreenDate} onChange={this.handleChangeEvent} />
                  </Col>
                </Row>
              </CollapsableCardBody>
            </Card> 

          </Col>
        </Row>
      </div>
    )

  }

}

export default PagePhoneScreen
