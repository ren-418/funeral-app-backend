# Funeral-Home Backend

A comprehensive backend service for the Funeral-Home mobile application, providing secure storage and management of funeral-related documents and checklists.

## Features

- **Secure Document Storage (Vault)**
  - Upload and store important documents (images, videos, audio, PDFs)
  - Organize documents with titles and descriptions
  - Share documents with family members
  - Secure file storage with access control

- **Checklist Management**
  - Create and manage funeral-related checklists
  - Share checklists with family members
  - Track completion status of tasks

- **User Authentication**
  - Email/password registration and login
  - Google Sign-In integration
  - Apple Sign-In integration
  - JWT-based authentication

- **Subscription Management**
  - PayPal integration for subscription payments
  - Yearly subscription model ($19.99/year)
  - Full access features for subscribed users

## Technical Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **File Storage**: Local file system with multer
- **Payment Processing**: PayPal API
- **Real-time Notifications**: Socket.io

## Installation

1. Install dependencies:
```bash
yarn install
```

2. Create required directories:
```bash
mkdir logs
mkdir uploads
```

3. Configure the application:
- Update `config.json` with your:
  - MongoDB connection string
  - JWT secret
  - PayPal API credentials
  - Server port and other settings

## Running the Application

Development mode:
```bash
yarn dev
```

## API Endpoints

### Authentication
- POST `/api/signup` - User registration
- POST `/api/login` - User login
- POST `/api/google-login` - Google authentication
- POST `/api/apple-login` - Apple authentication
- POST `/api/getUserData` - Get user profile

### Vault Management
- POST `/api/vault/create` - Create new vault item
- POST `/api/vault/getDetail` - Get vault item details
- POST `/api/vault/getAllByUser` - Get all user's vault items
- POST `/api/vault/delete` - Delete vault item
- POST `/api/vault/update` - Update vault item
- POST `/api/vault/share` - Share vault item

### Checklist Management
- POST `/api/check-list/create` - Create new checklist
- POST `/api/check-list/getDetail` - Get checklist details
- POST `/api/check-list/getAllByUser` - Get all user's checklists
- POST `/api/check-list/delete` - Delete checklist
- POST `/api/check-list/update` - Update checklist
- POST `/api/check-list/share` - Share checklist

### Subscription
- POST `/api/transaction/createOrder` - Create PayPal order
- POST `/api/transaction/captureOrder` - Process PayPal payment

## Security Features

- Rate limiting (200 requests per 15 minutes per IP)
- File type validation for uploads
- Secure password hashing
- JWT token authentication
- CORS protection

## File Upload Support

The application supports the following file types:
- Images (JPEG, PNG)
- Videos (MP4)
- Audio (MPEG)
- Documents (PDF)

## License

[Add your license information here]
