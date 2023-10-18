import { GET_NETWORKS } from 'actions/constant'

const initialState = []

const networksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NETWORKS.RECEIVED:
      return [...state, ...action.payload.data]
    default:
      return state
  }
}

export default networksReducer