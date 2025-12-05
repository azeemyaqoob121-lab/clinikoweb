import { type NextRequest, NextResponse } from "next/server"
import { getAuthHeader, isApiKeyConfigured, getClinikoBaseUrl } from "@/lib/cliniko-client"

const CLINIKO_API_KEY = process.env.CLINIKO_API_KEY

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isApiKeyConfigured(CLINIKO_API_KEY)) {
      console.error(" CLINIKO_API_KEY environment variable not set")
      return NextResponse.json(
        {
          error: "API key not configured. Please add CLINIKO_API_KEY to .env.local",
          details: "The server is missing the required Cliniko API key configuration.",
        },
        { status: 500 },
      )
    }

    const CLINIKO_BASE_URL = getClinikoBaseUrl(CLINIKO_API_KEY)
    const patientId = params.id
    console.log(` Fetching cases for patient: ${patientId}`)

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get("page") || "1"
    const perPage = searchParams.get("per_page") || "50"

    // ✅ CORRECT ENDPOINT: Based on Cliniko API documentation
    // The correct endpoint is using "patient_cases" with patient_id filter
    const url = `${CLINIKO_BASE_URL}/patient_cases?patient_id=${patientId}&page=${page}&per_page=${perPage}`
    
    console.log(` Fetching from: ${url}`)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(CLINIKO_API_KEY),
        Accept: "application/json",
        "User-Agent": "Cliniko-Patient-Manager/1.0",
      },
    })

    console.log(` Cliniko API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(" Cliniko API Error:", response.status, errorText)

      // Try to parse error for better message
      let errorJson
      try {
        errorJson = JSON.parse(errorText)
      } catch {
        errorJson = { error: errorText }
      }

      if (response.status === 404) {
        // If patient_cases returns 404, the patient might not have cases
        // Return empty array instead of error
        console.log(` No cases found for patient ${patientId}, returning empty array`)
        return NextResponse.json({
          cases: [],
          total_entries: 0,
          links: {},
          message: "No cases found for this patient"
        })
      }

      if (response.status === 400) {
        return NextResponse.json(
          {
            error: "Bad request to Cliniko API",
            details: `Invalid patient ID: ${patientId}`,
            clinikoError: errorJson,
          },
          { status: 400 },
        )
      }

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: "Invalid or expired Cliniko API key. Please check your credentials.",
            details: "The API key provided is either invalid or has expired.",
          },
          { status: 401 },
        )
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please try again later.",
            details: "Too many requests have been made. Please wait before retrying.",
          },
          { status: 429 },
        )
      }

      return NextResponse.json(
        {
          error: `Cliniko API error: ${response.status}`,
          details: errorJson.error || "Failed to fetch cases",
          clinikoError: errorJson,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log(` Successfully fetched ${data.patient_cases?.length || 0} cases`)

    // Extract relevant case fields - property name is 'patient_cases'
    const cases = (data.patient_cases || []).map((patientCase: any) => ({
      id: patientCase.id,
      patient_id: patientCase.patient_id,
      name: patientCase.name,
      status: patientCase.status,
      created_at: patientCase.created_at,
      closed_at: patientCase.closed_at,
    }))

    return NextResponse.json({
      cases,
      total_entries: data.total_entries || cases.length,
      links: data.links || {},
    })
  } catch (error) {
    console.error(" API Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    // Return empty cases array on any error to prevent frontend crash
    return NextResponse.json({
      cases: [],
      total_entries: 0,
      links: {},
      error: "Failed to fetch cases, returning empty array",
      details: errorMessage,
    })
  }
}