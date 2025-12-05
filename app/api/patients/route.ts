import { type NextRequest, NextResponse } from "next/server"
import { getAuthHeader, isApiKeyConfigured, getClinikoBaseUrl } from "@/lib/cliniko-client"

const CLINIKO_API_KEY = process.env.CLINIKO_API_KEY

export async function GET(request: NextRequest) {
  try {
    if (!isApiKeyConfigured(CLINIKO_API_KEY)) {
      console.error(" CLINIKO_API_KEY environment variable not set or empty")
      return NextResponse.json(
        {
          error: "API key not configured. Please add CLINIKO_API_KEY to .env.local",
          details: "The server is missing the required Cliniko API key configuration.",
        },
        { status: 500 },
      )
    }

    const CLINIKO_BASE_URL = getClinikoBaseUrl(CLINIKO_API_KEY)

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get("page") || "1"
    const perPage = searchParams.get("per_page") || "50"

    const url = `${CLINIKO_BASE_URL}/patients?page=${page}&per_page=${perPage}`
    console.log(` Fetching patients from: ${url}`)

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
      const errorData = await response.text()
      console.error(" Cliniko API Error:", response.status, errorData)

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
          details: "Check your API key and ensure your Cliniko account is active.",
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log(` Successfully fetched ${data.patients?.length || 0} patients`)

    // Extract relevant patient fields
    const patients = (data.patients || []).map((patient: any) => ({
      id: patient.id,
      first_name: patient.first_name,
      last_name: patient.last_name,
      email: patient.email,
      phone_number: patient.phone_number,
      mobile_number: patient.mobile_number,
    }))

    return NextResponse.json({
      patients,
      total_entries: data.total_entries,
      links: data.links,
    })
  } catch (error) {
    console.error(" API Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: "Failed to fetch patients",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
