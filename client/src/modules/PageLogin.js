import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Login extends Component {

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

    event.preventDefault()

    const data = {
      email: this.state.email,
      password: this.state.password
    }
    
    fetch('api/v1/login', {
      method: 'POST', 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then(res => {
      this.setState({redirectHome: true})
    })

  }

  render() {

    if (this.state.redirectHome){

      return (<Redirect to="/admin" />)

    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" name="email" placeholder="Email" autoComplete="email" onChange={this.handleChange} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" name="password" placeholder="Password" autoComplete="password" onChange={this.handleChange} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button onClick={this.onSubmit} color="primary" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Don't have an account? Register now for free. Depending on your system settings, your account may require approval from an administrative use.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );

  }

}

export default Login;
