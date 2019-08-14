import React, {PureComponent} from 'react';
import {FormGroup, Label, Input} from 'reactstrap';

class StandardFormGroup extends PureComponent {

  constructor(props){

    super(props)

    this.handleChangeEvent = this.handleChangeEvent.bind(this)
    
  }

  handleChangeEvent(event){

    let key = event.target.name

    let value = event.target.value

    if (this.props.onUpdate) this.props.onUpdate((data) => {

      data[key] = value

      return {key, value, data}

    })

  }

  render() {

    return (
      <FormGroup>
        <Label htmlFor={this.props.name}>{this.props.label}</Label>
        <div>{this.props.description}</div>
        <Input type={this.props.type} name={this.props.name} value={this.props.defaultValue} placeholder={this.props.placeholder} onChange={this.handleChangeEvent} />
      </FormGroup>
    )

  }
  
}

export default StandardFormGroup
