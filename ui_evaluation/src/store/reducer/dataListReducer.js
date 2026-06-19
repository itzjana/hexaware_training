const initialState = {
    dataList:[]
}


export const dataListReducer = (state = initialState,action) =>{
    switch (action.type) {
        case 'GET_DATA':
            return {
                ...state,
                dataList:action.payload
            }    
        default:
            return state;
    }
}