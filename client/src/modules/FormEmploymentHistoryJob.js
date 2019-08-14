// TODO: Set the default state to CO
// TODO: Improve performance. The entire component is rendered again with each keystroke. Probably need to break into smaller components/purecomponents. Or else only rerender the component when the "id" of the component changes, or when "endMonth" changes because that will disable another field.

import React, {Component} from 'react'
import {FormGroup, Row, Label, Input, Col, Table} from 'reactstrap'
import {AppSwitch} from '@coreui/react'

let currentYear = (new Date()).getFullYear()

let yearOptions = Array.apply(null, {length: 10}).map((o, i) => (
  <option key={i} defaultValue={currentYear - (9 - i)}>{currentYear - (9 - i)}</option>
))

class FormEmploymentHistoryJob extends Component {

  handleChange(key, value){

    if (this.props.onChange) this.props.onChange(data => {

      data[key] = value

    })

  }

  shouldComponentUpdate(props, state){

    return JSON.stringify(props) !== JSON.stringify(this.props)

  }

  render(){

    let data = this.props.data

    return (
      <div>
        <Row>
          <Col md="2">
            <FormGroup>
              <Label htmlFor="startMonth">Month</Label>
              <Input type="select" name="startMonth" id="startMonth" defaultValue={data.startMonth || ''} onChange={event => this.handleChange(event.target.name, event.target.value)}>
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
              <Input type="select" name="startYear" id="startYear" defaultValue={data.startYear || ''} onChange={event => this.handleChange(event.target.name, event.target.value)}>
                <option></option>
                {yearOptions}
              </Input>
            </FormGroup>
          </Col>

          <Col md="2">
            <FormGroup>
              <Label htmlFor="endMonth">Month</Label>
              <Input type="select" name="endMonth" id="endMonth" defaultValue={data.endMonth || ''} onChange={event => this.handleChange(event.target.name, event.target.value)}>
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
              <Input type="select" name="endYear" id="endYear" value={data.endYear || ''} onChange={event => this.handleChange(event.target.name, event.target.value)} disabled={this.props.data.endMonth === 'Present'} >
                <option></option>
                {yearOptions}
              </Input>
            </FormGroup>
          </Col>
          
          <Col md="4">
            <FormGroup>
              <Label>Company Name</Label>
              <Input type="text" placeholder="Company name..." defaultValue={data.companyName || ''} name="companyName" onChange={(event) => this.handleChange(event.target.name, event.target.value)} />
            </FormGroup>
          </Col>

          <Col md="2">
            <FormGroup>
              <Label>City</Label>
              <Input type="text" placeholder="City..." name="jobCity" defaultValue={data.jobCity || ''} onChange={event => this.handleChange(event.target.name, event.target.value)} /> 
            </FormGroup>
          </Col>

          <Col md="2">
            <FormGroup>
              <Label>State</Label>
              <Input type="select" name="jobState" defaultValue={data.jobState || ''} onChange={event => this.handleChange(event.target.name, event.target.value)} >
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
              <Input type="text" placeholder="Pay rate..." name="payRate" defaultValue={data.payRate || ''} onChange={event => this.handleChange(event.target.name, event.target.value)} />
            </FormGroup>
          </Col>

          <Col md="2">
            <FormGroup>
              <Label>Work Hours</Label>
              <Input type="text" placeholder="Hours per week..." name="hoursPerWeek" defaultValue={data.hoursPerWeek || ''} onChange={event => this.handleChange(event.target.name, event.target.value)} />
            </FormGroup>
          </Col>

          <Col md="4">
            <FormGroup>
              <Label>Job Title</Label>
              <Input type="text" placeholder="Job title..." name="jobTitle" defaultValue={data.jobTitle || ''} onChange={event => this.handleChange(event.target.name, event.target.value)} />
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label>"What was your reason for leaving?"</Label>
              <Input type="textarea" rows="2" placeholder="Reason for leaving..." name="reasonForLeaving" defaultValue={data.reasonForLeaving || ''} onChange={event => this.handleChange(event.target.name, event.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>"We check references on all places of employment over the last 4 years. Who would you prefer we contact at this company?"</Label>
              <Input type="text" placeholder="Reference name..." name="referenceName" defaultValue={data.referenceName || ''} onChange={event => this.handleChange(event.target.name, event.target.value)} />
            </FormGroup>
            <Label>Favorable Terms</Label>
            <Table size="sm">
              <tbody>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="twoWeeksNoticeFlag" checked={data.twoWeeksNoticeFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>Did you give two weeks notice when you left this job?</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="rehireEligibilityFlag" checked={data.rehireEligibilityFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>Are you eligible to be rehired?</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="goodTermsFlag" checked={data.goodTermsFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
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
                  <td><AppSwitch className={'mx-1 switch-sm'} name="assistedLivingFlag" checked={data.assistedLivingFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>Assisted Living</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="skilledNursingFlag" checked={data.skilledNursingFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>Skilled Nursing (SNF)</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="groupHomeFlag" checked={data.groupHomeFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>Group Home</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="homeCareFlag" checked={data.homeCareFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>Non-Medical Home Care</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="homeHealthFlag" checked={data.homeHealthFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>Medical Home Care</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="privateClientFlag" checked={data.privateClientFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>Private Home Care Client</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="hospitalFlag" checked={data.hospitalFlag || false} onChange={event => this.handleChange(event.target.name, event.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>Hospital</td>
                </tr>
              </tbody>
            </Table>
          </Col>

        </Row>
      </div>
    )

  }

}

export default FormEmploymentHistoryJob
