const initialState = {
    proposalsList: []
}

export const proposalReducer = (state = initialState, action) => {
    if (action.type === 'FETCH_PROPOSALS_SUCCESS') {
        return {
            ...state,
            proposalsList: action.payload
        }
    }
    return state;
}
