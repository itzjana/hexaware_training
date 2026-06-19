import { configureStore } from "@reduxjs/toolkit";
import { dataListReducer } from "./store/reducer/dataListReducer";

export const store = configureStore({
    reducer: {
        dataList : dataListReducer
    }

})


// commonjs coreModule -> require()
// .js -> default

// es module ecma script -> import
// .jsx -> ES module