import React, {PureComponent} from 'react';
import {Row, Col, Label, Button, Input, FormGroup, Card, CardHeader, CardBody, Table} from 'reactstrap'
import {AppSwitch} from '@coreui/react'

import API from './API'
import ScheduleGraph from './ScheduleGraph'
import CollapsableCardBody from './CollapsableCardBody'

let currentYear = (new Date()).getFullYear()

let yearOptions = Array.apply(null, {length: 10}).map((o, i) => (
  <option key={i} defaultValue={currentYear - (9 - i)}>{currentYear - (9 - i)}</option>
))

let jobSort = (a, b) => {
  return parseInt(a.startYear) - parseInt(b.startYear)
  || parseInt(a.startMonth) - parseInt(b.startMonth)
  || parseInt(a.endYear) - parseInt(b.endYear)
  || parseInt(a.endMonth) - parseInt(b.endMonth)
}

let getPeriodInformation = (item) => {

  let startMonth = item.startMonth, 
      startYear = item.startYear, 
      endMonth = item.endMonth, 
      endYear = item.endYear

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

class PageJobCandidateApplication extends PureComponent {

  constructor(props){

    super(props);

    this.state = {
      openCard: 'Employment History'
    }
    
  }

  // constructor(props){

  //   super(props)

  //   this.state = {
  //     data: [],
  //   }

  //   this.data = {}

  //   this.handleEmploymentHistoryUpdate = this.handleEmploymentHistoryUpdate.bind(this)

  //   this.handleEducationUpdate = this.handleEducationUpdate.bind(this)

  //   this.handleUpdate = this.handleUpdate.bind(this)

  // }

  // handleUpdate(fn){

  //   let info = fn(this.data)

  //   console.log('info', info)

  //   this.props.updateJobCandidate(this.props.match.params.id, this.data)

  // }
  
  // handleEmploymentHistoryUpdate(fn){
    
  //   this.handleUpdate((data) => {

  //     if (!data.employmentHistory) data.employmentHistory = {}

  //     fn(data.employmentHistory)

  //   })

  // }

  // handleEducationUpdate(fn){

  //   this.handleUpdate((data) => {

  //     fn(data.education)

  //   })

  // }

  // componentWillMount(){

  //   API.fetchEmployee(this.props.match.params.id)
  //   .then(res => {

  //     let data = res.data

  //     this.data = JSON.parse(JSON.stringify(data))

  //     this.setState({data})

  //   })

  // }


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

  handleEmploymentHistoryChange = (event, item) => {

    let employmentHistoryKey = Object.keys(this.state.data.employmentHistory).find(k => this.state.data.employmentHistory[k] === item)

    let key = event.target.name

    let value

    if (event.target.hasOwnProperty('checked')){

      value = event.target.checked ? (event.target.hasOwnProperty('value') ? event.target.value : true) : null

    } else {

      value = event.target.value

    }

    let data = Object.assign({}, this.state.data)

    data.employmentHistory = Object.assign({}, data.employmentHistory)

    data.employmentHistory[employmentHistoryKey][key] = value

    API.updateEmployee(this.props.match.params.id, {employmentHistory: data.employmentHistory})

    this.setState({data})

  }

  handleAvailabilityChange = (availability) => {

    let data = Object.assign({}, this.state.data)

    data.availability = Object.assign([], availability)

    API.updateEmployee(this.props.match.params.id, {availability})

    this.setState({data})

  }

  handleClickAddWorkHistory = (e) => {

    let data = Object.assign({}, this.state.data)

    let employmentHistory = Object.assign({}, this.state.data.employmentHistory)

    employmentHistory[new Date().toJSON()] = {}

    API.updateEmployee(this.props.match.params.id, {employmentHistory})

    this.setState({data})

  }

  componentWillMount(){

    API.fetchEmployee(this.props.match.params.id)
    .then(res => {

      this.data = JSON.parse(JSON.stringify(res.data))

      this.setState({data: res.data})

    })

  }
  
  capture = () => {
    // const imageSrc = this.webcam.getScreenshot();
    
	let imageSrc =
      "data:image/png;base64,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";
	API.uploadCapturedPhoto(1, imageSrc).then(res => {
      let base64Data = JSON.parse(JSON.stringify(res.data));
	  console.log(base64Data);
    });;
  };

  render() {

    let data = this.state.data || {}

    let employmentHistory = (data.employmentHistory && Object.values(data.employmentHistory)) || []

    employmentHistory = employmentHistory.sort(jobSort)

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
                <div className="font-italic">Please complete all questions. Ask for help if you get stuck. </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => this.setState({openCard: 'Contact Information'})}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Contact Information</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Contact Information'}>
                <h5 className="text-warning">Please enter your contact information below. Some of this information may already be entered. If so, please double-check what is already there.</h5>
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
              <CardHeader className="pointer" onClick={() => {this.setState({openCard: 'Employment History'})}}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Employment History</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Employment History'}>
                <div>
                  { employmentHistory.length > 0 && 
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
                      {employmentHistory.map((item, i) => {

                        return (
                          <tbody key={i}>
                            <tr onClick={() => this.setState({openJob: item})} className="pointer text-uppercase btn-warning" >
                              <td className="text-center">{this.props.id}</td>
                              <td className="text-center">{getPeriodInformation(item).start || '?'}</td>
                              <td className="text-center">{getPeriodInformation(item).end || '?'}</td>
                              <td className="text-center">{getPeriodInformation(item).duration || '?'}</td>
                              <td>{item.companyName || '?'}</td>
                              <td>{item.jobTitle || '?'}</td>
                              <td>{item.hoursPerWeek || '?'}</td>
                              <td>{item.payRate || '?'}</td>
                              <td className="text-right"><Button size="sm" onClick={this.props.onDelete}><i className="fa fa-trash"></i></Button></td>
                            </tr>
                            {/* <Collapse tag="tr" isOpen={this.props.isOpen} className={{hidden: true}}> */}
                            <tr className={(!this.state.openJob && i === 0) || this.state.openJob === item ? '' : ' d-none'}>
                              <td></td>
                              <td colSpan="8">
                                <div>
                                  <Row>
                                    <Col md="2">
                                      <FormGroup>
                                        <Label htmlFor="startMonth">Month</Label>
                                        <Input type="select" name="startMonth" id="startMonth" defaultValue={item.startMonth || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)}>
                                          <option></option>
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                          <option value="6">6</option>
                                          <option value="7">7</option>
                                          <option value="8">8</option>
                                          <option value="9">9</option>
                                          <option value="10">10</option>
                                          <option value="11">11</option>
                                          <option value="12">12</option>
                                        </Input>
                                      </FormGroup>
                                    </Col>

                                    <Col md="2">
                                      <FormGroup>
                                        <Label htmlFor="startYear">Year</Label>
                                        <Input type="select" name="startYear" id="startYear" defaultValue={item.startYear || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)}>
                                          <option></option>
                                          {yearOptions}
                                        </Input>
                                      </FormGroup>
                                    </Col>

                                    <Col md="2">
                                      <FormGroup>
                                        <Label htmlFor="endMonth">Month</Label>
                                        <Input type="select" name="endMonth" id="endMonth" defaultValue={item.endMonth || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)}>
                                          <option></option>
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                          <option value="6">6</option>
                                          <option value="7">7</option>
                                          <option value="8">8</option>
                                          <option value="9">9</option>
                                          <option value="10">10</option>
                                          <option value="11">11</option>
                                          <option value="12">12</option>
                                          <option>Present</option>
                                        </Input>
                                      </FormGroup>
                                    </Col>

                                    <Col md="2">
                                      <FormGroup>
                                        <Label htmlFor="endYear">Year</Label>
                                        <Input type="select" name="endYear" id="endYear" value={item.endYear || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} disabled={item.endMonth === 'Present'} >
                                          <option></option>
                                          {yearOptions}
                                        </Input>
                                      </FormGroup>
                                    </Col>
                                    
                                    <Col md="4">
                                      <FormGroup>
                                        <Label>Company Name</Label>
                                        <Input type="text" placeholder="Company name..." defaultValue={item.companyName || ''} name="companyName" onChange={(e) => this.handleEmploymentHistoryChange(e, item)} />
                                      </FormGroup>
                                    </Col>

                                    <Col md="2">
                                      <FormGroup>
                                        <Label>City</Label>
                                        <Input type="text" placeholder="City..." name="jobCity" defaultValue={item.jobCity || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} /> 
                                      </FormGroup>
                                    </Col>

                                    <Col md="2">
                                      <FormGroup>
                                        <Label>State</Label>
                                        <Input type="select" name="jobState" defaultValue={item.jobState || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} >
                                          <option value="AL">AL</option>
                                          <option value="AK">AK</option>
                                          <option value="AR">AR</option>	
                                          <option value="AZ">AZ</option>
                                          <option value="CA">CA</option>
                                          <option value="CO">CO</option>
                                          <option value="CT">CT</option>
                                          <option value="DC">DC</option>
                                          <option value="DE">DE</option>
                                          <option value="FL">FL</option>
                                          <option value="GA">GA</option>
                                          <option value="HI">HI</option>
                                          <option value="IA">IA</option>	
                                          <option value="ID">ID</option>
                                          <option value="IL">IL</option>
                                          <option value="IN">IN</option>
                                          <option value="KS">KS</option>
                                          <option value="KY">KY</option>
                                          <option value="LA">LA</option>
                                          <option value="MA">MA</option>
                                          <option value="MD">MD</option>
                                          <option value="ME">ME</option>
                                          <option value="MI">MI</option>
                                          <option value="MN">MN</option>
                                          <option value="MO">MO</option>	
                                          <option value="MS">MS</option>
                                          <option value="MT">MT</option>
                                          <option value="NC">NC</option>	
                                          <option value="NE">NE</option>
                                          <option value="NH">NH</option>
                                          <option value="NJ">NJ</option>
                                          <option value="NM">NM</option>			
                                          <option value="NV">NV</option>
                                          <option value="NY">NY</option>
                                          <option value="ND">ND</option>
                                          <option value="OH">OH</option>
                                          <option value="OK">OK</option>
                                          <option value="OR">OR</option>
                                          <option value="PA">PA</option>
                                          <option value="RI">RI</option>
                                          <option value="SC">SC</option>
                                          <option value="SD">SD</option>
                                          <option value="TN">TN</option>
                                          <option value="TX">TX</option>
                                          <option value="UT">UT</option>
                                          <option value="VT">VT</option>
                                          <option value="VA">VA</option>
                                          <option value="WA">WA</option>
                                          <option value="WI">WI</option>	
                                          <option value="WV">WV</option>
                                          <option value="WY">WY</option>
                                        </Input>			              
                                      </FormGroup>
                                    </Col>

                                    <Col md="2">
                                      <FormGroup>
                                        <Label>Pay Rate</Label>
                                        <Input type="text" placeholder="Pay rate..." name="payRate" defaultValue={item.payRate || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} />
                                      </FormGroup>
                                    </Col>

                                    <Col md="2">
                                      <FormGroup>
                                        <Label>Work Hours</Label>
                                        <Input type="text" placeholder="Hours per week..." name="hoursPerWeek" defaultValue={item.hoursPerWeek || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} />
                                      </FormGroup>
                                    </Col>

                                    <Col md="4">
                                      <FormGroup>
                                        <Label>Job Title</Label>
                                        <Input type="text" placeholder="Job title..." name="jobTitle" defaultValue={item.jobTitle || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} />
                                      </FormGroup>
                                    </Col>

                                    <Col md="6">
                                      <FormGroup>
                                        <Label>"What was your reason for leaving?"</Label>
                                        <Input type="textarea" rows="2" placeholder="Reason for leaving..." name="reasonForLeaving" defaultValue={item.reasonForLeaving || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} />
                                      </FormGroup>
                                      <FormGroup>
                                        <Label>"We check references on all places of employment over the last 4 years. Who would you prefer we contact at this company?"</Label>
                                        <Input type="text" placeholder="Reference name..." name="referenceName" defaultValue={item.referenceName || ''} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} />
                                      </FormGroup>
                                      <Label>Favorable Terms</Label>
                                      <Table size="sm">
                                        <tbody>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="twoWeeksNoticeFlag" checked={item.twoWeeksNoticeFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Did you give two weeks notice when you left this job?</td>
                                          </tr>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="rehireEligibilityFlag" checked={item.rehireEligibilityFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Are you eligible to be rehired?</td>
                                          </tr>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="goodTermsFlag" checked={item.goodTermsFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Are you on good terms with the employer?</td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </Col>

                                    <Col md="6">
                                      <Label>Company Type</Label>
                                      <Table size="sm">
                                        <tbody>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="assistedLivingFlag" checked={item.assistedLivingFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Assisted Living</td>
                                          </tr>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="skilledNursingFlag" checked={item.skilledNursingFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Skilled Nursing (SNF)</td>
                                          </tr>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="groupHomeFlag" checked={item.groupHomeFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Group Home</td>
                                          </tr>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="homeCareFlag" checked={item.homeCareFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Non-Medical Home Care</td>
                                          </tr>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="homeHealthFlag" checked={item.homeHealthFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Medical Home Care</td>
                                          </tr>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="privateClientFlag" checked={item.privateClientFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Private Home Care Client</td>
                                          </tr>
                                          <tr>
                                            <td><AppSwitch className={'mx-1 switch-sm'} name="hospitalFlag" checked={item.hospitalFlag || false} onChange={(e) => this.handleEmploymentHistoryChange(e, item)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                                            <td>Hospital</td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </Col>

                                  </Row>
                                </div>

                              </td>
                            </tr>
                            {/* </Collapse> */}
                          </tbody>
                        )
                      })}
                    </Table>
                  }

                  <div className="text-center">
                    <Button onClick={this.handleClickAddWorkHistory} color="primary">Add Work History</Button>
                  </div>

                </div>
              </CollapsableCardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => {this.setState({openCard: 'Education / Certification'})}}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Education / Certification</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Education / Certification'}>
                {/* <FormJobCandidateEducation {...data.education} onUpdate={this.handleEducationUpdate} /> */}
                Content
              </CollapsableCardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => {this.setState({openCard: 'Employment Preferences'})}}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Employment Preferences</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Employment Preferences'}>
                {/* <FormEmploymentPreferences data={data} onUpdate={this.handleUpdate} /> */}
                Content
              </CollapsableCardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => {this.setState({openCard: 'Profile'})}}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Profile</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Profile'}>
                {/* <FormJobCandidateProfile data={data} onUpdate={this.handleUpdate} /> */}
                Content
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
                      <h5 className="text-warning">What do you do during the time that you are not available?</h5>
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
              <CardHeader className="pointer" onClick={() => {this.setState({openCard: 'Candidate Photo'})}}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Candidate Photo</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Candidate Photo'}>
                <button onClick={this.capture}>Capture photo</button>
              </CollapsableCardBody>
            </Card>

            <Card>
              <CardHeader className="pointer" onClick={() => {this.setState({openCard: 'Signature'})}}>
                <h4 className="text-primary text-uppercase m-0 p-0" >Signature</h4>
              </CardHeader>
              <CollapsableCardBody isOpen={this.state.openCard === 'Signature'}>
                Content
              </CollapsableCardBody>
            </Card>

          </Col>
        </Row>
      </div>

    )

  }

}

export default PageJobCandidateApplication