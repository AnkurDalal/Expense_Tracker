# Expense Tracker Backend API

A comprehensive backend API for managing personal finances with enhanced security, validation, and analytics features.

## 🚀 New Features & Improvements

### Security Enhancements
- **Rate Limiting**: Implemented rate limiting for all API endpoints
- **CORS Configuration**: Enhanced CORS settings with proper origin handling
- **Helmet Security**: Added security headers using Helmet middleware
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Improved error handling with consistent response format

### New API Endpoints

#### Authentication (`/api/v1/auth/`)
- `POST /register` - User registration with validation
- `POST /login` - User login with validation
- `GET /getUser` - Get user information
- `PUT /update-profile` - Update user profile
- `POST /change-password` - Change user password
- `POST /upload-image` - Upload profile image

#### Income Management (`/api/v1/income/`)
- `POST /add` - Add new income with validation
- `GET /get` - Get all income with pagination and filtering
- `GET /get/:id` - Get income by ID
- `PUT /update/:id` - Update income with validation
- `DELETE /delete/:id` - Delete income
- `GET /summary` - Get income summary and analytics
- `GET /downloadexcel` - Download income data as Excel

#### Expense Management (`/api/v1/expense/`)
- `POST /add` - Add new expense with validation
- `GET /get` - Get all expenses with pagination and filtering
- `GET /get/:id` - Get expense by ID
- `PUT /update/:id` - Update expense with validation
- `DELETE /delete/:id` - Delete expense
- `GET /summary` - Get expense summary and analytics
- `GET /downloadexcel` - Download expense data as Excel

#### Dashboard (`/api/v1/dashboard/`)
- `GET /` - Get comprehensive dashboard data
- `GET /summary` - Get lightweight dashboard summary

### Enhanced Features

#### Pagination & Filtering
- All list endpoints support pagination (`page`, `limit` parameters)
- Date range filtering for income and expense endpoints
- Consistent pagination response format

#### Analytics & Reporting
- Monthly trend analysis for income and expenses
- Category-wise expense breakdown
- Source-wise income breakdown
- Savings rate calculation
- Enhanced dashboard with detailed analytics

#### Data Export
- Excel export for income and expense data
- Date range filtering for exports
- Proper file naming and download handling

## 📦 Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```

## 🔧 Configuration

Create a `.env` file in the backend directory with the following variables:

```env
PORT=8000
MONGOURI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## 🏃‍♂️ Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 🛡️ Security Features

### Rate Limiting
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **General API endpoints**: 100 requests per 15 minutes per IP
- **Password reset**: 3 requests per hour per IP

### Input Validation
- Email format validation
- Password strength requirements (min 6 chars, uppercase, lowercase, number)
- Name length and character validation
- Amount validation (must be positive numbers)
- Date format validation

### Error Handling
- Consistent error response format
- No sensitive information leaked in production
- Proper HTTP status codes
- Detailed error messages in development

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## 🔑 Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📈 Dashboard Analytics

The dashboard provides comprehensive financial insights:

- **Summary**: Total balance, income, expenses, and savings rate
- **Recent Activity**: Last 30 days expenses and 60 days income
- **Analytics**: Monthly trends, top categories, and income sources
- **Recent Transactions**: Combined view of latest income and expense transactions

## 🔄 Data Export

### Excel Export
Both income and expense data can be exported to Excel format with:
- Date range filtering
- Proper column headers
- Formatted dates
- Automatic file download

## 🧪 Testing

The API includes comprehensive validation and error handling. Test endpoints using tools like Postman or curl.

## 📝 Changelog

### Version 2.0.0
- Added comprehensive input validation
- Implemented rate limiting
- Enhanced security with Helmet
- Added pagination and filtering
- Improved error handling
- Added new API endpoints for updates and analytics
- Enhanced dashboard with detailed analytics
- Added Excel export functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.