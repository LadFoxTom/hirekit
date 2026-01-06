# CV Saving Setup Guide

## Overview

The CV saving functionality has been fixed and now properly integrates with PostgreSQL using Prisma. This guide explains how to set up and use the CV saving feature.

## Current Implementation

### ✅ **Fixed Issues:**

1. **Database Integration**: Now uses PostgreSQL with Prisma instead of in-memory storage
2. **User Management**: Proper user creation and management in database
3. **Authentication**: Fixed session handling to use proper user IDs
4. **CV API**: Updated to use user ID instead of email for database operations

### **Database Schema**

The system uses the following Prisma schema:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  // ... other fields
  cvs       CV[]
  subscription Subscription?
}

model CV {
  id          String   @id @default(cuid())
  title       String
  content     Json     // CVData structure
  template    String
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Setup Instructions

### 1. Database Setup

#### **Option A: Local PostgreSQL (Recommended for Development)**

1. **Install PostgreSQL**:
   ```bash
   # Windows (using chocolatey)
   choco install postgresql
   
   # macOS
   brew install postgresql
   
   # Ubuntu
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Create Database**:
   ```bash
   # Start PostgreSQL
   sudo service postgresql start  # Linux
   brew services start postgresql  # macOS
   
   # Create database
   createdb cv_builder
   ```

3. **Set Environment Variables**:
   ```bash
   # Copy env.example to .env.local
   cp env.example .env.local
   
   # Update DATABASE_URL in .env.local
   DATABASE_URL="postgresql://username:password@localhost:5432/cv_builder"
   ```

#### **Option B: Supabase (Recommended for Production)**

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get your database URL

2. **Update Environment Variables**:
   ```bash
   # In .env.local
   DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
   ```

### 2. Database Migration

1. **Install Dependencies**:
   ```bash
   npm install @prisma/client @next-auth/prisma-adapter
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev
   ```

4. **Seed Database (Optional)**:
   ```bash
   npx prisma db seed
   ```

### 3. Environment Configuration

Create `.env.local` with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cv_builder"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Other variables from env.example...
```

### 4. Testing the Setup

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```

2. **Login to Test Account**:
   - Go to `/auth/login`
   - Use credentials: `admin@admin.com` / `admin`
   - This will create a test user in the database

3. **Test CV Saving**:
   - Go to `/builder`
   - Fill in some CV data
   - Click "Save CV"
   - Should see success message

## How CV Saving Works

### **Save Process:**

1. **User Authentication**: User must be logged in
2. **Data Validation**: CV data is validated on the server
3. **Database Storage**: CV is saved to PostgreSQL database
4. **Response**: Success/error message returned to client

### **API Endpoints:**

- `POST /api/cv` - Create new CV
- `GET /api/cv` - Get user's CVs
- `PUT /api/cv/[id]` - Update existing CV
- `DELETE /api/cv/[id]` - Delete CV

### **Database Operations:**

```typescript
// Create CV
const cv = await CVService.createCV(
  userId,        // User ID from session
  title,         // CV title
  content,       // CV data object
  template       // Template name
);

// Get user's CVs
const cvs = await CVService.getUserCVs(userId);

// Update CV
const updatedCV = await CVService.updateCV(cvId, userId, updates);
```

## Troubleshooting

### **Common Issues:**

#### **1. "Authentication required" Error**
- **Cause**: User not logged in
- **Solution**: Login first, then try saving

#### **2. "Failed to create CV" Error**
- **Cause**: Database connection issue
- **Solution**: 
  - Check DATABASE_URL in .env.local
  - Ensure PostgreSQL is running
  - Run `npx prisma migrate dev`

#### **3. "CV with this name already exists" Error**
- **Cause**: Duplicate CV title
- **Solution**: Use a different title for the CV

#### **4. Database Connection Errors**
- **Cause**: Wrong database URL or database not running
- **Solution**:
  ```bash
  # Check if PostgreSQL is running
  sudo service postgresql status
  
  # Test database connection
  npx prisma db push
  ```

### **Debug Steps:**

1. **Check Database Connection**:
   ```bash
   npx prisma studio
   ```

2. **Check Environment Variables**:
   ```bash
   # Ensure .env.local exists and has correct values
   cat .env.local
   ```

3. **Check Logs**:
   ```bash
   # Look for database errors in console
   npm run dev
   ```

4. **Test Database Directly**:
   ```bash
   # Connect to database
   psql -d cv_builder
   
   # Check tables
   \dt
   
   # Check users
   SELECT * FROM "User";
   ```

## Migration from In-Memory to Database

### **What Changed:**

1. **User Storage**: From Map to PostgreSQL
2. **CV Storage**: From localStorage to database
3. **Authentication**: From simple to NextAuth with database
4. **Session Management**: Proper JWT sessions

### **Benefits:**

- ✅ **Persistent Storage**: CVs saved permanently
- ✅ **Multi-Device Access**: Access CVs from anywhere
- ✅ **User Management**: Proper user accounts
- ✅ **Scalability**: Can handle many users
- ✅ **Security**: Proper authentication and authorization

## Production Deployment

### **For Production:**

1. **Use Supabase or similar**:
   ```bash
   DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
   ```

2. **Set proper secrets**:
   ```bash
   NEXTAUTH_SECRET="your-production-secret"
   NEXTAUTH_URL="https://yourdomain.com"
   ```

3. **Enable Google OAuth**:
   - Create Google OAuth app
   - Add client ID and secret to environment

4. **Database Backups**:
   - Set up automated backups
   - Monitor database performance

## Next Steps

### **Future Enhancements:**

1. **CV Versioning**: Save multiple versions of CVs
2. **CV Sharing**: Share CVs with others
3. **CV Templates**: User-created templates
4. **CV Analytics**: Track CV views and downloads
5. **Auto-save**: Save CV automatically every few minutes

### **Integration with Supabase:**

If you want to switch to Supabase:

1. **Update DATABASE_URL** to Supabase connection string
2. **Add Supabase client** for real-time features
3. **Use Supabase Auth** instead of NextAuth (optional)
4. **Enable Row Level Security** for better security

## Conclusion

The CV saving functionality is now properly implemented with PostgreSQL and Prisma. Users can save their CVs permanently, access them from multiple devices, and manage their data securely.

For any issues, check the troubleshooting section above or contact the development team. 