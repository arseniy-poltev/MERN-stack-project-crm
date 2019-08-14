import React, {PureComponent} from 'react';
import {Card, CardHeader, CardBody} from 'reactstrap'

class PageUserDetail extends PureComponent {

  render(){

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>User Detail
          </CardHeader>
          <CardBody>
            <Card>
              <CardHeader>Authorizations</CardHeader>
              <CardBody>
                Add/remove authorizations go here...
              </CardBody>
            </Card>
          </CardBody>
        </Card>

      </div>
    )

  }

}

export default PageUserDetail