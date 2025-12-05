"use client"

import { User, Mail, Phone } from "lucide-react"

interface Patient {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone_number: string | null
  mobile_number: string | null
}

interface PatientListProps {
  patients: Patient[]
  selectedPatient: Patient | null
  onSelectPatient: (patient: Patient) => void
}

export default function PatientList({ patients, selectedPatient, onSelectPatient }: PatientListProps) {
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {patients.map((patient) => (
        <button
          key={patient.id}
          onClick={() => onSelectPatient(patient)}
          className={`w-full text-left px-4 py-3 transition-all duration-200 ${
            selectedPatient?.id === patient.id
              ? "bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 border-l-4 border-blue-600 dark:border-blue-400"
              : "hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-900 dark:text-white truncate">
                {patient.first_name} {patient.last_name}
              </div>
              {patient.email && (
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </div>
              )}
              {(patient.phone_number || patient.mobile_number) && (
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{patient.mobile_number || patient.phone_number}</span>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
