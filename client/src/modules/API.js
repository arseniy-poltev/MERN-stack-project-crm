class API {

  static api_url = 'https://dev-cocoa.atlantishomecare.com/api/';
  
  // CUSTOMERS
  // //////////////////////////////////////////////////////////////////////////////////////////////

  static searchCustomers(query = {}){

    return fetch('api/v1/customers/search', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    })
    .then(res => res.json())

  }

  static fetchCustomer(_id){

    return fetch('api/v1/customers/' + _id, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())

  }

  static deleteCustomer(_id){

    return fetch('api/v1/customers/'+ _id, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({deleted: (new Date()).toISOString()})
    })
    .then(res => res.json())
    
  }

  static createCustomer(data = {}){

    data = Object.assign({
      type: 'lead'
    }, data)

    return fetch('api/v1/customers', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    
  }
  
  static updateCustomer(_id, data){

    return fetch('api/v1/customers/'+ _id, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())

  }

  
  static buildCustomerQueryFromState(state){

    let searchedFields = ['_id', 'firstName', 'lastName', 'phone', 'email', 'city', 'address', 'zip', 'selfIntroduction', 'experience', 'availabilityDescription', 'attendance', 'phoneInterviewNotes', 'inPersonInterviewNotes', 'socialMediaInvestigationNotes', 'professionalReferencesNotes', 'applicationComments', 'rejectionReason', 'gender', 'cna', 'qmap']  

    return API.buildQueryFromState(state, searchedFields)

  }

  // EMPLOYEES
  // //////////////////////////////////////////////////////////////////////////////////////////////

  static searchEmployees(query = {}){

    return fetch('api/v1/employees/search', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    })
    .then(res => res.json())

  }

  static fetchEmployee(_id){

    return fetch('api/v1/employees/' + _id, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())

  }

  static deleteEmployee(_id){

    return fetch('api/v1/employees/'+ _id, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({deleted: (new Date()).toISOString()})
    })
    .then(res => res.json())
    
  }

  static createEmployee(data = {}){

    data = Object.assign({
      type: 'candidate'
    }, data)

    return fetch('api/v1/employees', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    
  }
  
  static updateEmployee(_id, data){

    return fetch('api/v1/employees/'+ _id, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())

  }


  static buildEmployeeQueryFromState(state){

    let searchedFields = ['_id', 'firstName', 'lastName', 'phone', 'email', 'city', 'address', 'zip', 'selfIntroduction', 'experience', 'availabilityDescription', 'attendance', 'phoneInterviewNotes', 'inPersonInterviewNotes', 'socialMediaInvestigationNotes', 'professionalReferencesNotes', 'applicationComments', 'rejectionReason', 'gender', 'cna', 'qmap']  

    return API.buildQueryFromState(state, searchedFields)

  }
  // SHIFTS
  // //////////////////////////////////////////////////////////////////////////////////////////////

  static searchShifts(query = {}){

    return fetch('api/v1/shifts/search', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    })
    .then(res => res.json())

  }
  
  static fetchShift(_id){

    return fetch('api/v1/shifts/' + _id, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())

  }

  static deleteShift(_id){

    return fetch('api/v1/shifts/'+ _id, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({deleted: (new Date()).toISOString()})
    })
    .then(res => res.json())
    
  }

  static createShift(data = {}){

    data = Object.assign({
      // assign some default values here
    }, data)

    return fetch('api/v1/shifts', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    
  }
  
  static updateShift(_id, data){

    return fetch('api/v1/shifts/'+ _id, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())

  }

  // USERS
  // //////////////////////////////////////////////////////////////////////////////////////////////

  static fetchUsers(){

    return fetch('api/v1/users', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())

  }

  static fetchUser(_id){

    return fetch('api/v1/users/' + _id, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())

  }

  // MANAGED FIELDS LISTS
  // //////////////////////////////////////////////////////////////////////////////////////////////

  static employeeManagedFields = '_id,availability,firstName,lastName,address,city,state,zip,phone,created,updated,deleted,type,disabled,criminalHistoryFlag,driversLicenseFlag,vehicleOwnershipFlag,vehicleYear,vehicleMake,vehicleModel,exitInterviewServiceReview,exitInterviewLastDayConfirmation,exitInterviewReasonForLeaving,exitInterviewPositiveFeedback,exitInterviewNegativeFeedback,exitInterviewOtherFeedback,availabilityNotes,terminationReason,availabilityBak,disposition,dirtyDriversLicenseFlag,reliableVehicleStatusFlag,drugScreenConcernsFlag,smartPhoneFlag,phoneServiceReliability,heavyLiftingConcernsFlag,createdBy,createdByEmail,email,phoneScreenDate,desiredStartDate,generalCompetencyNotes,continuousWorkHistoryFlag,professionalCommunicationNotes,professionalCommunicationFlag,languageProficiencyFlag,generalCompetencyFlag,desiredHoursNotes,desiredHoursStart,desiredHoursEnd,personalNotes,professionalReputationFlag,professionalReputationNotes'.split(',')

  static customerManagedFields = ''.split(',')
  
  // GENERAL
  // //////////////////////////////////////////////////////////////////////////////////////////////

  static buildQueryFromState(state, searchedFields){

    let query = {
      where: {$and: [{deleted: null}, {type: state.type}]},
      sort: {updated: -1},
      limit: null,
      project: {},
      skip: state.skip || 0,
    }

    // apply filters

    for (let key of Object.keys(state.filter)) {

      if (!state.filter[key].trim().length) continue // skip if blank

      query.where.$and.push({[key]: {$regex: state.filter[key].trim(), $options: 'i'}})

    }

    // apply search text

    if (state.searchText.trim().length){

      let terms = state.searchText.trim().split(' ')

      for (let term of terms){
        
        if (!query.where.$and) query.where.$and = []

        query.where.$and.push({$or: searchedFields.map(fieldname => ({[fieldname]: {$regex: term, $options: 'i'}}))})

      }

    }

    if (state.tab === 'active' || !state.tab) {

      // by default, show only active records

      query.where.$and.push({disabled: null})

    } else if (state.tab === 'inactive'){

      query.where.$and.push({disabled: {$ne: null}})

    }

    return query

  }
  
  static uploadCapturedPhoto(_id, data){

    return fetch( this.api_url + "api/v1/users/uploadPhoto/" + _id, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => res.json());

  }
  
}

export default API