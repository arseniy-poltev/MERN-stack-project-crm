export const JOB_CANDIDATES_SET = 'jobCandidates:set'
export const JOB_CANDIDATE_SET = 'jobCandidate:set'

let initialState = {}

export default function(state = initialState, {type, payload}){

  switch(type) {

    case JOB_CANDIDATES_SET:

      return {
        ...state,
        jobCandidates: payload
      }

    case JOB_CANDIDATE_SET: 

      return {
        ...state,
        jobCandidate: payload
      }

    default:

      return state

  }

}
