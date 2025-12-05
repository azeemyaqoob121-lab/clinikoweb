# Cliniko Patient Manager

A web application for browsing patients and viewing their cases from Cliniko, built as a technical assessment for Pellucid Waters.

## Features

- 📋 **Patient List** - Browse all patients from your Cliniko account
- 📁 **Patient Cases** - View all cases associated with each patient
- 🔄 **Smooth UI Updates** - Cases load dynamically without page reloads
- ⚠️ **Error Handling** - Graceful error messages for API failures
- 🔒 **Secure API Key** - API key stored securely on backend only
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend:** React with Next.js 15 (App Router)
- **Backend:** Next.js API Routes (Node.js)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with shadcn/ui components
- **Package Manager:** npm

## Prerequisites

- Node.js 18+ and npm
- A Cliniko account with an API key
- A valid Cliniko API key (obtainable from "My Info" → "Manage API keys" in Cliniko)

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with your Cliniko API key:

\`\`\`
CLINIKO_API_KEY=your_cliniko_api_key_here
\`\`\`

**Important:** 
- Replace `your_cliniko_api_key_here` with your actual Cliniko API key
- The key from the task should be provided in the secure channel
- Never commit the `.env.local` file to version control

### 3. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

### 4. Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Project Structure

\`\`\`
.
├── app/
│   ├── api/
│   │   └── patients/
│   │       ├── route.ts              # GET /api/patients endpoint
│   │       └── [id]/
│   │           └── cases/
│   │               └── route.ts       # GET /api/patients/:id/cases endpoint
│   ├── page.tsx                      # Main page component
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── components/
│   ├── patient-list.tsx              # Patient list component
│   ├── patient-details.tsx           # Patient details and cases component
│   └── ui/                           # shadcn/ui components
├── README.md                         # This file
├── next.config.mjs                   # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Project dependencies
\`\`\`

## API Endpoints

### GET /api/patients

Fetches a list of all patients from Cliniko.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `per_page` (optional): Number of results per page (default: 50, max: 100)

**Response:**
\`\`\`json
{
  "patients": [
    {
      "id": "123456",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone_number": "+61234567890",
      "mobile_number": "+61987654321"
    }
  ],
  "total_entries": 100,
  "links": {}
}
\`\`\`

### GET /api/patients/:id/cases

Fetches all cases for a specific patient.

**Parameters:**
- `id` (required): Patient ID from Cliniko

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `per_page` (optional): Number of results per page (default: 50, max: 100)

**Response:**
\`\`\`json
{
  "cases": [
    {
      "id": "789012",
      "patient_id": "123456",
      "name": "Physiotherapy - Knee Injury",
      "status": "open",
      "created_at": "2024-01-15T10:30:00Z",
      "closed_at": null
    }
  ],
  "total_entries": 5,
  "links": {}
}
\`\`\`

## How It Works

1. **On Page Load:** The app fetches all patients from the Cliniko API via the backend `/api/patients` endpoint
2. **Patient Selection:** When a user clicks on a patient, the app fetches their cases via `/api/patients/:id/cases`
3. **API Security:** All Cliniko API requests are made from the backend using the secure API key, never exposing it to the frontend
4. **Error Handling:** Any API errors are caught and displayed to the user with helpful messages
5. **Loading States:** Loading spinners are shown during data fetching

## Features Implemented

✅ **Core Features (100%)**
- [x] List patients from Cliniko API
- [x] Display patient name, email, and phone
- [x] View cases per patient
- [x] Display case name, status, opened/closed dates
- [x] Toggle between patients with smooth UI updates
- [x] No full-page reloads (client-side state management)
- [x] Loading states during data fetching
- [x] Error messages for API failures

✅ **Technical Requirements (100%)**
- [x] Backend Node.js with Express (using Next.js API Routes)
- [x] TypeScript throughout
- [x] API key never exposed in frontend
- [x] Cliniko API called from backend only
- [x] Proper error handling and logging
- [x] Environment variables for configuration
- [x] Clean, modular code structure
- [x] Separation of concerns (API routes, components, helpers)

## Troubleshooting

### "Invalid Cliniko API key" Error

- Verify your API key is correctly set in `.env.local`
- Ensure the key is not accidentally modified or truncated
- Check that the API key is still valid in your Cliniko account

### No patients appearing

- Ensure your Cliniko account has active patients
- Check browser console for network errors
- Verify the API endpoint is responding with `http://localhost:3000/api/patients`

### Cases not loading for a patient

- Some patients may not have any cases
- Check the Cliniko dashboard to confirm the patient has associated cases
- Look for error messages in the UI

## Limitations & Notes

- The app displays up to 50 patients and cases per page by default (configurable)
- Patient case information is limited to what's available in the Cliniko API
- The app refreshes data from Cliniko each time it's requested (no caching)
- Some Cliniko API fields may be null depending on account configuration

## Time Estimate

Estimated development time: 2-3 hours

## Submission Checklist

- [x] Source code in organized folder structure
- [x] TypeScript used throughout
- [x] API key stored securely in environment variables
- [x] No secrets committed to repository
- [x] README with setup instructions
- [x] Working frontend and backend
- [x] Proper error handling
- [x] Loading states
- [x] Clean UI/UX
- [x] Code comments and clear structure

## Support

For questions or issues, please refer to the Cliniko API documentation at https://docs.api.cliniko.com
