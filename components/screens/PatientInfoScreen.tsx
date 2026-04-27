'use client'

import { motion } from 'framer-motion'
import { User, Calendar, Users, CreditCard, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react'
import type { PatientInfo } from '@/lib/types'

interface PatientInfoScreenProps {
  patientInfo: PatientInfo
  setPatientInfo: (info: PatientInfo) => void
  onNext: () => void
  onBack: () => void
}

export function PatientInfoScreen({ patientInfo, setPatientInfo, onNext, onBack }: PatientInfoScreenProps) {
  const updateField = (field: keyof PatientInfo, value: string) => {
    setPatientInfo({ ...patientInfo, [field]: value })
  }

  const isValid = patientInfo.fullName && patientInfo.age && patientInfo.gender && patientInfo.mainComplaint

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <span className="w-2 h-2 bg-sky-400 rounded-full" />
            <span className="text-sm text-sky-300">Step 1 of 4</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Patient Information</h1>
          <p className="text-sky-300/80 arabic-text">معلومات المريض</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          {/* Full Name */}
          <div className="glass-card rounded-2xl p-5">
            <label className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <span className="text-white font-medium">Full Name</span>
                <span className="text-sky-300/70 text-sm ml-2 arabic-text">الاسم الكامل</span>
              </div>
            </label>
            <input
              type="text"
              value={patientInfo.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="Enter patient's full name"
              className="w-full px-4 py-3 bg-white/5 border border-sky-500/20 rounded-xl text-white placeholder:text-sky-300/40 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all"
            />
          </div>

          {/* Age and Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <div className="glass-card rounded-2xl p-5">
              <label className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <span className="text-white font-medium">Age</span>
                  <span className="text-sky-300/70 text-sm ml-2 arabic-text">العمر</span>
                </div>
              </label>
              <input
                type="number"
                value={patientInfo.age}
                onChange={(e) => updateField('age', e.target.value)}
                placeholder="Years"
                min="0"
                max="150"
                className="w-full px-4 py-3 bg-white/5 border border-sky-500/20 rounded-xl text-white placeholder:text-sky-300/40 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all"
              />
            </div>

            {/* Gender */}
            <div className="glass-card rounded-2xl p-5">
              <label className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <span className="text-white font-medium">Gender</span>
                  <span className="text-sky-300/70 text-sm ml-2 arabic-text">الجنس</span>
                </div>
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateField('gender', 'male')}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    patientInfo.gender === 'male'
                      ? 'bg-sky-500 text-white'
                      : 'bg-white/5 text-sky-300 border border-sky-500/20 hover:bg-white/10'
                  }`}
                >
                  Male / ذكر
                </button>
                <button
                  onClick={() => updateField('gender', 'female')}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    patientInfo.gender === 'female'
                      ? 'bg-sky-500 text-white'
                      : 'bg-white/5 text-sky-300 border border-sky-500/20 hover:bg-white/10'
                  }`}
                >
                  Female / أنثى
                </button>
              </div>
            </div>
          </div>

          {/* Patient ID */}
          <div className="glass-card rounded-2xl p-5">
            <label className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <span className="text-white font-medium">Patient ID</span>
                <span className="text-sky-300/70 text-sm ml-2 arabic-text">رقم المريض</span>
                <span className="text-sky-300/50 text-xs ml-2">(Optional)</span>
              </div>
            </label>
            <input
              type="text"
              value={patientInfo.patientId}
              onChange={(e) => updateField('patientId', e.target.value)}
              placeholder="Enter patient ID if available"
              className="w-full px-4 py-3 bg-white/5 border border-sky-500/20 rounded-xl text-white placeholder:text-sky-300/40 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all"
            />
          </div>

          {/* Main Complaint */}
          <div className="glass-card rounded-2xl p-5">
            <label className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <span className="text-white font-medium">Main Complaint</span>
                <span className="text-sky-300/70 text-sm ml-2 arabic-text">الشكوى الرئيسية</span>
              </div>
            </label>
            <textarea
              value={patientInfo.mainComplaint}
              onChange={(e) => updateField('mainComplaint', e.target.value)}
              placeholder="Describe the main health concern..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-sky-500/20 rounded-xl text-white placeholder:text-sky-300/40 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all resize-none"
            />
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
            Continue to Symptoms
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
