import React, {PureComponent} from 'react'
import {Collapse, CardBody} from 'reactstrap'

class CollapsableCardBody extends PureComponent {

  constructor(props){

    super(props)

    this.ref = React.createRef()

  }

  handleOnEntered = () => {

    this.ref.current.scrollIntoView()

    window.scrollBy(0, -100)
    
  }

  render(props){

    return (
      <Collapse isOpen={this.props.isOpen} onEntered={this.handleOnEntered} innerRef={this.ref}>
        <CardBody className={this.props.className}  >
          {this.props.children}
        </CardBody>
      </Collapse>
    )
  
  }

}

export default CollapsableCardBody