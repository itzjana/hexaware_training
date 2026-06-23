import { configureStore } from "@reduxjs/toolkit";
import { enumsReducer } from "./store/reducer/enumsReducer";
import { proposalReducer } from "./store/reducer/proposalReducer";

const store = configureStore({
    reducer: {
        enums: enumsReducer,
        proposals: proposalReducer
    }

})

export default store

// {
//     "claimStatuses": [
//         "INITIATED",
//         "UNDER_REVIEW",
//         "APPROVED",
//         "REJECTED"
//     ],
//     "fuelTypes": [
//         "PETROL",
//         "DIESEL",
//         "CNG",
//         "LPG",
//         "ELECTRIC",
//         "HYBRID"
//     ],
//     "jobTitles": [
//         "ASSOCIATE_EXECUTIVE",
//         "MANAGER",
//         "SENIOR_EXECUTIVE",
//         "TECHNICAL_EXECUTIVE"
//     ],
//     "notificationTypes": [
//         "NEW_PROPOSAL_SUBMITTED",
//         "PROPOSAL_APPROVED",
//         "PROPOSAL_REJECTED",
//         "ADDITIONAL_DETAILS_REQUIRED",
//         "CUSTOMER_RESPONSE_RECEIVED",
//         "QUOTE_GENERATED",
//         "POLICY_ACTIVATED",
//         "POLICY_EXPIRING",
//         "POLICY_EXPIRED",
//         "CLAIM_SUBMITTED",
//         "CLAIM_APPROVED",
//         "CLAIM_REJECTED",
//         "CLAIM_ADDITIONAL_DETAILS_REQUIRED",
//         "CLAIM_CUSTOMER_RESPONSE_RECEIVED",
//         "GENERAL_ALERT"
//     ],
//     "paymentStatuses": [
//         "PENDING",
//         "SUCCESS",
//         "FAILED",
//         "REFUNDED",
//         "VERIFIED"
//     ],
//     "policyStatuses": [
//         "PROPOSAL_SUBMITTED",
//         "UNDER_REVIEW",
//         "ADDITIONAL_DETAILS_REQUIRED",
//         "VERIFIED",
//         "QUOTE_GENERATED",
//         "REJECTED",
//         "ACTIVE",
//         "EXPIRED",
//         "CANCELLED"
//     ],
//     "role": [
//         "ADMIN",
//         "CUSTOMER",
//         "INSURANCE_OFFICER"
//     ],
//     "vehicleCategories": [
//         "TRUCK",
//         "MOTORCYCLE",
//         "CAMPER_VAN",
//         "CAR",
//         "BIKE"
//     ],
//     "vehicleConditions": [
//         "EXCELLENT",
//         "GOOD",
//         "FAIR",
//         "POOR",
//         "DAMAGED"
//     ],
//     "vehicleUsages": [
//         "PRIVATE",
//         "COMMERCIAL"
//     ]
// }