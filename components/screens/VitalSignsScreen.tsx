'use client'

import { motion } from 'framer-motion'
import { Thermometer, Heart, Activity, Droplets, ArrowRight, ArrowLeft, Cpu, Zap, Fingerprint, Radio } from 'lucide-react'
import type { VitalSigns } from '@/lib/types'

interface VitalSignsScreenProps {
  vitalSigns: VitalSigns
  setVitalSigns: (vitals: VitalSigns) => void
  onNext: () => void
  onBack: () => void
}

const sensors = [
  {
    name: 'MAX30102',
    nameAr: 'حساس النبض والأكسجين',
    desc: 'Heart Rate & SpO2 Sensor',
    descAr: 'يقيس نبض القلب ونسبة الأكسجين في الدم',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    measures: ['Heart Rate', 'SpO2 %'],
  },
  {
    name: 'MLX90614',
    nameAr: 'حساس الحرارة',
    desc: 'Infrared Temperature Sensor',
    descAr: 'يقيس درجة الحرارة بدون تلامس',
    icon: Thermometer,
    color: 'from-orange-500 to-red-500',
    measures: ['Body Temp °C'],
  },
  {
    name: 'EMG Sensor',
    nameAr: 'حساس النشاط العضلي',
    desc: 'Electromyography Sensor',
    descAr: 'يقيس النشاط الكهربائي للعضلات والرعشة',
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    measures: ['Muscle Activity', 'Tremor Detection'],
  },
  {
    name: 'Fingerprint Reader',
    nameAr: 'قارئ البصمة',
    desc: 'Biometric Authentication',
    descAr: 'تعريف المريض وحماية البيانات',
    icon: Fingerprint,
    color: 'from-indigo-500 to-purple-500',
    measures: ['Patient ID'],
  },
  {
    name: 'Logic-Level Converter',
    nameAr: 'محول مستوى الإشارة',
    desc: 'Signal Interface Module',
    descAr: 'يضمن التوافق بين الحساسات والـ ESP32',
    icon: Radio,
    color: 'from-teal-500 to-cyan-500',
    measures: ['3.3V ↔ 5V'],
  },
  {
    name: 'ESP32',
    nameAr: 'وحدة التحكم المركزية',
    desc: 'Main Microcontroller + Wi-Fi',
    descAr: 'يجمع البيانات ويرسلها للذكاء الاصطناعي',
    icon: Cpu,
    color: 'from-sky-500 to-blue-600',
    measures: ['Wi-Fi', 'Data Processing'],
  },
]

