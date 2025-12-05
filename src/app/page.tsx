"use client"

import { useState, useEffect } from "react"
import PatientList from "@/src/components/patient-list"
import PatientDetails from "@/src/components/patient-details"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2, Users, Stethoscope } from "lucide-react"

interface Patient {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone_number: string | null
  mobile_number: string | null
}

interface PatientCase {
  id: string
  patient_id: string
  name: string | null
  status: string | null
  created_at: string
  closed_at: string | null
}

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [cases, setCases] = useState<PatientCase[]>([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [loadingCases, setLoadingCases] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setError(null)
        const response = await fetch("/api/patients")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch patients")
        }
        const data = await response.json()
        setPatients(data.patients || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
        console.error("Error fetching patients:", err)
      } finally {
        setLoadingPatients(false)
      }
    }

    fetchPatients()
  }, [])

  useEffect(() => {
    if (!selectedPatient) {
      setCases([])
      return
    }

   const fetchCases = async () => {
  try {
    setLoadingCases(true)
    setError(null)
    
    const response = await fetch(`/api/patients/${selectedPatient.id}/cases`)
    
    if (!response.ok) {
      const errorData = await response.json()
      // If it's a 404, it just means no cases exist
      if (response.status === 404) {
        console.log('No cases found for patient')
        setCases([])
        return
      }
      throw new Error(errorData.error || "Failed to fetch cases")
    }
    
    const data = await response.json()
    setCases(data.cases || [])
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong")
    console.error("Error fetching cases:", err)
  } finally {
    setLoadingCases(false)
  }
}

    fetchCases()
  }, [selectedPatient])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cliniko Manager</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Patient Management System</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{patients.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Active Patients</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="h-full overflow-hidden flex flex-col bg-white dark:bg-slate-800 shadow-lg border-0">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-teal-600">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Patients</h2>
                  <span className="ml-auto bg-white/20 px-2 py-1 rounded text-xs font-semibold text-white">
                    {patients.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                {loadingPatients ? (
                  <div className="flex items-center justify-center flex-1 py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
                  </div>
                ) : patients.length === 0 ? (
                  <div className="flex items-center justify-center flex-1 p-4 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No patients found</p>
                  </div>
                ) : (
                  <div className="overflow-y-auto">
                    <PatientList
                      patients={patients}
                      selectedPatient={selectedPatient}
                      onSelectPatient={setSelectedPatient}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {selectedPatient ? (
              <PatientDetails patient={selectedPatient} cases={cases} loadingCases={loadingCases} />
            ) : (
              <Card className="h-full min-h-96 flex items-center justify-center bg-white dark:bg-slate-800 shadow-lg border-0">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900 dark:to-teal-900 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">Select a Patient</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Choose from the patient list to view details
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
