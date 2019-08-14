import React, { PureComponent } from 'react';
import {Card, CardHeader, CardBody, Button, Col, Row} from 'reactstrap'

class PageEmployees extends PureComponent {

  handleBtnClickGoHere = (event) => {

    this.props.history.push(event.target.name)

  }

  render(){

    return (

      <div>
        <Row>

          <Col lg="3">
            <Card>
              <CardHeader className="text-center">
                <h4>Job Candidates</h4>
              </CardHeader>
              <CardBody className="text-center">
                <Button color="success" size="lg" name="/candidates" onClick={this.handleBtnClickGoHere}>Go here...</Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3">
            <Card>
              <CardHeader className="text-center">
                <h4>Employees</h4>
              </CardHeader>
              <CardBody className="text-center">
                <Button color="success" size="lg" name="/employees" onClick={this.handleBtnClickGoHere}>Go here...</Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3">
            <Card>
              <CardHeader className="text-center">
                <h4>Sales Leads</h4>
              </CardHeader>
              <CardBody className="text-center">
                <Button color="success" size="lg" name="/leads" onClick={this.handleBtnClickGoHere}>Go here...</Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3">
            <Card>
              <CardHeader className="text-center">
                <h4>Customers</h4>
              </CardHeader>
              <CardBody className="text-center">
                <Button color="success" size="lg" name="/customers" onClick={this.handleBtnClickGoHere}>Go here...</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      
    );
  
  }

}

export default PageEmployees;
