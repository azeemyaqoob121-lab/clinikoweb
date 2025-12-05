import { Card } from "@/components/ui/card"
import { Loader2, FileText, AlertCircle, Calendar, CheckCircle2, User, Mail, Phone } from "lucide-react"

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

interface PatientDetailsProps {
  patient: Patient
  cases: PatientCase[]
  loadingCases: boolean
}

export default function PatientDetails({ patient, cases, loadingCases }: PatientDetailsProps) {
  const getStatusStyles = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "open":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950",
          border: "border-l-4 border-emerald-500",
          badge: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
          icon: "text-emerald-600 dark:text-emerald-400",
        }
      case "closed":
        return {
          bg: "bg-slate-50 dark:bg-slate-800",
          border: "border-l-4 border-slate-400",
          badge: "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200",
          icon: "text-slate-600 dark:text-slate-400",
        }
      case "archived":
        return {
          bg: "bg-amber-50 dark:bg-amber-950",
          border: "border-l-4 border-amber-500",
          badge: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200",
          icon: "text-amber-600 dark:text-amber-400",
        }
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-950",
          border: "border-l-4 border-blue-500",
          badge: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
          icon: "text-blue-600 dark:text-blue-400",
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Patient Info Card */}
      <Card className="overflow-hidden bg-white dark:bg-slate-800 shadow-lg border-0">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">
            {patient.first_name} {patient.last_name}
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {patient.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-slate-900 dark:text-white font-medium mt-1 break-all">{patient.email}</p>
              </div>
            </div>
          )}
          {(patient.phone_number || patient.mobile_number) && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Phone
                </p>
                <p className="text-slate-900 dark:text-white font-medium mt-1">
                  {patient.mobile_number || patient.phone_number}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Patient ID
              </p>
              <p className="text-slate-900 dark:text-white font-medium mt-1 font-mono text-sm">{patient.id}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Cases Section */}
      <Card className="overflow-hidden bg-white dark:bg-slate-800 shadow-lg border-0">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold text-white">Treatment Cases</h3>
          <span className="ml-auto bg-white/20 px-2 py-1 rounded text-xs font-semibold text-white">{cases.length}</span>
        </div>

        <div className="p-6">
          {loadingCases ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
          ) : cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">No cases found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">This patient has no treatment cases yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((caseItem) => {
                const styles = getStatusStyles(caseItem.status)
                return (
                  <div
                    key={caseItem.id}
                    className={`p-4 rounded-lg ${styles.bg} ${styles.border} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-base mb-3">
                          {caseItem.name || "Untitled Case"}
                        </h4>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Calendar className={`w-4 h-4 ${styles.icon}`} />
                            <span>
                              <span className="font-medium">Opened:</span> {formatDate(caseItem.created_at)}
                            </span>
                          </div>

                          {caseItem.closed_at && (
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className={`w-4 h-4 ${styles.icon}`} />
                              <span>
                                <span className="font-medium">Closed:</span> {formatDate(caseItem.closed_at)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {caseItem.status && (
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${styles.badge}`}>
                          {caseItem.status}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
