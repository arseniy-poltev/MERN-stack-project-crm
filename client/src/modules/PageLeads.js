import React, {Component} from 'react'
import {Table, Input, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label} from 'reactstrap'
import API from './API'
import Formatters from './Formatters'
import Pagination from './Pagination'

const config = {
  columns: [
    {heading: 'First Name', formatter: null, width: '150px', filterBox: true, key: 'firstName'},
    {heading: 'Last Name', formatter: null, width: '150px', filterBox: true, key: 'lastName'},
    {heading: 'Phone', formatter: () => Formatters.phoneLinkFormatter, width: '180px', filterBox: true, key: 'phone'},
    {heading: 'Email', formatter: () => Formatters.emailLinkFormatter, width: '200px', filterBox: true, key: 'email'},
    {heading: 'City', formatter: null, width: '120px', filterBox: true, key: 'city'},
    {heading: 'Created', formatter: () => Formatters.dateFormatter, width: '100px', filterBox: false, key: 'created'},
    {heading: 'Updated', formatter: () => Formatters.dateFormatter, width: '100px', filterBox: false, key: 'updated'},
  ],
}

const emptyQueryState = {
  filter: {},
  searchText: '',
  tab: '',
  page: '',
  type: 'lead',
}

class PageLeads extends Component {

  constructor(props){

    super(props)

    this.state = {
      queryState: JSON.parse(JSON.stringify(emptyQueryState)),
      modalData__addCustomer: {},
    }

  }

  refreshData = (state) => {

    let query = API.buildCustomerQueryFromState(state)

    API.searchCustomers(query)
    .then(res => {

      this.setState({
        data: res.data,
        count: res.count,
        size: res.size,
        limit: res.limit,
        skip: res.skip,
      })
      
    })

  }

  // EVENT HANDLERS
  // //////////////////////////////////////////////////////////////////////////////////////////////

  handleTabChange = (event) => {

    let label = event.target.name

    let queryState = Object.assign({}, this.state.queryState)

    queryState.tab = label

    this.setState({queryState})

    this.refreshData(queryState)

  }

  handleFilterChange = (event) => {

    let key = event.target.name

    let value = event.target.value

    let queryState = Object.assign({}, this.state.queryState)

    queryState.filter[key] = value

    this.setState({queryState})

    this.refreshData(queryState)

  }

  handleSearchChange = (event) => {

    let value = event.target.value

    let queryState = Object.assign({}, this.state.queryState)

    queryState.searchText = value

    this.setState({queryState})

    this.refreshData(queryState)

  }

  handleClickClearSearch = () => {

    // clear all search filters and search text
    
    this.setState({
      queryState: JSON.parse(JSON.stringify(emptyQueryState))
    })

    this.refreshData(JSON.parse(JSON.stringify(emptyQueryState)))

  }

  handleClickDeleteCustomer = (event) => {

    let _id = event.target.name

    event.stopPropagation()

    if (window.confirm("Are you sure you want to delete this record? This cannot be undone.")){

      API.deleteCustomer(_id)
      .then(res => {

        this.refreshData(this.state.queryState)

      })
      
    }

  }

  handleRowClick = (event, _id) => {

    this.props.history.push('leads/' + _id)

  }

  handleChangeEvent = (event) => {

    let key = event.target.name
    
    let value = event.target.value

    this.setState({[key]: value})

  }

  handleModalClickCreate = () => {

    let data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      type: 'lead',
    }

    if (!data.firstName || !data.lastName) return alert("Please complete the form.")

