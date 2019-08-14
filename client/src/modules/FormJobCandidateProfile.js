import React, {PureComponent} from 'react';
import { CustomInput, Row, Col, FormGroup, Label, Input, Table } from 'reactstrap';
import {AppSwitch} from '@coreui/react'

const listPreEmploymentSkills = [
    {key: 'experienceDementia', description: 'Dementia'},
    {key: 'experienceAmbulation', description: 'Ambulation'},
    {key: 'experienceTransfers', description: 'Transfers'},
    {key: 'experienceBedBath', description: 'Bed Bath'},
    {key: 'experienceChangingAdultBriefs', description: 'Changing Adult Briefs'},
    {key: 'experienceRepositioning', description: 'Repositioning'},
    {key: 'experienceSeniorMealPreparation', description: 'Senior Meal Preparation'},
    {key: 'experienceBedSores', description: 'Bed Sores'},
    {key: 'experienceCommode', description: 'Commode'},
    {key: 'experienceGaitBelt', description: 'Gait Belt'},
    {key: 'experienceDentalCare', description: 'Dental Care'},
    {key: 'experienceBedPan', description: 'Bed Pan'},
    {key: 'experienceUrinal', description: 'Urinal'},
    {key: 'experienceOstomyBag', description: 'Ostomy Bag'},
    {key: 'experienceCatheterBag', description: 'Catheter Bag'},
    {key: 'experienceManualLifts', description: 'Manual Lifts'},
    {key: 'experienceSitToStandLift', description: 'Sit to Stand Lift'},
    {key: 'experienceHoyerLift', description: 'Hoyer Lift'},
    {key: 'experienceShowerAssistance', description: 'Shower Assistance'},
    {key: 'experienceRangeOfMotionExercises', description: 'Range of Motion exercises'},
    {key: 'experienceCompanionCare', description: 'Companion care'},
    {key: 'experienceShopping', description: 'Shopping'},
    {key: 'experiencePlantCare', description: 'Plant Care'},
    {key: 'experiencePetCare', description: 'Pet Care'},
    {key: 'experienceDressing', description: 'Dressing'}
]


class FormJobCandidateProfile extends PureComponent{

  constructor(props) {
    super(props)
  
    this.state = {
       list: listPreEmploymentSkills,
       data: [],
    }

    this.onChange = this.onChange.bind(this);
  }
  

  onChange(key) {
    this.props.childChange(key);
  }

  handleChange(key, value) {
    console.log(key, value);
  }

  render(){

    // { "type": "AppCard", "label": "Job Application", "size": "small", "items": [
    //   { "type": "InputBlock", "label": "Expected Pay Rate", "id": "expectedPayRate", "inputType": "text", "formText": `"It's important that you be satisfied with your pay rate. What pay rate are you expecting?"`}, 
    //   { "type": "AppCard", "label": "Specific Skills Experience", "id": "", "inputType": "text", "formText": `Please rate your level of experience with the following skills.`}, 
    const {data} = this.state;
    return (
      <div>
        <Row>
          <Col xs={12} md={6}>
            <FormGroup>
              <Table size="sm" responsive>
                <thead>
                  <tr>
                    <th></th>
                    <th>None</th>
                    <th>Some</th>
                    <th>Expert</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.list.map(i=> (
                    <tr key={i.key}>
                      <th scope="row">{i.description}</th>
                      <td><CustomInput type="radio" id={i.key+1} name={i.key} /></td>
                      <td><CustomInput type="radio" id={i.key+2} name={i.key} /></td>
                      <td><CustomInput type="radio" id={i.key+3} name={i.key} /></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </FormGroup>
          </Col>
          <Col xs={12} md={6}>
            <Table size="sm">
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okDogs" checked={data.okDogs || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Dogs</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okCats" checked={data.okCats || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Cats</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okTobaccoSmokers" checked={data.okTobaccoSmokers || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Tobacco Smokers</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okMarijuanaSmokers" checked={data.okMarijuanaSmokers || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Marijuana Smokers</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okMen" checked={data.okMen || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Men</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okWomen" checked={data.okWomen || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Women</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okStairs" checked={data.okStairs || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Stairs</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okHoarding" checked={data.okHoarding || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Hoarding</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okAlcoholic" checked={data.okAlcoholic || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Alcoholic</td>
                </tr>
                <tr>
                  <td><AppSwitch className={'mx-1 switch-sm'} name="okDevelopmentalDisability" checked={data.okDevelopmentalDisability || false} onChange={e => this.handleChange(e.target.name, e.target.checked)} variant={'pill'} color={'success'} outline={'alt'}  dataOn={'\u2713'} dataOff={'\u2715'} /></td>
                  <td>OK with Developmental Disability and Special Needs</td>
                </tr>
              </tbody>
            </Table>
            <FormGroup>
              <Label htmlFor="hobbiesInterests">Hobbies and Interests</Label>
              <Input type="textarea" rows="3" name="hobbiesInterests" id="hobbiesInterests" placeholder="Hobbies and Interests..." onChange={e => this.handleChange(e.target.name, e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="additionalLanguage">Additional Language Spoken</Label>
              <Table size="sm">
                <tbody>
                  <tr>
                    <td><CustomInput type="radio" id="additionalLanguage1" name="additionalLanguage" value="Some Training" onChange={e => this.handleChange(e.target.name, e.target.value)} /></td>
                    <td>Some Training</td>
                    <td><CustomInput type="radio" id="additionalLanguage2" name="additionalLanguage" value="Conversational" onChange={e => this.handleChange(e.target.name, e.target.value)} /></td>
                    <td>Conversational</td>
                    <td><CustomInput type="radio" id="additionalLanguage3" name="additionalLanguage" value="Fluent" onChange={e => this.handleChange(e.target.name, e.target.value)} /></td>
                    <td>Fluent</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="educationPlan">Continuing Education Plans</Label>
              <Input type="textarea" rows="3" name="educationPlan" id="educationPlan" placeholder="Continuing Education Plans..." onChange={e => this.handleChange(e.target.name, e.target.value)} />
            </FormGroup>
          </Col>
        </Row>
      </div>
    )
  }
}

export default FormJobCandidateProfile

/*

I smoke.
I live with a smoker.
Visible body piercings.
Visible tattoos.
Pay expectations: now and in 1 year
Other alergies or sensitivites


*/