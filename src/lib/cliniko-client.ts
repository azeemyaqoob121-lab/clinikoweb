/**
 * Cliniko API Client Utility
 * Handles authentication and base configuration for Cliniko API requests
 */

export function getClinikoBaseUrl(apiKey: string): string {
  // Extract shard ID from API key (e.g., "-au5" from the end)
  const shardMatch = apiKey.match(/-([a-z]+\d+)$/)
  const shard = shardMatch ? shardMatch[1] : "au1"
  return `https://api.${shard}.cliniko.com/v1`
}

/**
 * Creates a Basic Auth header for Cliniko API authentication
 * Cliniko uses the format: API_KEY: (empty password)
 * @param apiKey - The Cliniko API key
 * @returns Basic auth header string
 */
export function getAuthHeader(apiKey: string): string {
  if (!apiKey || apiKey.trim().length === 0) {
    console.log(" WARNING: API key is empty!")
    return ""
  }

  // Format: "apikey:" encoded in base64
  const credentials = apiKey.trim() + ":"
  const encoded = Buffer.from(credentials).toString("base64")
  const authHeader = `Basic ${encoded}`

  return authHeader
}

/**
 * Makes a request to the Cliniko API
 * @param endpoint - API endpoint path (e.g., '/patients')
 * @param apiKey - The Cliniko API key
 * @param options - Additional fetch options
 * @returns Promise with the API response
 */
export async function clinikoFetch(endpoint: string, apiKey: string, options: RequestInit = {}) {
  const baseUrl = getClinikoBaseUrl(apiKey)
  const url = `${baseUrl}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: getAuthHeader(apiKey),
      Accept: "application/json",
      "User-Agent": "Cliniko-Patient-Manager/1.0",
      ...options.headers,
    },
  })

  return response
}

/**
 * Validates if an API key is configured
 * @param apiKey - The Cliniko API key
 * @returns true if key is present, false otherwise
 */
export function isApiKeyConfigured(apiKey: string | undefined): apiKey is string {
  return Boolean(apiKey && apiKey.trim().length > 0)
}
