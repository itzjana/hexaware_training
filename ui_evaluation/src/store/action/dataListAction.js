import axios from "axios"

export const getDataList = (currentPage) => {
    return async (dispatch) => {
        const api = `https://rickandmortyapi.com/api/character/?page=${currentPage}`

        const response = await axios.get(api)

        const action = {
            type: 'GET_DATA',
            payload: response.data
        }
        dispatch(action)
    }
}