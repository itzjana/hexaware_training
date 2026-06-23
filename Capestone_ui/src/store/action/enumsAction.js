import axios from "axios";

const api = "http://localhost:8080/api/enums";

const getConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

export const getEnums = () => {
    return async (dispatch) => {
        
        const response = await axios.get(api, getConfig())

        const action = {
            type: 'GET_ENUMS',
            payload: response.data
        }
        dispatch(action)
    }
}