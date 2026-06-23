# CapeStone Insurance API Testing Guide

This guide describes all the REST API endpoints in the CapeStone Insurance & Vehicle Project. It includes details about their request structures, response formats, role-based authorization requirements, and instructions on how to use the generated Postman collection to test them.

The Postman collection is saved directly in your project root at:
[CapeStoneProject.postman_collection.json](file:///c:/Users/janak/Downloads/CapeStoneProject/CapeStoneProject/CapeStoneProject.postman_collection.json)

---

## 🚀 Postman Collection Quick Start

1. **Import the Collection**:
   - Open Postman.
   - Click the **Import** button in the top-left.
   - Select or drag and drop the `CapeStoneProject.postman_collection.json` file from your project folder.
2. **Configure Variables**:
   - Select the **CapeStone Insurance API Collection** in the left sidebar.
   - Go to the **Variables** tab.
   - Set the `baseUrl` (default is `http://localhost:8080`).
3. **Login and Automatic Token Capture**:
   - Open the **1. Authentication -> Login** request.
   - Go to the **Authorization** tab. Set type to **Basic Auth** and input the username and password of the account you want to test (or use the collection variables `loginUsername` and `loginPassword`).
   - Click **Send**.
   - The collection includes a Postman **Test Script** that automatically extracts the returned JWT token from `TokenDTO` and sets the `authToken` collection variable.
   - All subsequent requests are pre-configured to use **Bearer Token** auth inheriting from the collection parent (using `{{authToken}}`).

---

## 🔑 Authority and Role Mapping

Based on `SecurityConfig.java`, endpoints have strict authority requirements:

| Authority / Role | Accessible Modules / Features |
| :--- | :--- |
| **None (Public)** | Login, Customer Signup, Admin Signup, Fetch Policies, Fetch Add-Ons |
| **ADMIN** | Officer Signup, Modify Policies (Insert/Update/Delete), Modify Add-Ons (Insert/Update/Delete) |
| **CUSTOMER** | View/Update Profile, Add/Modify/Delete Vehicles, Upload Documents, Submit Policy Proposals, Resubmit Proposals, View My Quotes, Make Payment |
| **INSURANCE_OFFICER** | View/Update Officer Profile, View Submitted Proposals, Request Additional Details, Generate Quotes |

---

## 📂 API Reference by Controller

### 1. Auth Controller (`/api/auth`)

| Endpoint | Method | Role Required | Request Body DTO | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/admin/signup` | `POST` | Public | [AdminReqDTO](#adminreqdto) | `void` (200 OK) |
| `/api/auth/customer/signup` | `POST` | Public | [CustomerReqDTO](#customerreqdto) | `void` (200 OK) |
| `/api/auth/login` | `GET` | Authenticated | None (Uses HTTP Basic Header) | [TokenDTO](#tokendto) |
| `/api/auth/officer/signup` | `POST` | `ADMIN` | [OfficerSignupReqDTO](#officersignupreqdto) | `void` (200 OK) |

---

### 2. Customer Controller (`/api/customers`)

| Endpoint | Method | Role Required | Request Body DTO | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/customers/me` | `GET` | `CUSTOMER` | None | [CustomerResDTO](#customerresdto) |
| `/api/customers/me/update` | `PATCH` | `CUSTOMER` | [CustomerUpdateReqDTO](#customerupdatereqdto) | [CustomerResDTO](#customerresdto) |

---

### 3. Vehicle Controller (`/api/vehicles`)

| Endpoint | Method | Role Required | Request Body DTO | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/vehicles/add` | `POST` | `CUSTOMER` | [VehicleReqDTO](#vehiclereqdto) | `void` (200 OK) |
| `/api/vehicles/getbycustomer` | `GET` | `CUSTOMER` | None | `List<VehicleListResDTO>` |
| `/api/vehicles/getbyid/{id}` | `GET` | `CUSTOMER` | None (Path ID) | [VehicleResDTO](#vehicleresdto) |
| `/api/vehicles/update/{id}` | `PATCH` | `CUSTOMER` | [VehicleUpdateReqDTO](#vehicleupdatereqdto) | [VehicleResDTO](#vehicleresdto) |
| `/api/vehicles/delete/{id}` | `DELETE` | `CUSTOMER` | None (Path ID) | `void` (200 OK) |

---

### 4. Insurance Policy Controller (`/api/insurance`)

| Endpoint | Method | Role Required | Request Body DTO / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/insurance/all` | `GET` | Public | None | `List<InsurancePolicyResDTO>` |
| `/api/insurance/all/v2` | `GET` | Public | Query: `page` (int), `size` (int) | [InsuranceResDTO](#insuranceresdto) |
| `/api/insurance/getbyid/{id}` | `GET` | Public | None (Path ID) | [InsurancePolicyResDTO](#insurancepolicyresdto) |
| `/api/insurance/insert` | `POST` | `ADMIN` | [InsuranceDTO](#insurancedto) | [InsurancePolicyResDTO](#insurancepolicyresdto) |
| `/api/insurance/update/{id}` | `PATCH` | `ADMIN` | [InsuranceUpdateDTO](#insuranceupdatedto) | [InsurancePolicyResDTO](#insurancepolicyresdto) |
| `/api/insurance/delete/{id}` | `DELETE` | `ADMIN` | None (Path ID) | `void` (200 OK) |

> [!WARNING]
> In `SecurityConfig.java`, `/api/insurance/update/{id}` is restricted to `HttpMethod.PUT`, but in `InsurancePolicyController.java` it is mapped to `@PatchMapping`. If you get a `403 Forbidden` on update, try changing the request method to `PUT` or verify if the filter chain matcher needs updating to match `PATCH`.

---

### 5. Add-On Controller (`/api/addon`)

| Endpoint | Method | Role Required | Request Body DTO | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/addon/all` | `GET` | Public | None | `List<PolicyAddOn>` (Model) |
| `/api/addon/by-id/{id}` | `GET` | Public | None (Path ID) | `PolicyAddOn` (Model) |
| `/api/addon/insert` | `POST` | `ADMIN` | [AddOnReqDTO](#addonreqdto) | `void` (200 OK) |
| `/api/addon/update/{id}` | `PATCH` | `ADMIN` | [AddOnUpdatedDTO](#addonupdateddto) | `void` (200 OK) |
| `/api/addon/delete/{id}` | `DELETE` | `ADMIN` | None (Path ID) | `void` (200 OK) |

---

### 6. Document Controller (`/api/documents`)

| Endpoint | Method | Role Required | Request Parameters | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/documents/customer/upload` | `POST` | Authenticated | Multipart Form: `file`, `documentType` | [DocumentResDTO](#documentresdto) |
| `/api/documents/customer` | `GET` | Authenticated | None | `List<CustomerDocumentDTO>` |
| `/api/documents/{id}` | `GET` | Authenticated | None (Path ID) | Binary Stream (File view) |
| `/api/documents/vehicle/{vehicleId}/upload` | `POST` | Authenticated | Path ID; Multipart: `file`, `documentType` | [DocumentResDTO](#documentresdto) |
| `/api/documents/vehicle/{vehicleId}` | `GET` | Authenticated | None (Path ID) | `List<VehicleDocumentDTO>` |
| `/api/documents/proposal/{proposalId}/upload` | `POST` | Authenticated | Path ID; Multipart: `file`, `documentType` | [DocumentResDTO](#documentresdto) |

*Available `DocumentType` Enums*: `AADHAAR`, `PAN`, `DRIVING_LICENSE`, `RC_BOOK`, `POLLUTION_CERTIFICATE`, `FITNESS_CERTIFICATE`, `PERMIT`, `ROAD_TAX_RECEIPT`, `POLICY_PDF`, `CLAIM_IMAGE`, `CLAIM_REPORT`.

---

### 7. Policy Proposal Controller (`/api/policyproposal`)

| Endpoint | Method | Role Required | Request Body DTO | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/policyproposal/create` | `POST` | `CUSTOMER` | [PolicyProposalCreateDTO](#policyproposalcreatedto) | [PolicyProposalResDTO](#policyproposalresdto) |
| `/api/policyproposal/submitted` | `GET` | `INSURANCE_OFFICER` | None | `List<ProposalSummaryDTO>` |
| `/api/policyproposal/{id}` | `GET` | `INSURANCE_OFFICER` | None (Path ID) | [OfficerProposalListDTO](#officerproposallistdto) |
| `/api/policyproposal/customer/all` | `GET` | `CUSTOMER` | None | `List<ProposalSummaryDTO>` |
| `/api/policyproposal/officer/all` | `GET` | `INSURANCE_OFFICER` | None | `List<ProposalSummaryDTO>` |
| `/api/policyproposal/{proposalId}/resubmit` | `PATCH` | `CUSTOMER` | [ProposalResubmitDTO](#proposalresubmitdto) | `void` (200 OK) |

---

### 8. Quote Controller (`/api/quote`)

| Endpoint | Method | Role Required | Request Body DTO | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/quote/create` | `POST` | `INSURANCE_OFFICER` | [QuoteReqDTO](#quotereqdto) | `void` (200 OK) |
| `/api/quote/customer` | `GET` | `CUSTOMER` | None | `List<QuoteResDTO>` |

---

### 9. Payment Controller (`/api/payment`)

| Endpoint | Method | Role Required | Request Body DTO | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/payment/` | `POST` | `CUSTOMER` | [PaymentReqDTO](#paymentreqdto) | `void` (200 OK) |

---

### 10. Officer Controller (`/api/officer`)

| Endpoint | Method | Role Required | Request Body DTO | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/officer/me` | `GET` | `INSURANCE_OFFICER` | None | [OfficerResDTO](#officerresdto) |
| `/api/officer/me/update` | `PATCH` | `INSURANCE_OFFICER` | [OfficerUpdateReqDTO](#officerupdatereqdto) | [OfficerResDTO](#officerresdto) |
| `/api/officer/proposal/additional-details/{id}` | `PATCH` | `INSURANCE_OFFICER` | [AdditionalDetailsRequiredDTO](#additionaldetailsrequireddto) | `void` (200 OK) |

---

### 11. Notification Controller (`/api/notification`)

| Endpoint | Method | Role Required | Request Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/notification/fetch` | `GET` | Authenticated | None | `List<NotificationLogResDTO>` |
| `/api/notification/delete/{id}` | `DELETE` | Authenticated | None (Path ID) | `void` (200 OK) |

---

## 📝 Request & Response DTO Specifications

### Authentication DTOs

#### `AdminReqDTO`
```json
{
  "username": "admin123",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### `CustomerReqDTO`
```json
{
  "name": "John Doe",
  "address": "123 Main Street, City",
  "dob": "1990-01-01",
  "aadhaarNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "password123"
}
```

#### `OfficerSignupReqDTO`
```json
{
  "username": "officer123",
  "email": "officer@example.com",
  "password": "password123",
  "name": "Officer Name",
  "jobTitle": "MANAGER" // Enums: ASSOCIATE_EXECUTIVE, MANAGER, SENIOR_EXECUTIVE, TECHNICAL_EXECUTIVE
}
```

#### `TokenDTO`
```json
{
  "username": "johndoe",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

### Customer & Vehicle DTOs

#### `CustomerUpdateReqDTO`
```json
{
  "name": "John Doe Updated",
  "address": "456 New Road",
  "dob": "1990-01-01",
  "aadhaarNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

#### `CustomerResDTO`
```json
{
  "id": 1,
  "name": "John Doe",
  "address": "123 Main Street, City",
  "dob": "1990-01-01",
  "aadhaarNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "userName": "johndoe",
  "documents": [
    {
      "documentId": 1,
      "documentType": "AADHAAR",
      "originalFileName": "aadhaar.png"
    }
  ]
}
```

#### `VehicleReqDTO` / `VehicleUpdateReqDTO`
```json
{
  "category": "CAR", // Enums: TRUCK, MOTORCYCLE, CAMPER_VAN, CAR, BIKE
  "registrationNumber": "MH12AB1234",
  "chassisNumber": "CHA1234567890",
  "engineNumber": "ENG123456",
  "manufacturer": "Honda",
  "model": "Civic",
  "variant": "ZX",
  "manufactureYear": 2022,
  "registrationDate": "2022-05-15",
  "fuelType": "PETROL", // Enums: PETROL, DIESEL, CNG, LPG, ELECTRIC, HYBRID
  "engineCapacityCc": 1498,
  "seatingCapacity": 5,
  "usage": "PRIVATE", // Enums: PRIVATE, COMMERCIAL
  "exShowroomPrice": 1800000.00,
  "currentIdv": 1400000.00,
  "ownerCount": 1,
  "condition": "EXCELLENT", // Enums: EXCELLENT, GOOD, FAIR, POOR, DAMAGED
  "currentOdometerKm": 15000,
  "modifiedVehicle": false,
  "accidentHistory": false,
  "accidentCount": 0,
  "previousInsurer": "National Insurance",
  "previousPolicyNumber": "POL987654",
  "previousPolicyExpiryDate": "2025-05-14",
  "noClaimBonusPercentage": 20
}
```

#### `VehicleResDTO`
```json
{
  "id": 1,
  "category": "CAR",
  "registrationNumber": "MH12AB1234",
  "chassisNumber": "CHA1234567890",
  "engineNumber": "ENG123456",
  "manufacturer": "Honda",
  "model": "Civic",
  "variant": "ZX",
  "manufactureYear": 2022,
  "registrationDate": "2022-05-15",
  "fuelType": "PETROL",
  "engineCapacityCc": 1498,
  "seatingCapacity": 5,
  "usage": "PRIVATE",
  "exShowroomPrice": 1800000.00,
  "currentIdv": 1400000.00,
  "ownerCount": 1,
  "condition": "EXCELLENT",
  "currentOdometerKm": 15000,
  "modifiedVehicle": false,
  "accidentHistory": false,
  "accidentCount": 0,
  "previousInsurer": "National Insurance",
  "previousPolicyNumber": "POL987654",
  "previousPolicyExpiryDate": "2025-05-14",
  "noClaimBonusPercentage": 20,
  "customerName": "John Doe",
  "documents": [
    {
      "documentId": 2,
      "documentType": "RC_BOOK",
      "originalFileName": "rc_book.pdf"
    }
  ]
}
```

---

### Insurance Policy & Add-On DTOs

#### `InsuranceDTO`
```json
{
  "policyName": "Comprehensive Vehicle Protection",
  "description": "Full coverage policy including third party liability and own damage",
  "baseRate": 5000.00,
  "validityMonths": 12
}
```

#### `InsuranceUpdateDTO`
```json
{
  "policyName": "Comprehensive Vehicle Protection Updated",
  "description": "Updated policy description",
  "baseRate": 5500.00,
  "validityMonths": 12,
  "active": true
}
```

#### `InsurancePolicyResDTO`
```json
{
  "id": 1,
  "policyName": "Comprehensive Vehicle Protection",
  "description": "Full coverage policy including third party liability and own damage",
  "baseRate": 5000.00,
  "validityMonths": 12,
  "active": true,
  "createdAt": "2026-06-02T02:00:00Z",
  "updatedAt": "2026-06-02T02:00:00Z"
}
```

#### `AddOnReqDTO` / `AddOnUpdatedDTO`
```json
{
  "name": "Zero Depreciation",
  "description": "Covers the depreciation value of replaced parts",
  "additionalCost": 2500.00
}
```

---

### Proposal & Quote DTOs

#### `PolicyProposalCreateDTO`
```json
{
  "vehicleId": 1,
  "policyId": 1,
  "documentIds": [1, 2],
  "addOnIds": [1]
}
```

#### `PolicyProposalResDTO`
```json
{
  "id": 1,
  "status": "SUBMITTED", // Enums: SUBMITTED, ADDITIONAL_DETAILS_REQUIRED, APPROVED, REJECTED, ACTIVE, EXPIRED
  "submissionAt": "2026-06-02T02:10:00Z"
}
```

#### `ProposalResubmitDTO`
```json
{
  "documentIds": [1, 2, 3]
}
```

#### `AdditionalDetailsRequiredDTO`
```json
{
  "officerRemark": "Please upload a clearer image of your RC Book."
}
```

#### `OfficerProposalListDTO`
```json
{
  "proposalId": 1,
  "customerName": "John Doe",
  "customerAddress": "123 Main Street, City",
  "customerPan": "ABCDE1234F",
  "customerAadhaar": "123456789012",
  "policyName": "Comprehensive Vehicle Protection",
  "policyPrice": 5000.00,
  "vehicleNumber": "MH12AB1234",
  "manufacturer": "Honda",
  "model": "Civic",
  "variant": "ZX",
  "category": "CAR",
  "manufactureYear": 2022,
  "registrationDate": "2022-05-15",
  "fuelType": "PETROL",
  "engineCapacityCc": 1498,
  "seatingCapacity": 5,
  "usage": "PRIVATE",
  "currentIdv": 1400000.00,
  "ownerCount": 1,
  "condition": "EXCELLENT",
  "currentOdometerKm": 15000,
  "modifiedVehicle": false,
  "accidentHistory": false,
  "accidentCount": 0,
  "previousInsurer": "National Insurance",
  "noClaimBonusPercentage": 20,
  "addOns": [
    {
      "name": "Zero Depreciation",
      "additionalCost": 2500.00
    }
  ],
  "customerDocuments": [],
  "vehicleDocuments": [],
  "proposalDocuments": [],
  "officerRemark": "Document checks pending",
  "status": "SUBMITTED",
  "submittedAt": "2026-06-02T02:10:00Z"
}
```

#### `QuoteReqDTO`
```json
{
  "proposalId": 1,
  "calculatedAmount": 8750.50
}
```

#### `QuoteResDTO`
```json
{
  "quoteId": 1,
  "proposalId": 1,
  "policyName": "Comprehensive Vehicle Protection",
  "quotedPrice": 8750.50
}
```

#### `PaymentReqDTO`
```json
{
  "quoteId": 1
}
```