export function VitalSignsScreen({ vitalSigns, setVitalSigns, onNext, onBack }: VitalSignsScreenProps) {
  const updateField = (field: keyof VitalSigns, value: string) => {
    setVitalSigns({ ...vitalSigns, [field]: value })
  }

  const vitals = [
    {
      id: 'temperature',
      nameEn: 'Temperature',
      nameAr: 'درجة الحرارة',
      icon: Thermometer,
      unit: '°C',
      placeholder: '37.0',
      color: 'from-orange-500 to-red-500',
      field: 'temperature' as keyof VitalSigns,
      normalRange: '36.1 - 37.2',
      sensor: 'MLX90614',
    },
    {
      id: 'heartRate',
      nameEn: 'Heart Rate',
      nameAr: 'نبض القلب',
      icon: Heart,
      unit: 'BPM',
      placeholder: '72',
      color: 'from-rose-500 to-pink-500',
      field: 'heartRate' as keyof VitalSigns,
      normalRange: '60 - 100',
      sensor: 'MAX30102',
    },
    {
      id: 'bloodPressure',
      nameEn: 'Blood Pressure',
      nameAr: 'ضغط الدم',
      icon: Activity,
      unit: 'mmHg',
      placeholder: '120/80',
      color: 'from-purple-500 to-indigo-500',
      field: 'bloodPressureSystolic' as keyof VitalSigns,
      normalRange: '90/60 - 120/80',
      sensor: 'MAX30102',
    },
    {
      id: 'oxygenLevel',
      nameEn: 'Oxygen Level',
      nameAr: 'نسبة الأوكسجين',
      icon: Droplets,
      unit: '%',
      placeholder: '98',
      color: 'from-cyan-500 to-blue-500',
      field: 'oxygenLevel' as keyof VitalSigns,
      normalRange: '95 - 100',
      sensor: 'MAX30102',
    },
  ]

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
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
            <span className="text-sm text-sky-300">Step 3 of 4</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Vital Signs</h1>
          <p className="text-sky-300/80 arabic-text">العلامات الحيوية</p>
          <p className="text-sky-300/60 text-sm mt-2">
            Enter current readings if available (optional)
          </p>
        </motion.div>

        {/* Vital Signs Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {vitals.map((vital, index) => {
            const Icon = vital.icon
            return (
              <motion.div
                key={vital.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${vital.color} p-3 flex-shrink-0`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{vital.nameEn}</h3>
                    </div>
                    <p className="text-sm text-sky-300/70 arabic-text mb-1">{vital.nameAr}</p>
                    <span className="text-xs text-sky-400/60 bg-sky-500/10 px-2 py-0.5 rounded-full mb-3 inline-block">
                      via {vital.sensor}
                    </span>

                    {vital.id === 'bloodPressure' ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="number"
                          value={vitalSigns.bloodPressureSystolic}
                          onChange={(e) => updateField('bloodPressureSystolic', e.target.value)}
                          placeholder="120"
                          className="w-full px-4 py-3 bg-white/5 border border-sky-500/20 rounded-xl text-white text-lg text-center placeholder:text-sky-300/40 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all"
                        />
                        <span className="text-sky-300 text-xl">/</span>
                        <input
                          type="number"
                          value={vitalSigns.bloodPressureDiastolic}
                          onChange={(e) => updateField('bloodPressureDiastolic', e.target.value)}
                          placeholder="80"
                          className="w-full px-4 py-3 bg-white/5 border border-sky-500/20 rounded-xl text-white text-lg text-center placeholder:text-sky-300/40 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all"
                        />
                        <span className="text-sky-300/70 text-sm ml-1">{vital.unit}</span>
                      </div>
                    ) : (
                      <div className="relative mt-2">
                        <input
                          type="number"
                          step={vital.id === 'temperature' ? '0.1' : '1'}
                          value={vitalSigns[vital.field]}
                          onChange={(e) => updateField(vital.field, e.target.value)}
                          placeholder={vital.placeholder}
                          className="w-full px-4 py-3 pr-16 bg-white/5 border border-sky-500/20 rounded-xl text-white text-lg placeholder:text-sky-300/40 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-300/70">
                          {vital.unit}
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-sky-300/50 mt-2">
                      Normal: {vital.normalRange} {vital.unit}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Sensors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Hardware Sensors</h2>
              <p className="text-sm text-sky-300/60 arabic-text">الحساسات المستخدمة في الذراع الذكي</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sensors.map((sensor, index) => {
              const Icon = sensor.icon
              return (
                <motion.div
                  key={sensor.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.08 }}
                  className="glass-card rounded-2xl p-4 border border-white/5 hover:border-sky-500/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sensor.color} p-3 flex-shrink-0`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{sensor.name}</p>
                      <p className="text-sky-300/60 text-xs arabic-text">{sensor.nameAr}</p>
                      <p className="text-sky-200/70 text-xs mt-1">{sensor.desc}</p>
                      <p className="text-sky-300/50 text-xs arabic-text mt-0.5">{sensor.descAr}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sensor.measures.map(m => (
                          <span key={m} className="text-xs bg-white/10 text-sky-300 px-2 py-0.5 rounded-full">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card rounded-2xl p-5 mt-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-sm text-sky-200">
                Vital signs help improve assessment accuracy. Leave blank if measurements are unavailable.
              </p>
              <p className="text-sm text-sky-300/70 mt-1 arabic-text">
                العلامات الحيوية تساعد على تحسين دقة التقييم. اتركها فارغة إذا لم تكن القياسات متوفرة.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
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
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 text-white glow-cyan hover:shadow-lg transition-all"
          >
            Generate Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
