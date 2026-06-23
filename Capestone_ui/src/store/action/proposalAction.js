import axios from "axios";

const api = "http://localhost:8080/api/policyproposal/customer/all";

const getConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

export const getCustomerProposals = () => {
    return async (dispatch) => {

        const response = await axios.get(api, getConfig())
        const action = {
            type: 'FETCH_PROPOSALS_SUCCESS',
            payload: response.data
        }
        dispatch(action)

    }
}