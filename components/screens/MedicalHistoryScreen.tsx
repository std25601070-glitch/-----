'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  Heart,
  Activity,
  Wind,
  Droplets,
  Pill,
  AlertCircle,
  Scissors,
  ClipboardList,
  Stethoscope
} from 'lucide-react'
import type { MedicalHistory } from '@/lib/types'

interface MedicalHistoryScreenProps {
  medicalHistory: MedicalHistory
  setMedicalHistory: (history: MedicalHistory) => void
  onNext: () => void
  onBack: () => void
}

const medicalQuestions = [
  { 
    id: 'diabetes' as const, 
    icon: Droplets, 
    color: 'from-amber-500 to-orange-500',
    questionEn: 'Do you have diabetes?', 
    questionAr: 'هل لديك سكري؟',
    hasDetails: false
  },
  { 
    id: 'highBloodPressure' as const, 
    icon: Activity, 
    color: 'from-red-500 to-rose-500',
    questionEn: 'Do you have high blood pressure?', 
    questionAr: 'هل لديك ارتفاع ضغط؟',
    hasDetails: false
  },
  { 
    id: 'heartDisease' as const, 
    icon: Heart, 
    color: 'from-rose-500 to-pink-500',
    questionEn: 'Do you have heart disease?', 
    questionAr: 'هل لديك أمراض قلب؟',
    hasDetails: false
  },
  { 
    id: 'asthmaOrLungDisease' as const, 
    icon: Wind, 
    color: 'from-cyan-500 to-blue-500',
    questionEn: 'Do you have asthma or lung disease?', 
    questionAr: 'هل لديك ربو أو أمراض تنفسية؟',
    hasDetails: false
  },
  { 
    id: 'kidneyDisease' as const, 
    icon: Droplets, 
    color: 'from-purple-500 to-violet-500',
    questionEn: 'Do you have kidney disease?', 
    questionAr: 'هل لديك أمراض كلى؟',
    hasDetails: false
  },
  { 
    id: 'chronicDisease' as const, 
    icon: ClipboardList, 
    color: 'from-indigo-500 to-purple-500',
    questionEn: 'Do you have any chronic disease?', 
    questionAr: 'هل لديك مرض مزمن؟',
    hasDetails: true,
    detailsField: 'chronicDiseaseDetails' as const,
    detailsPlaceholder: 'Please specify the chronic disease...'
  },
  { 
    id: 'takingMedications' as const, 
    icon: Pill, 
    color: 'from-emerald-500 to-green-500',
    questionEn: 'Are you taking any medications?', 
    questionAr: 'هل تتناول أدوية؟',
    hasDetails: true,
    detailsField: 'medicationDetails' as const,
    detailsPlaceholder: 'List your current medications...'
  },
  { 
    id: 'medicationAllergies' as const, 
    icon: AlertCircle, 
    color: 'from-orange-500 to-red-500',
    questionEn: 'Do you have any medication allergies?', 
    questionAr: 'هل لديك حساسية من أدوية؟',
    hasDetails: true,
    detailsField: 'allergyDetails' as const,
    detailsPlaceholder: 'List your medication allergies...'
  },
  { 
    id: 'previousSurgery' as const, 
    icon: Scissors, 
    color: 'from-slate-500 to-gray-500',
    questionEn: 'Have you had surgery before?', 
    questionAr: 'هل أجريت عملية سابقًا؟',
    hasDetails: true,
    detailsField: 'surgeryDetails' as const,
    detailsPlaceholder: 'Describe previous surgeries...'
  },
]

export function MedicalHistoryScreen({ 
  medicalHistory, 
  setMedicalHistory, 
  onNext, 
  onBack 
}: MedicalHistoryScreenProps) {
  const toggleAnswer = (id: keyof MedicalHistory) => {
    if (typeof medicalHistory[id] === 'boolean') {
      setMedicalHistory({
        ...medicalHistory,
        [id]: !medicalHistory[id]
      })
    }
  }

  const updateDetails = (field: keyof MedicalHistory, value: string) => {
    setMedicalHistory({
      ...medicalHistory,
      [field]: value
    })
  }

  const conditionsCount = [
    medicalHistory.diabetes,
    medicalHistory.highBloodPressure,
    medicalHistory.heartDisease,
    medicalHistory.asthmaOrLungDisease,
    medicalHistory.kidneyDisease,
    medicalHistory.chronicDisease
  ].filter(Boolean).length

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-blue mb-4">
            <Stethoscope className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-sky-300">Medical History</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Medical History</h1>
          <p className="text-sky-300/80 arabic-text text-lg">التاريخ الطبي</p>
          <p className="text-sky-300/60 text-sm mt-2 max-w-lg mx-auto">
            This information helps us provide more accurate assessment results.
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-white font-medium">Known Medical Conditions</p>
              <p className="text-sky-300/60 text-sm arabic-text">الحالات الطبية المعروفة</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
            conditionsCount === 0 
              ? 'bg-green-500/20 text-green-400' 
              : conditionsCount <= 2 
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-orange-500/20 text-orange-400'
          }`}>
            {conditionsCount}
          </div>
        </motion.div>

        {/* Questions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          {medicalQuestions.map((q, index) => {
            const Icon = q.icon
            const isSelected = medicalHistory[q.id] as boolean
            const detailsValue = q.hasDetails && q.detailsField 
              ? medicalHistory[q.detailsField] as string 
              : ''
            
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.03 }}
                className={`relative p-5 rounded-2xl transition-all duration-300 ${
                  isSelected 
                    ? 'glass-card-blue ring-1 ring-sky-400/30'
                    : 'glass-card'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${q.color} p-3 flex-shrink-0 ${
                    isSelected ? 'shadow-lg' : 'opacity-70'
                  }`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Question */}
                  <div className="flex-1">
                    <p className={`font-medium ${isSelected ? 'text-white' : 'text-sky-200'}`}>
                      {q.questionEn}
                    </p>
                    <p className={`text-sm arabic-text mt-0.5 ${isSelected ? 'text-sky-200' : 'text-sky-300/60'}`}>
                      {q.questionAr}
                    </p>

                    {/* Details Input */}
                    {q.hasDetails && isSelected && q.detailsField && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <textarea
                          value={detailsValue}
                          onChange={(e) => updateDetails(q.detailsField!, e.target.value)}
                          placeholder={q.detailsPlaceholder}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-sky-300/40 focus:border-sky-400 focus:outline-none transition-colors text-sm resize-none"
                          rows={2}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleAnswer(q.id)}
                    className="flex gap-2 flex-shrink-0"
                  >
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected 
                        ? 'bg-sky-500 text-white shadow-lg' 
                        : 'bg-white/10 text-sky-300/50 hover:bg-white/20'
                    }`}>
                      Yes / نعم
                    </span>
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      !isSelected 
                        ? 'bg-green-500/50 text-white' 
                        : 'bg-white/10 text-sky-300/50 hover:bg-white/20'
                    }`}>
                      No / لا
                    </span>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 rounded-xl mb-6 border border-sky-500/20"
        >
          <div className="flex items-start gap-3">
            <ClipboardList className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-sky-200/80">
                <strong>Privacy Notice:</strong> Your medical history is encrypted and handled 
                according to healthcare privacy standards. This information is used solely 
                for providing accurate initial assessment.
              </p>
              <p className="text-sm text-sky-200/60 mt-1 arabic-text">
                معلوماتك الطبية مشفرة ومحمية وفقًا لمعايير الخصوصية الصحية.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-4 glass-card rounded-xl text-sky-300 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 text-white glow-cyan hover:shadow-lg transition-all"
          >
            Continue to Vital Signs
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
