import React, {PureComponent} from 'react'
import {FormGroup} from 'reactstrap'
import {AppSwitch} from '@coreui/react'

export default class FancyRadio extends PureComponent {

  constructor(props){

    super(props)

    this.state = {

      value: props.defaultValue

    }

    this.handleChangeEvent = this.handleChangeEvent.bind(this)

  }

  handleChangeEvent(event){

    let key = event.target.name

    // turn off if the same value is toggled

    let value = (this.props.defaultValue === event.target.value) ? '' : event.target.value

    if (this.props.onUpdate) this.props.onUpdate((data) => {

      data[key] = value

      return {key, value, data}

    })

  }

  renderOption(option){

    // Check to see if the value prop of the option is the same as is set on this component's state.

    let checked = this.props.defaultValue === option.props.value

    return (

      <div>

        <h5>
          <AppSwitch 
          className={'mx-1 switch-sm'} 
          variant={'pill'} 
          color={option.props.color} 
          outline={'alt'} 
          dataOn={'\u2713'} 
          dataOff={'\u2715'} 
          label 
          checked={ checked } 
          name={this.props.name}
          value={option.props.value}
          onChange={this.handleChangeEvent} /> 
          { option.props.label } 
        </h5>

        {checked && option.props.children}

      </div>

    )

  }

  render(){

    let head = (<FancyRadioHead />)    

    let options = []

    React.Children.forEach(this.props.children, child => {

      if (child.type.name === 'FancyRadioHead') {

        head = child

      } else if (child.type.name === 'FancyRadioBody') {
        
        options = React.Children.toArray(child.props.children).filter(o => o.type && o.type.name === 'FancyRadioOption')

      }

    })

    return (

      <FormGroup>
        <div className="card card-body">

        { head.props.children } 
        

          { options.map((option, i) => {

            return (<div key={i}>{this.renderOption(option)}</div>)

          }) }
        </div>
      </FormGroup>

    )

  }

}

export function FancyRadioOption(props){return null}
export function FancyRadioHead(props){return null}
export function FancyRadioBody(props){return null}