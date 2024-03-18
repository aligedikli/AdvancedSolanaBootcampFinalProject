import { LOAD_CAMPAIGNS, SET_CAMPAIGN, SET_LOADING, SET_PROCESSING, UNSET_PROCESSING } from './types'

const reducer = (state, action) => {
    switch(action.type) {
        case LOAD_CAMPAIGNS:
            return {
                ...state,
                liveCampaigns: action.payload,
                loading: false
            }
        case SET_CAMPAIGN:
            return {
                ...state,
                campaign: action.payload,
                loading: false
            }
        case SET_LOADING:
            return {
                ...state,
                loading: true
            }
        case SET_PROCESSING:
            return {
                ...state,
                processing: true,
            }
        case UNSET_PROCESSING:
            return {
                ...state,
                processing: false,
            }
        default:
            return state
    }
}

export default reducer