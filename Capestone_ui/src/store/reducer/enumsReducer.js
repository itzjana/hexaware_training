const initialState = {
    enumslist:[]
}


export const enumsReducer = (state = initialState,action) =>{
        if(action.type === 'GET_ENUMS'){
            return {
                ...state,
                enumslist:action.payload
            }
        }
            return state;
}