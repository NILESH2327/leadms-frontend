# LeadMS Frontend API Contract Documentation

This document details the frontend integration contract with the LeadMS REST API backend.

**Base URL**: `https://leadcrmintern-ss-v1.vercel.app/api`

---

## 1. Authentication Endpoints (`/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/auth/register`
- **Auth Required**: No
- **Roles**: All (Self-registration restricted to `vendor` or `trader`)
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecretPassword123",
    "role": "vendor" // or "trader"
  }
  ```
- **Response Shape**:
  ```json
  {
    "message": "Registration successful. Please check your email to confirm registration.",
    "user": {
      "id": "60d5ec49f1b2c81128d54770",
      "email": "john@example.com",
      "role": "vendor"
    }
  }
  ```

### 1.2 Confirm Email
- **Method**: `GET`
- **Path**: `/auth/confirm-email?token=TOKEN`
- **Auth Required**: No

### 1.3 Login
- **Method**: `POST`
- **Path**: `/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecretPassword123"
  }
  ```
- **Response Shape**:
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "d8a1f8c4...",
    "user": {
      "id": "60d5ec49f1b2c81128d54770",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "vendor"
    }
  }
  ```

### 1.4 Refresh Token
- **Method**: `POST`
- **Path**: `/auth/refresh-token`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "refreshToken": "d8a1f8c4..."
  }
  ```
- **Response Shape**:
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "e9b2g9d5..."
  }
  ```

### 1.5 Logout
- **Method**: `POST`
- **Path**: `/auth/logout`
- **Auth Required**: Yes (`Bearer <accessToken>`)

### 1.6 Forgot Password
- **Method**: `POST`
- **Path**: `/auth/forgot-password`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```

### 1.7 Reset Password
- **Method**: `POST`
- **Path**: `/auth/reset-password`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "token": "RESET_TOKEN",
    "newPassword": "NewSecretPassword123"
  }
  ```

### 1.8 Invite Team Member
- **Method**: `POST`
- **Path**: `/auth/invite-team-member` (or `/auth/invite`)
- **Auth Required**: Yes (`vendor`)
- **Request Body**:
  ```json
  {
    "email": "teammember@example.com",
    "designation": "Sales Associate"
  }
  ```

### 1.9 Accept Invitation
- **Method**: `POST`
- **Path**: `/auth/accept-invitation`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "token": "INVITATION_TOKEN",
    "firstName": "Alice",
    "lastName": "Smith",
    "password": "Password123"
  }
  ```

---

## 2. Product Endpoints (`/products`)

### 2.1 Trader Products (Create)
- **Method**: `POST`
- **Path**: `/products/trader` (or `/products`)
- **Auth Required**: Yes (`trader`)
- **Request Body**:
  ```json
  {
    "name": "MRI Scanner 3.0T",
    "description": "High-field magnetic resonance imaging system",
    "basePrice": 450000,
    "isActive": true
  }
  ```

### 2.2 Trader Products (List)
- **Method**: `GET`
- **Path**: `/products/trader` (or `/products`)
- **Auth Required**: Yes (`trader`)

### 2.3 Trader Products (Update)
- **Method**: `PUT`
- **Path**: `/products/trader/:id` (or `/products/:id`)
- **Auth Required**: Yes (`trader`)

### 2.4 Trader Products (Delete)
- **Method**: `DELETE`
- **Path**: `/products/trader/:id` (or `/products/:id`)
- **Auth Required**: Yes (`trader`)

### 2.5 Available Products
- **Method**: `GET`
- **Path**: `/products/available`
- **Auth Required**: Yes (`vendor`)

### 2.6 Lock Product
- **Method**: `POST`
- **Path**: `/products/:id/lock`
- **Auth Required**: Yes (`vendor`)

### 2.7 Unlock Product
- **Method**: `POST`
- **Path**: `/products/:id/unlock`
- **Auth Required**: Yes (`vendor`)

### 2.8 Locked Products
- **Method**: `GET`
- **Path**: `/products/locked`
- **Auth Required**: Yes (`vendor`, `team-member`)

---

## 3. Vendor Profile Endpoints (`/vendor`)

### 3.1 Get Profile
- **Method**: `GET`
- **Path**: `/vendor/profile`
- **Auth Required**: Yes (`vendor`)

### 3.2 Update Profile / Pricing Configuration
- **Method**: `PUT`
- **Path**: `/vendor/profile`
- **Auth Required**: Yes (`vendor`)
- **Request Body**:
  ```json
  {
    "marginPercentage": 15,
    "installationPrice": 2500,
    "miscCharges": 500
  }
  ```

---

## 4. Leads & Quote Endpoints (`/leads`)

### 4.1 Get Leads
- **Method**: `GET`
- **Path**: `/leads`
- **Auth Required**: Yes (`vendor`, `team-member`)

### 4.2 Create Lead
- **Method**: `POST`
- **Path**: `/leads`
- **Auth Required**: Yes (`vendor`, `team-member`)
- **Request Body**:
  ```json
  {
    "customerName": "St. Jude Hospital",
    "customerEmail": "procurement@stjude.org",
    "customerPhone": "+1 (555) 234-5678"
  }
  ```

### 4.3 Assign Lead
- **Method**: `PUT`
- **Path**: `/leads/:id/assign`
- **Auth Required**: Yes (`vendor`)
- **Request Body**:
  ```json
  {
    "assignedTo": "60d5ec49f1b2c81128d54770"
  }
  ```

### 4.4 Generate Quote
- **Method**: `POST`
- **Path**: `/leads/:id/quote`
- **Auth Required**: Yes (`vendor`, `team-member`)
- **Request Body**:
  ```json
  {
    "items": [
      { "productId": "prod_123", "quantity": 2 }
    ]
  }
  ```
- **Authoritative Response**:
  ```json
  {
    "baseTotal": 900000,
    "marginApplied": 135000,
    "installationPrice": 2500,
    "miscCharges": 500,
    "finalTotal": 1038000
  }
  ```

---

## 5. Admin Endpoints (`/admin`)

### 5.1 Admin Users
- **Method**: `GET`
- **Path**: `/admin/users`
- **Auth Required**: Yes (`admin`)

### 5.2 Admin Leads
- **Method**: `GET`
- **Path**: `/admin/leads`
- **Auth Required**: Yes (`admin`)

### 5.3 Admin Analytics
- **Method**: `GET`
- **Path**: `/admin/analytics`
- **Auth Required**: Yes (`admin`)
- **Response Shape**:
  ```json
  {
    "users": { "total": 45, "vendors": 20, "traders": 15, "teamMembers": 10 },
    "leads": { "total": 120, "new": 30, "quoted": 40, "accepted": 35, "rejected": 15 },
    "products": { "total": 85, "locked": 32 },
    "revenue": { "totalQuoted": 4250000, "projectedMargin": 637500 }
  }
  ```