    API.createCustomer(data)
    .then(res => {

      this.props.history.push('leads/' + res.data._id)

    })

  }

  toggleModalAdd = () => {

    this.setState({showModalAdd: !this.state.showModalAdd})

  }

  handleClickNotAuthorized = (event) => {
    
    event.stopPropagation()

    alert("Not authorized.")

  }

  handleClickPagination = (obj) => {

    let queryState = Object.assign({}, this.state.queryState)

    queryState.skip = obj.skip

    this.setState({skip: obj.skip})

    this.refreshData(queryState)

  }

  // LIFE CYCLE EVENTS
  // //////////////////////////////////////////////////////////////////////////////////////////////

  componentDidMount(){

    this.refreshData(this.state.queryState)

  }

  // RENDER VIEWS
  // //////////////////////////////////////////////////////////////////////////////////////////////

  render() {

    let data = this.state.data

    let state = this.state

    if (!data) return (<div>Loading...</div>)

    let modalProps = {
      isOpen: state.showModalAdd,
      autoFocus: true,
      centered: true,
      backdrop: true,
      toggle: this.toggleModalAdd,
    }

    let columns = config.columns

    let searchText = state.queryState.searchText
    
    let filter = state.queryState.filter

    let paginationProps = {
      totalItems: state.count,
      pageSize: state.limit,
      currentPage: state.skip/state.limit + 1,
      onClick: this.handleClickPagination,
    }

    let managesCustomers = this.props.session && this.props.session.authorizations && this.props.session.authorizations.includes('manages customers')

    return (
      <div className="animated fadeIn">
        <Modal {...modalProps}>
          <ModalHeader>
            <span>Add Sales Lead</span>
          </ModalHeader>
          <ModalBody>
            <Label>First Name</Label>
            <Input type="text" name="firstName" placeholder="Enter first name..." value={state.firstName || ''} onChange={this.handleChangeEvent} />
            <Label>Last Name</Label>
            <Input type="text" name="lastName" placeholder="Enter last name..." value={state.lastName || ''} onChange={this.handleChangeEvent} />
          </ModalBody>
          <ModalFooter className="text-right">
            <Button onClick={this.toggleModalAdd} size="sm" color="warning">Cancel</Button>
            <Button color="success" size="sm" onClick={this.handleModalClickCreate}>Create</Button>
          </ModalFooter>
        </Modal>
        <Card>
          <CardHeader>
            <i className="icon-menu"></i> Sales Leads
          </CardHeader>
          <CardBody>
            {/* <Nav tabs onClick={this.handleTabChange}>
              <NavItem >
                <NavLink name="available" active={activeTab === 'available'}>Available</NavLink>
              </NavItem>
              <NavItem>
                <NavLink name="rejected" active={activeTab === 'rejected'}>Rejected</NavLink>
              </NavItem>
              <NavItem>
                <NavLink name="all" active={activeTab === 'all'}>All</NavLink>
              </NavItem>
            </Nav> */}
            <Table className="table table-hover table-striped table-bordered table-sm">
              <thead>
                <tr>
                  <td colSpan="8">
                    <Pagination {...paginationProps} />
                    <Button color="info" size="sm" onClick={this.toggleModalAdd}><i className="fa fa-plus" ></i> New</Button>
                    <Button size="sm" color="info" className="pull-right" onClick={this.handleClickClearSearch}>Clear</Button>
                    <div className="pull-right w-25"><Input type="text" name="searchText" bsSize="sm" placeholder="Search" className="pull-right" onChange={this.handleSearchChange} value={searchText || ''} /></div>
                  </td>
                </tr>
                <tr className="text-capitalize font-weight-bold">
                  {columns.map(col => (
                    <td width={col.width} key={col.key}>
                      <span>{col.heading}</span>
                      {col.filterBox && (
                        // <TextInput key={col.key} name={col.key} placeholder={col.heading} bsSize="sm" onChange={this.handleFilterChange} value={filter[col.key]} />
                        <Input type="text" name={col.key} placeholder={col.heading} bsSize="sm" onChange={this.handleFilterChange} value={filter[col.key] || ''} />
                      )}
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
                      {managesCustomers && (
                        <Button color='danger' size="sm" name={item._id} onClick={this.handleClickDeleteCustomer}><i className="fa fa-trash"></i></Button>
                      )}
                    </td>
                  </tr>
                ))}        
              </tbody> 
              <tfoot>
                <tr>
                  <td colSpan="8">
                    <Pagination {...paginationProps} />
                  </td>
                </tr>
              </tfoot>
            </Table>
          </CardBody>
        </Card>
      </div>
    );

  }
}

export default PageLeads
