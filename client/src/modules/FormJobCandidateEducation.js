import React, {Component} from 'react'
import {Label, FormGroup, Input, Row, Col} from 'reactstrap'
import {AppSwitch} from '@coreui/react'

class FormJobCandidateEducation extends Component {

  constructor(props){

    super(props)

    this.handleChangeEvent = this.handleChangeEvent.bind(this)

  }

  handleChangeEvent(event){

    let key = event.target.name

    let value = event.target.hasOwnProperty('checked') ? event.target.checked : event.target.value

    if (this.props.onChange) this.props.onChange(data => {

      data[key] = value

    })

  }

  shouldComponentUpdate(props, state){

    return JSON.stringify(this.props) !== JSON.stringify(props)

  }

  render(){

    let data = this.props.data

    if (!data) return (<div></div>)

    return (

      <div>
        
        <div>
          <Label>Education</Label>
          <Row>
          <Col lg="3">
              <FormGroup>
                <Label>Name</Label>
                <Input type="text" placeholder="Name" name="name" defaultValue="" onChange={this.handleChangeEvent} />
              </FormGroup>
            </Col>
            <Col lg="3">
              <FormGroup>
                <Label>City</Label>
                <Input type="text" placeholder="City" name="city" defaultValue="" onChange={this.handleChangeEvent} />
              </FormGroup>
            </Col>
            <Col lg="2">
              <FormGroup>
                <Label>State</Label>
                <Input type="text" placeholder="State" name="state" defaultValue="" onChange={this.handleChangeEvent} />
              </FormGroup>
            </Col>
            <Col lg="1" className="text-center">
              <FormGroup>
                <div><Label>Graduated</Label></div>
                <AppSwitch className={'mx-1 switch-sm'} name="graduated" checked={data.graduated || false} onChange={this.handleChangeEvent} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} />
              </FormGroup>
            </Col>
            <Col lg="2">
              <FormGroup>
                <Label>Year</Label>
                <Input type="text" placeholder="Year" name="year" defaultValue="" onChange={this.handleChangeEvent} />
              </FormGroup>
            </Col>

          </Row>
          High School: Name, City, State, Graduated (Yes/No/GED)
          College/University
            n: 
              Name, City, State, Degree/Area of Study, Number of years attended, graduated
          Other Education
            n: Name, City, State, Degree/Area of Study, Number of years attended, graduated

        </div>

        <div>
          <Label>Certifications</Label>
          <Label>Do you have any of the following certifications?</Label>
          <FormGroup>
            <AppSwitch className={'mx-1 switch-sm'} name="qmap" checked={data.qmap || false} onChange={this.handleChangeEvent} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} />
            QMAP
          </FormGroup>
          <FormGroup>
            <AppSwitch className={'mx-1 switch-sm'} name="cna" checked={data.cna || false} onChange={this.handleChangeEvent} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} />
            CNA
          </FormGroup>
          <FormGroup>
            <AppSwitch className={'mx-1 switch-sm'} name="cpr" checked={data.cpr || false} onChange={this.handleChangeEvent} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} />
            CPR / First Aid
          </FormGroup>
          <FormGroup>
            <AppSwitch className={'mx-1 switch-sm'} name="hha" checked={data.hha || false} onChange={this.handleChangeEvent} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} />
            HHA
          </FormGroup>
        </div>
          

        <div>
          <Label>Training</Label>
          <FormGroup>
            <Label>Have you received any other training?</Label>
            <Input type="textarea" rows="3" placeholder="Other training..." name="otherTraining" defaultValue={data.otherTraining || 'test'} onChange={this.handleChangeEvent}></Input>
          </FormGroup>
        </div>

      </div>

    )

  }

}

export default FormJobCandidateEducation