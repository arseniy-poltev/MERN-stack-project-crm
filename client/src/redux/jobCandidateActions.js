import {JOB_CANDIDATES_SET, JOB_CANDIDATE_SET} from './reducers'

let updateTimeout = null

export const createJobCandidate = (data) => dispatch => {

  return new Promise((resolve, reject) => {
    fetch('api/v1/jobCandidates', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(res => {
      let data = res.data
  
      dispatch({
        type: JOB_CANDIDATE_SET,
        payload: data,
      })
      
      resolve(data)
  
    })
    
  })

}

export const fetchJobCandidates = (query) => dispatch => {

  fetch('api/v1/jobCandidates/search', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query)
  })
  .then(res => res.json())
  .then(res => {

    dispatch({
      type: JOB_CANDIDATES_SET,
      payload: res.data
    })

  })

}

export const fetchJobCandidate = (id) => dispatch => {

  fetch('api/v1/jobCandidates/' + id)
  .then(res => res.json())
  .then(res => {
    console.log()

    // TODO: These can be removed when we ar etrackign this data in the object.

    res.data.interactions = [
      {id: 1, created: new Date(), user: 'Jerimiah Baldwin', type: 'Phone Screen Completed'},
      {id: 2, created: new Date(), user: 'Jerimiah Baldwin', type: 'Phone Screen Completed'},
      {id: 3, created: new Date(), user: 'Jerimiah Baldwin', type: 'Phone Screen Completed'},
    ]

    res.data.attachments = [
      {id: 1, created: new Date(), user: 'Jerimiah Baldwin', name: 'In-Person Interview Recording'},
      {id: 2, created: new Date(), user: 'Jerimiah Baldwin', name: 'Resume'},
      {id: 3, created: new Date(), user: 'Jerimiah Baldwin', name: 'Photo'},
      {id: 4, created: new Date(), user: 'Jerimiah Baldwin', name: 'DORA Check'},
    ]

    dispatch({
      type: JOB_CANDIDATE_SET,
      payload: res.data
    })

  })  

}

export const updateJobCandidate = (id, data) => dispatch => {
  
  dispatch({
    type: JOB_CANDIDATE_SET,
    payload: JSON.parse(JSON.stringify(data))
  })

  if (updateTimeout) clearTimeout(updateTimeout)

  updateTimeout = setTimeout(() => {

    fetch('api/v1/jobCandidates/'+ id, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
  }, 1000)

}