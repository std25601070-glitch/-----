'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle,
  Heart,
  Wind,
  Brain,
  Droplets,
  Zap,
  Hand,
  CircleDot,
  Baby,
  ShieldAlert
} from 'lucide-react'
import type { EmergencyAnswers } from '@/lib/types'

interface EmergencyQuestionsScreenProps {
  emergencyAnswers: EmergencyAnswers
  setEmergencyAnswers: (answers: EmergencyAnswers) => void
  onNext: () => void
  onBack: () => void
}

const emergencyQuestions = [
  { 
    id: 'chestPain' as const, 
    icon: Heart, 
    color: 'from-red-500 to-rose-600',
    questionEn: 'Do you have chest pain?', 
    questionAr: 'هل يوجد ألم في الصدر؟',
    warningLevel: 'critical'
  },
  { 
    id: 'shortnessOfBreath' as const, 
    icon: Wind, 
    color: 'from-cyan-500 to-blue-600',
    questionEn: 'Do you have shortness of breath?', 
    questionAr: 'هل يوجد ضيق تنفس؟',
    warningLevel: 'critical'
  },
  { 
    id: 'fainted' as const, 
    icon: Brain, 
    color: 'from-purple-500 to-violet-600',
    questionEn: 'Did you faint or lose consciousness?', 
    questionAr: 'هل فقدت الوعي؟',
    warningLevel: 'critical'
  },
  { 
    id: 'severebleeding' as const, 
    icon: Droplets, 
    color: 'from-rose-500 to-red-600',
    questionEn: 'Do you have severe bleeding?', 
    questionAr: 'هل يوجد نزيف شديد؟',
    warningLevel: 'critical'
  },
  { 
    id: 'suddenHeadache' as const, 
    icon: Zap, 
    color: 'from-orange-500 to-amber-600',
    questionEn: 'Do you have sudden severe headache?', 
    questionAr: 'هل يوجد صداع شديد ومفاجئ؟',
    warningLevel: 'critical'
  },
  { 
    id: 'onesideWeakness' as const, 
    icon: Hand, 
    color: 'from-indigo-500 to-purple-600',
    questionEn: 'Do you have weakness or numbness on one side?', 
    questionAr: 'هل يوجد ضعف أو خدر في جهة واحدة من الجسم؟',
    warningLevel: 'critical'
  },
  { 
    id: 'blueLips' as const, 
    icon: CircleDot, 
    color: 'from-blue-500 to-indigo-600',
    questionEn: 'Do you have blue lips or severe oxygen drop?', 
    questionAr: 'هل يوجد ازرقاق أو انخفاض شديد بالأوكسجين؟',
    warningLevel: 'critical'
  },
  { 
    id: 'pregnant' as const, 
    icon: Baby, 
    color: 'from-pink-500 to-rose-500',
    questionEn: 'Are you pregnant?', 
    questionAr: 'هل توجد حالة حمل؟',
    warningLevel: 'warning'
  },
]

export function EmergencyQuestionsScreen({ 
  emergencyAnswers, 
  setEmergencyAnswers, 
  onNext, 
  onBack 
}: EmergencyQuestionsScreenProps) {
  const criticalCount = Object.entries(emergencyAnswers).filter(
    ([key, value]) => value && key !== 'pregnant'
  ).length

  const hasCritical = criticalCount > 0

  const toggleAnswer = (id: keyof EmergencyAnswers) => {
    setEmergencyAnswers({
      ...emergencyAnswers,
      [id]: !emergencyAnswers[id]
    })
  }

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">Emergency Screening</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Emergency Warning Signs</h1>
          <p className="text-sky-300/80 arabic-text text-lg">علامات الطوارئ التحذيرية</p>
          <p className="text-sky-300/60 text-sm mt-2 max-w-lg mx-auto">
            Please answer these critical questions honestly. Your safety is our priority.
          </p>
        </motion.div>

        {/* Critical Warning Banner */}
        {hasCritical && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-300 mb-1">
                  Critical Symptoms Detected
                </h3>
                <p className="text-red-200/80 text-sm">
                  You have indicated {criticalCount} emergency warning sign(s). 
                  Please seek immediate medical attention if you are experiencing a medical emergency.
                </p>
                <p className="text-red-200/60 text-sm mt-1 arabic-text">
                  تم اكتشاف أعراض خطيرة. يرجى طلب الرعاية الطبية الفورية إذا كانت حالة طوارئ.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Questions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          {emergencyQuestions.map((q, index) => {
            const Icon = q.icon
            const isSelected = emergencyAnswers[q.id]
            const isCritical = q.warningLevel === 'critical'
            
            return (
              <motion.button
                key={q.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleAnswer(q.id)}
                className={`relative p-5 rounded-2xl transition-all duration-300 text-left ${
                  isSelected 
                    ? isCritical
                      ? 'bg-gradient-to-br from-red-500/30 to-orange-500/30 ring-2 ring-red-400/50'
                      : 'bg-gradient-to-br from-pink-500/30 to-rose-500/30 ring-2 ring-pink-400/50'
                    : 'glass-card hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${q.color} p-3 flex-shrink-0 ${
                    isSelected ? 'shadow-lg' : 'opacity-80'
                  }`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Question Text */}
                  <div className="flex-1">
                    <p className={`font-medium ${isSelected ? 'text-white' : 'text-sky-200'}`}>
                      {q.questionEn}
                    </p>
                    <p className={`text-sm arabic-text mt-1 ${isSelected ? 'text-sky-200' : 'text-sky-300/60'}`}>
                      {q.questionAr}
                    </p>
                  </div>

                  {/* Yes/No Indicator */}
                  <div className={`flex gap-2 flex-shrink-0`}>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      isSelected 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/10 text-sky-300/50'
                    }`}>
                      Yes
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      !isSelected 
                        ? 'bg-green-500/50 text-white' 
                        : 'bg-white/10 text-sky-300/50'
                    }`}>
                      No
                    </span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 rounded-xl mb-6 border border-amber-500/20"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-200/80">
                <strong>Emergency Notice:</strong> If you are experiencing a life-threatening emergency, 
                please call emergency services immediately or go to the nearest emergency room.
              </p>
              <p className="text-sm text-amber-200/60 mt-1 arabic-text">
                إذا كنت تعاني من حالة طوارئ مهددة للحياة، يرجى الاتصال بخدمات الطوارئ فورًا.
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
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
              hasCritical
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white glow-cyan hover:shadow-lg'
            }`}
          >
            Continue to Medical History
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
