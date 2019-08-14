import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Register extends Component {

  constructor(props){

    super(props)

    this.state = {}

    this.handleChange = this.handleChange.bind(this)

    this.handleSubmit = this.handleSubmit.bind(this)

  }
  
  handleChange(event){

    this.setState({[event.target.name]: event.target.value})
    
  }

  handleSubmit(event){

    // TODO: handle repeat password validation

    event.preventDefault()

    const data = {
      email: this.state.email,
      password: this.state.password
    }

    fetch('api/v1/register', {
      method: 'POST', 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then(res => {

      // TODO: Check the response.
        // TODO: Tell the user to check their email
        // TODO: Tell the user that the account already exists and provide a link to the login page.
      // this.setState({redirectHome: true})
    })

  }

  render() {

    if (this.state.redirectHome){

      return (<Redirect to="/" />)

    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.handleSubmit}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    {/* <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Username" autoComplete="username" />
                    </InputGroup> */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="email" placeholder="Email" autoComplete="email" onChange={this.handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="password" placeholder="Password" autoComplete="password" onChange={this.handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="password-repeat" placeholder="Repeat password" autoComplete="password" onChange={this.handleChange} />
                    </InputGroup>
                    <Button color="success" block onClick={this.onSubmit}>Create Account</Button>
                  </Form>
                </CardBody>
                {/* <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter> */}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );

  }

}

export default Register;