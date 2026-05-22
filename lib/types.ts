export interface PatientInfo {
  fullName: string
  age: string
  gender: 'male' | 'female' | ''
  patientId: string
  mainComplaint: string
}

export interface SymptomDetail {
  symptomId: string
  onset: string
  location: string
  duration: string
  severity: number
  character: string
  aggravatingFactors: string
  relievingFactors: string
  associatedSymptoms: string
  specificAnswers: Record<string, string>
}

export interface EmergencyAnswers {
  chestPain: boolean
  shortnessOfBreath: boolean
  fainted: boolean
  severeBleeding: boolean
  suddenHeadache: boolean
  onesideWeakness: boolean
  blueLips: boolean
  pregnant: boolean
}

export interface MedicalHistory {
  diabetes: boolean
  highBloodPressure: boolean
  heartDisease: boolean
  asthmaOrLungDisease: boolean
  kidneyDisease: boolean
  chronicDisease: boolean
  chronicDiseaseDetails: string
  takingMedications: boolean
  medicationDetails: string
  medicationAllergies: boolean
  allergyDetails: string
  previousSurgery: boolean
  surgeryDetails: string
}

export interface VitalSigns {
  temperature: string
  heartRate: string
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  oxygenLevel: string
}

export interface AssessmentResult {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  possibleCondition: {
    en: string
    ar: string
  }
  recommendation: {
    en: string
    ar: string
  }
  emergencyWarning: boolean
  confidence: number
}

export interface PatientRecord {
  id: string
  patientInfo: PatientInfo
  phoneNumber: string
  symptoms: string[]
  symptomDetails: SymptomDetail[]
  emergencyAnswers: EmergencyAnswers
  medicalHistory: MedicalHistory
  vitalSigns: VitalSigns
  assessment: AssessmentResult
  date: string
  timestamp: number
}

export type Screen = 
  | 'welcome' 
  | 'patient-info' 
  | 'symptoms' 
  | 'symptom-details'
  | 'emergency-questions'
  | 'medical-history'
  | 'vitals' 
  | 'results' 
  | 'history'
