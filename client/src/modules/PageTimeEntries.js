import React, { PureComponent } from 'react';
import {Table, Card, CardHeader, CardBody} from 'reactstrap'

class TimeEntries extends PureComponent {
  
  render(){
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>Overview
          </CardHeader>
          <CardBody>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>In</th>
                  <th>Out</th>
                  <th>Duration</th>
                  <th>Employee</th>
                  <th>Customer</th>
                  <th>Attachments</th>
                  <th>Mileage</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </Table>            
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default TimeEntries
