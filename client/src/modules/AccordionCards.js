import React, {Component} from 'react';
import {Card, CardHeader, CardBody, Button, Collapse} from 'reactstrap';

export class AccordionCard extends Component {

  constructor(props) {
    
    super(props)

    this.ref = React.createRef()

    this.handleOnEntered = this.handleOnEntered.bind(this)

  }

  handleOnEntered(){

    if (this.ref.current) window.scrollTo(0, this.ref.current.offsetTop + 50);

  }

  render() {

    return (

      <Card innerRef={this.ref}>
        <CardHeader>
          <Button block color="link" className="text-left m-0 p-0" onClick={this.props.onToggleAccordion} aria-expanded={this.props.isOpen} aria-controls={this.props.label} style={{textDecoration:"none"}}>
            <h5 className="m-0 p-0">{this.props.label}</h5>
          </Button>
        </CardHeader>
        <Collapse isOpen={this.props.isOpen} onEntered={this.handleOnEntered} data-parent="#accordion" id={this.props.label} aria-labelledby={this.props.label} >
          <CardBody>
            {this.props.children}
          </CardBody>
        </Collapse>
      </Card>

    )

  }
  
}

export class AccordionCards extends Component {

  constructor(props){

    super(props)

    this.state = {accordionOpen: props.default}
    
    this.isAccordionOpen = this.isAccordionOpen.bind(this)

    this.handleAccordionToggle = this.handleAccordionToggle.bind(this)

  }

  handleAccordionToggle(key){

    this.setState({accordionOpen: key})

  }

  isAccordionOpen(key){

    return key === this.state.accordionOpen

  }

  render() {

    return (

      <div id="accordion">

        {React.Children.map(this.props.children, child => {
          // if (child.type.name !== 'AccordionCard') throw new Error(child.type.name + ' not allowed as child of AccordionCards. Only AccordionCard is allowed.')
          return React.cloneElement(child, {
            isOpen: this.isAccordionOpen(child.props.label),
            onToggleAccordion: () => this.handleAccordionToggle(child.props.label),
          })
        })}

      </div>
    )

  }

}