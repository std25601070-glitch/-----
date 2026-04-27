'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WelcomeScreen } from '@/components/screens/WelcomeScreen'
import { PatientInfoScreen } from '@/components/screens/PatientInfoScreen'
import { SymptomsScreen } from '@/components/screens/SymptomsScreen'
import { SymptomDetailsScreen } from '@/components/screens/SymptomDetailsScreen'
import { EmergencyQuestionsScreen } from '@/components/screens/EmergencyQuestionsScreen'
import { MedicalHistoryScreen } from '@/components/screens/MedicalHistoryScreen'
import { VitalSignsScreen } from '@/components/screens/VitalSignsScreen'
import { ResultsScreen } from '@/components/screens/ResultsScreen'
import { PatientHistoryScreen } from '@/components/screens/PatientHistoryScreen'
import type { 
  PatientInfo, 
  VitalSigns, 
  Screen, 
  SymptomDetail, 
  EmergencyAnswers, 
  MedicalHistory 
} from '@/lib/types'

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 }
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
}

export default function NuraiMedicalAssistant() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    fullName: '',
    age: '',
    gender: '',
    patientId: '',
    mainComplaint: ''
  })
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [symptomDetails, setSymptomDetails] = useState<SymptomDetail[]>([])
  const [emergencyAnswers, setEmergencyAnswers] = useState<EmergencyAnswers>({
    chestPain: false,
    shortnessOfBreath: false,
    fainted: false,
    severebleeding: false,
    suddenHeadache: false,
    onesideWeakness: false,
    blueLips: false,
    pregnant: false
  })
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    diabetes: false,
    highBloodPressure: false,
    heartDisease: false,
    asthmaOrLungDisease: false,
    kidneyDisease: false,
    chronicDisease: false,
    chronicDiseaseDetails: '',
    takingMedications: false,
    medicationDetails: '',
    medicationAllergies: false,
    allergyDetails: '',
    previousSurgery: false,
    surgeryDetails: ''
  })
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    temperature: '',
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    oxygenLevel: ''
  })

  const resetAssessment = () => {
    setPatientInfo({
      fullName: '',
      age: '',
      gender: '',
      patientId: '',
      mainComplaint: ''
    })
    setSelectedSymptoms([])
    setSymptomDetails([])
    setEmergencyAnswers({
      chestPain: false,
      shortnessOfBreath: false,
      fainted: false,
      severebleeding: false,
      suddenHeadache: false,
      onesideWeakness: false,
      blueLips: false,
      pregnant: false
    })
    setMedicalHistory({
      diabetes: false,
      highBloodPressure: false,
      heartDisease: false,
      asthmaOrLungDisease: false,
      kidneyDisease: false,
      chronicDisease: false,
      chronicDiseaseDetails: '',
      takingMedications: false,
      medicationDetails: '',
      medicationAllergies: false,
      allergyDetails: '',
      previousSurgery: false,
      surgeryDetails: ''
    })
    setVitalSigns({
      temperature: '',
      heartRate: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      oxygenLevel: ''
    })
    setCurrentScreen('welcome')
  }

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <WelcomeScreen 
              onStart={() => setCurrentScreen('patient-info')} 
              onViewHistory={() => setCurrentScreen('history')}
            />
          </motion.div>
        )}

        {currentScreen === 'patient-info' && (
          <motion.div
            key="patient-info"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <PatientInfoScreen
              patientInfo={patientInfo}
              setPatientInfo={setPatientInfo}
              onNext={() => setCurrentScreen('symptoms')}
              onBack={() => setCurrentScreen('welcome')}
            />
          </motion.div>
        )}

        {currentScreen === 'symptoms' && (
          <motion.div
            key="symptoms"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <SymptomsScreen
              selectedSymptoms={selectedSymptoms}
              setSelectedSymptoms={setSelectedSymptoms}
              onNext={() => setCurrentScreen('symptom-details')}
              onBack={() => setCurrentScreen('patient-info')}
            />
          </motion.div>
        )}

        {currentScreen === 'symptom-details' && (
          <motion.div
            key="symptom-details"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <SymptomDetailsScreen
              selectedSymptoms={selectedSymptoms}
              symptomDetails={symptomDetails}
              setSymptomDetails={setSymptomDetails}
              onNext={() => setCurrentScreen('emergency-questions')}
              onBack={() => setCurrentScreen('symptoms')}
            />
          </motion.div>
        )}

        {currentScreen === 'emergency-questions' && (
          <motion.div
            key="emergency-questions"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <EmergencyQuestionsScreen
              emergencyAnswers={emergencyAnswers}
              setEmergencyAnswers={setEmergencyAnswers}
              onNext={() => setCurrentScreen('medical-history')}
              onBack={() => setCurrentScreen('symptom-details')}
            />
          </motion.div>
        )}

        {currentScreen === 'medical-history' && (
          <motion.div
            key="medical-history"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <MedicalHistoryScreen
              medicalHistory={medicalHistory}
              setMedicalHistory={setMedicalHistory}
              onNext={() => setCurrentScreen('vitals')}
              onBack={() => setCurrentScreen('emergency-questions')}
            />
          </motion.div>
        )}

        {currentScreen === 'vitals' && (
          <motion.div
            key="vitals"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <VitalSignsScreen
              vitalSigns={vitalSigns}
              setVitalSigns={setVitalSigns}
              onNext={() => setCurrentScreen('results')}
              onBack={() => setCurrentScreen('medical-history')}
            />
          </motion.div>
        )}

        {currentScreen === 'results' && (
          <motion.div
            key="results"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <ResultsScreen
              patientInfo={patientInfo}
              selectedSymptoms={selectedSymptoms}
              symptomDetails={symptomDetails}
              emergencyAnswers={emergencyAnswers}
              medicalHistory={medicalHistory}
              vitalSigns={vitalSigns}
              onRestart={resetAssessment}
            />
          </motion.div>
        )}

        {currentScreen === 'history' && (
          <motion.div
            key="history"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <PatientHistoryScreen
              onBack={() => setCurrentScreen('welcome')}
              onNewAssessment={() => setCurrentScreen('patient-info')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
