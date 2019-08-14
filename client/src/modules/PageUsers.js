import React, { PureComponent } from 'react';
import {Table, Card, CardHeader, CardBody, Button} from 'reactstrap'
import Formatters from './Formatters'
import API from './API'

const config = {
  columns: [
    {heading: 'First Name', formatter: null, width: '150px', filterBox: true, key: 'firstName'},
    {heading: 'Last Name', formatter: null, width: '150px', filterBox: true, key: 'lastName'},
    {heading: 'Phone', formatter: () => Formatters.phoneLinkFormatter, width: '180px', filterBox: true, key: 'phone'},
    {heading: 'Email', formatter: () => Formatters.emailLinkFormatter, width: '200px', filterBox: true, key: 'email'},
    {heading: 'Activated', formatter: () => Formatters.dateFormatter, width: '100px', filterBox: false, key: 'active'},
    {heading: 'Updated', formatter: () => Formatters.dateFormatter, width: '100px', filterBox: false, key: 'updated'},
  ],
  searchedFields: ['_id', 'firstName', 'lastName', 'phone', 'email', 'city', 'address', 'zip', 'selfIntroduction', 'experience', 'availabilityDescription', 'attendance', 'phoneInterviewNotes', 'inPersonInterviewNotes', 'socialMediaInvestigationNotes', 'professionalReferencesNotes', 'applicationComments', 'rejectionReason', 'gender', 'cna', 'qmap']  
}

class Users extends PureComponent{

  constructor(props){

    super(props)

    this.state = {}

  }

  handleRowClick = (event, _id) => {

    this.props.history.push('users/' + _id)

  }


  componentDidMount(){

    API.fetchUsers()
    .then(res => {
      this.setState({data: res.data})
    })

  }

  render(){

    let data = this.state.data

    if (!data) return (<div>Loading...</div>)

    let columns = config.columns

    let managesUsers = this.props.session && this.props.session.authorizations && this.props.session.authorizations.includes('manages users')

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>Users
          </CardHeader>
          <CardBody>
            <Table className="table table-hover table-striped table-bordered table-sm">
              <thead>
                <tr className="text-capitalize font-weight-bold">
                  {columns.map(col => (
                    <td width={col.width} key={col.key}>
                      <span>{col.heading}</span>
                    </td>
                  ))}
                  <td width="40px" className="text-center"></td>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr className="text-capitalize pointer" onClick={event => this.handleRowClick(event, item._id)} key={item._id}>
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.formatter && col.formatter()(item[col.key])}
                        {!col.formatter && item[col.key]}
                      </td>
                    ))}
                    <td className="text-center" width="60px">
                      {managesUsers && (
                        <Button color='danger' size="sm" name={item._id} onClick={this.handleClickDeleteEmployee}><i className="fa fa-trash"></i></Button>
                      )}
                    </td>
                  </tr>
                ))}        
              </tbody> 
            </Table>
          </CardBody>
        </Card>
      </div>
    )

  }

}

export default Users
