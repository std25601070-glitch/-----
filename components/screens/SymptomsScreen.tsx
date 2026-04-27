'use client'

import { motion } from 'framer-motion'
import { 
  Thermometer, 
  Brain, 
  Heart, 
  Wind, 
  CloudRain, 
  RotateCcw, 
  Battery, 
  Pill,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react'

interface SymptomsScreenProps {
  selectedSymptoms: string[]
  setSelectedSymptoms: (symptoms: string[]) => void
  onNext: () => void
  onBack: () => void
}

const symptoms = [
  { id: 'fever', nameEn: 'Fever', nameAr: 'حمى', icon: Thermometer, color: 'from-red-500 to-orange-500' },
  { id: 'headache', nameEn: 'Headache', nameAr: 'صداع', icon: Brain, color: 'from-purple-500 to-pink-500' },
  { id: 'chest-pain', nameEn: 'Chest Pain', nameAr: 'ألم في الصدر', icon: Heart, color: 'from-rose-500 to-red-500' },
  { id: 'shortness-of-breath', nameEn: 'Shortness of Breath', nameAr: 'ضيق تنفس', icon: Wind, color: 'from-cyan-500 to-blue-500' },
  { id: 'cough', nameEn: 'Cough', nameAr: 'سعال', icon: CloudRain, color: 'from-teal-500 to-cyan-500' },
  { id: 'dizziness', nameEn: 'Dizziness', nameAr: 'دوخة', icon: RotateCcw, color: 'from-amber-500 to-yellow-500' },
  { id: 'fatigue', nameEn: 'Fatigue', nameAr: 'تعب', icon: Battery, color: 'from-slate-500 to-gray-500' },
  { id: 'stomach-pain', nameEn: 'Stomach Pain', nameAr: 'ألم في البطن', icon: Pill, color: 'from-emerald-500 to-green-500' },
]

export function SymptomsScreen({ selectedSymptoms, setSelectedSymptoms, onNext, onBack }: SymptomsScreenProps) {
  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id))
    } else {
      setSelectedSymptoms([...selectedSymptoms, id])
    }
  }

  const isValid = selectedSymptoms.length > 0

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <span className="w-2 h-2 bg-sky-400 rounded-full" />
            <span className="text-sm text-sky-300">Step 2 of 4</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Select Symptoms</h1>
          <p className="text-sky-300/80 arabic-text">اختر الأعراض</p>
          <p className="text-sky-300/60 text-sm mt-2">
            Select all symptoms that apply ({selectedSymptoms.length} selected)
          </p>
        </motion.div>

        {/* Symptoms Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {symptoms.map((symptom, index) => {
            const isSelected = selectedSymptoms.includes(symptom.id)
            const Icon = symptom.icon
            
            return (
              <motion.button
                key={symptom.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSymptom(symptom.id)}
                className={`relative p-6 rounded-2xl transition-all duration-300 ${
                  isSelected 
                    ? 'glass-card-blue ring-2 ring-sky-400/50' 
                    : 'glass-card hover:bg-white/10'
                }`}
              >
                {/* Selected Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${symptom.color} p-3 mx-auto mb-4 ${
                  isSelected ? 'shadow-lg' : 'opacity-80'
                }`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* Labels */}
                <p className={`font-medium text-center ${isSelected ? 'text-white' : 'text-sky-200'}`}>
                  {symptom.nameEn}
                </p>
                <p className={`text-sm text-center arabic-text ${isSelected ? 'text-sky-200' : 'text-sky-300/60'}`}>
                  {symptom.nameAr}
                </p>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 mt-8"
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
            disabled={!isValid}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
              isValid
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white glow-cyan hover:shadow-lg'
                : 'bg-white/10 text-sky-300/50 cursor-not-allowed'
            }`}
          >
            Continue to Vital Signs
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
