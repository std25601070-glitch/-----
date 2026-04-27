'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ArrowLeft,
  User,
  Phone,
  Hash,
  Calendar,
  Activity,
  Heart,
  Thermometer,
  Wind,
  AlertTriangle,
  FileText,
  Plus,
  Save,
  Send,
  Shield,
  Clock,
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react'
import type { PatientRecord, VitalSigns } from '@/lib/types'

interface PatientHistoryScreenProps {
  onBack: () => void
  onNewAssessment: () => void
}

// Sample patient records for demonstration
const sampleRecords: PatientRecord[] = [
  {
    id: 'REC-001',
    patientInfo: {
      fullName: 'Ahmed Mohammed Al-Rashid',
      age: '45',
      gender: 'male',
      patientId: 'PAT-2024-001',
      mainComplaint: 'Persistent chest discomfort'
    },
    phoneNumber: '+966 50 123 4567',
    symptoms: ['chest-pain', 'shortness-breath', 'fatigue'],
    vitalSigns: {
      temperature: '37.2',
      heartRate: '88',
      bloodPressureSystolic: '140',
      bloodPressureDiastolic: '90',
      oxygenLevel: '96'
    },
    assessment: {
      riskLevel: 'high',
      possibleCondition: {
        en: 'Cardiovascular Assessment Required',
        ar: 'يتطلب تقييم القلب والأوعية الدموية'
      },
      recommendation: {
        en: 'Immediate cardiology consultation recommended. ECG and cardiac enzymes required.',
        ar: 'يوصى باستشارة طبيب القلب فوراً. يلزم إجراء تخطيط القلب وفحص إنزيمات القلب.'
      },
      emergencyWarning: true,
      confidence: 87
    },
    date: '2024-01-15',
    timestamp: 1705305600000
  },
  {
    id: 'REC-002',
    patientInfo: {
      fullName: 'Fatima Abdullah Hassan',
      age: '32',
      gender: 'female',
      patientId: 'PAT-2024-002',
      mainComplaint: 'Severe headache and dizziness'
    },
    phoneNumber: '+966 55 987 6543',
    symptoms: ['headache', 'dizziness', 'fatigue'],
    vitalSigns: {
      temperature: '36.8',
      heartRate: '72',
      bloodPressureSystolic: '110',
      bloodPressureDiastolic: '70',
      oxygenLevel: '99'
    },
    assessment: {
      riskLevel: 'moderate',
      possibleCondition: {
        en: 'Tension-type Headache with Vestibular Component',
        ar: 'صداع توتري مع مكون دهليزي'
      },
      recommendation: {
        en: 'Rest in dark, quiet room. Hydration recommended. Follow-up if symptoms persist >48h.',
        ar: 'الراحة في غرفة مظلمة وهادئة. يُنصح بالإكثار من السوائل. المتابعة إذا استمرت الأعراض أكثر من 48 ساعة.'
      },
      emergencyWarning: false,
      confidence: 78
    },
    date: '2024-01-14',
    timestamp: 1705219200000
  },
  {
    id: 'REC-003',
    patientInfo: {
      fullName: 'Mohammed Khalid Al-Otaibi',
      age: '28',
      gender: 'male',
      patientId: 'PAT-2024-003',
      mainComplaint: 'Fever and persistent cough'
    },
    phoneNumber: '+966 54 456 7890',
    symptoms: ['fever', 'cough', 'fatigue'],
    vitalSigns: {
      temperature: '38.5',
      heartRate: '95',
      bloodPressureSystolic: '120',
      bloodPressureDiastolic: '80',
      oxygenLevel: '97'
    },
    assessment: {
      riskLevel: 'moderate',
      possibleCondition: {
        en: 'Upper Respiratory Tract Infection',
        ar: 'عدوى الجهاز التنفسي العلوي'
      },
      recommendation: {
        en: 'Symptomatic treatment. Monitor temperature. Seek care if fever exceeds 39°C or breathing difficulty.',
        ar: 'علاج الأعراض. مراقبة الحرارة. مراجعة الطبيب إذا تجاوزت الحرارة 39 درجة أو ظهرت صعوبة في التنفس.'
      },
      emergencyWarning: false,
      confidence: 82
    },
    date: '2024-01-13',
    timestamp: 1705132800000
  },
  {
    id: 'REC-004',
    patientInfo: {
      fullName: 'Sara Ibrahim Al-Zahrani',
      age: '55',
      gender: 'female',
      patientId: 'PAT-2024-004',
      mainComplaint: 'Stomach pain after meals'
    },
    phoneNumber: '+966 50 321 0987',
    symptoms: ['stomach-pain', 'fatigue'],
    vitalSigns: {
      temperature: '36.9',
      heartRate: '68',
      bloodPressureSystolic: '125',
      bloodPressureDiastolic: '82',
      oxygenLevel: '98'
    },
    assessment: {
      riskLevel: 'low',
      possibleCondition: {
        en: 'Gastritis or Dyspepsia',
        ar: 'التهاب المعدة أو عسر الهضم'
      },
      recommendation: {
        en: 'Dietary modifications. Avoid spicy foods. Consider antacids. Schedule gastroenterology if persistent.',
        ar: 'تعديل النظام الغذائي. تجنب الأطعمة الحارة. استخدام مضادات الحموضة. مراجعة طبيب الجهاز الهضمي إذا استمرت الأعراض.'
      },
      emergencyWarning: false,
      confidence: 75
    },
    date: '2024-01-12',
    timestamp: 1705046400000
  }
]

const symptomNames: Record<string, { en: string; ar: string }> = {
  'fever': { en: 'Fever', ar: 'حمى' },
  'headache': { en: 'Headache', ar: 'صداع' },
  'chest-pain': { en: 'Chest Pain', ar: 'ألم الصدر' },
  'shortness-breath': { en: 'Shortness of Breath', ar: 'ضيق التنفس' },
  'cough': { en: 'Cough', ar: 'سعال' },
  'dizziness': { en: 'Dizziness', ar: 'دوخة' },
  'fatigue': { en: 'Fatigue', ar: 'إرهاق' },
  'stomach-pain': { en: 'Stomach Pain', ar: 'ألم المعدة' }
}

const riskColors = {
  low: 'from-emerald-500 to-green-500',
  moderate: 'from-amber-500 to-yellow-500',
  high: 'from-orange-500 to-red-500',
  critical: 'from-red-600 to-rose-600'
}

const riskLabels = {
  low: { en: 'Low Risk', ar: 'خطورة منخفضة' },
  moderate: { en: 'Moderate Risk', ar: 'خطورة متوسطة' },
  high: { en: 'High Risk', ar: 'خطورة عالية' },
  critical: { en: 'Critical', ar: 'حرجة' }
}

export function PatientHistoryScreen({ onBack, onNewAssessment }: PatientHistoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'phone' | 'id'>('name')
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [showSendConfirm, setShowSendConfirm] = useState(false)

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return sampleRecords
    
    const query = searchQuery.toLowerCase().trim()
    return sampleRecords.filter(record => {
      switch (searchType) {
        case 'name':
          return record.patientInfo.fullName.toLowerCase().includes(query)
        case 'phone':
          return record.phoneNumber.replace(/\s/g, '').includes(query.replace(/\s/g, ''))
        case 'id':
          return record.patientInfo.patientId.toLowerCase().includes(query)
        default:
          return true
      }
    })
  }, [searchQuery, searchType])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSaveRecord = () => {
    setShowSaveConfirm(true)
    setTimeout(() => setShowSaveConfirm(false), 2000)
  }

  const handleSendReport = () => {
    setShowSendConfirm(true)
    setTimeout(() => setShowSendConfirm(false), 2000)
  }

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={onBack}
            className="glass-card rounded-xl p-3 text-sky-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 justify-center">
              <Shield className="w-8 h-8 text-sky-400" />
              Patient History
            </h1>
            <p className="text-sky-300/70 arabic-text mt-1">سجل المريض</p>
          </div>

          <div className="w-12" />
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-blue rounded-xl p-3 mb-6 flex items-center justify-center gap-3"
        >
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-emerald-300">Secure Medical Records</span>
          <span className="text-sm text-emerald-300/70 arabic-text">| سجلات طبية آمنة</span>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Type Selector */}
            <div className="flex gap-2 flex-shrink-0">
              {[
                { type: 'name' as const, icon: User, label: 'Name', labelAr: 'الاسم' },
                { type: 'phone' as const, icon: Phone, label: 'Phone', labelAr: 'الهاتف' },
                { type: 'id' as const, icon: Hash, label: 'Patient ID', labelAr: 'الرقم' }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setSearchType(option.type)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    searchType === option.type
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white'
                      : 'glass-card-blue text-sky-300 hover:text-white'
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:inline">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === 'name' ? 'Search by patient name...' :
                  searchType === 'phone' ? 'Search by phone number...' :
                  'Search by Patient ID...'
                }
                className="w-full pl-12 pr-4 py-4 bg-navy-800/50 border border-sky-500/20 rounded-xl text-white placeholder:text-sky-300/50 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="glass-card-blue rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{sampleRecords.length}</p>
              <p className="text-xs text-sky-300/70">Total Records</p>
            </div>
            <div className="glass-card-blue rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">
                {sampleRecords.filter(r => r.assessment.riskLevel === 'high' || r.assessment.riskLevel === 'critical').length}
              </p>
              <p className="text-xs text-sky-300/70">High Risk Cases</p>
            </div>
            <div className="glass-card-blue rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {sampleRecords.filter(r => r.assessment.riskLevel === 'low').length}
              </p>
              <p className="text-xs text-sky-300/70">Low Risk Cases</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <button
            onClick={onNewAssessment}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-sky-500/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Assessment</span>
            <span className="text-sm opacity-80 arabic-text">| تقييم جديد</span>
          </button>
        </motion.div>

        {/* Records List / Detail View */}
        <AnimatePresence mode="wait">
          {selectedRecord ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              {/* Back to List */}
              <button
                onClick={() => setSelectedRecord(null)}
                className="flex items-center gap-2 text-sky-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Records List</span>
                <span className="text-sm opacity-70 arabic-text">| العودة للسجلات</span>
              </button>

              {/* Patient Header Card */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedRecord.patientInfo.fullName}</h2>
                      <div className="flex items-center gap-4 mt-1 text-sky-300/70">
                        <span>{selectedRecord.patientInfo.patientId}</span>
                        <span>|</span>
                        <span>{selectedRecord.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${riskColors[selectedRecord.assessment.riskLevel]} text-white font-medium`}>
                    {riskLabels[selectedRecord.assessment.riskLevel].en}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="glass-card-blue rounded-xl p-3 text-center">
                    <p className="text-xs text-sky-300/70 mb-1">Age / العمر</p>
                    <p className="text-lg font-semibold text-white">{selectedRecord.patientInfo.age} years</p>
                  </div>
                  <div className="glass-card-blue rounded-xl p-3 text-center">
                    <p className="text-xs text-sky-300/70 mb-1">Gender / الجنس</p>
                    <p className="text-lg font-semibold text-white capitalize">{selectedRecord.patientInfo.gender}</p>
                  </div>
                  <div className="glass-card-blue rounded-xl p-3 text-center">
                    <p className="text-xs text-sky-300/70 mb-1">Date / التاريخ</p>
                    <p className="text-lg font-semibold text-white">{formatDate(selectedRecord.date)}</p>
                  </div>
                </div>
              </div>

              {/* Main Complaint */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-400" />
                  Main Complaint
                  <span className="text-sm font-normal text-sky-300/70 arabic-text">| الشكوى الرئيسية</span>
                </h3>
                <p className="text-sky-100">{selectedRecord.patientInfo.mainComplaint}</p>
              </div>

              {/* Symptoms */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-400" />
                  Recorded Symptoms
                  <span className="text-sm font-normal text-sky-300/70 arabic-text">| الأعراض المسجلة</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedRecord.symptoms.map((symptom) => (
                    <div
                      key={symptom}
                      className="glass-card-blue rounded-xl px-4 py-2 flex items-center gap-2"
                    >
                      <span className="text-white">{symptomNames[symptom]?.en || symptom}</span>
                      <span className="text-sky-300/70 text-sm arabic-text">{symptomNames[symptom]?.ar}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vital Signs */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-sky-400" />
                  Vital Signs
                  <span className="text-sm font-normal text-sky-300/70 arabic-text">| العلامات الحيوية</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <VitalCard
                    icon={Thermometer}
                    label="Temperature"
                    labelAr="الحرارة"
                    value={`${selectedRecord.vitalSigns.temperature}°C`}
                    color="text-orange-400"
                  />
                  <VitalCard
                    icon={Heart}
                    label="Heart Rate"
                    labelAr="النبض"
                    value={`${selectedRecord.vitalSigns.heartRate} BPM`}
                    color="text-red-400"
                  />
                  <VitalCard
                    icon={Activity}
                    label="Blood Pressure"
                    labelAr="الضغط"
                    value={`${selectedRecord.vitalSigns.bloodPressureSystolic}/${selectedRecord.vitalSigns.bloodPressureDiastolic}`}
                    color="text-purple-400"
                  />
                  <VitalCard
                    icon={Wind}
                    label="Oxygen Level"
                    labelAr="الأكسجين"
                    value={`${selectedRecord.vitalSigns.oxygenLevel}%`}
                    color="text-cyan-400"
                  />
                </div>
              </div>

              {/* Previous AI Assessment */}
              <div className={`glass-card rounded-2xl p-6 border-2 ${
                selectedRecord.assessment.emergencyWarning ? 'border-red-500/50' : 'border-transparent'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-400" />
                    Previous AI Assessment
                    <span className="text-sm font-normal text-sky-300/70 arabic-text">| التقييم السابق</span>
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-sky-300/70">
                    <Clock className="w-4 h-4" />
                    {formatDate(selectedRecord.date)}
                  </div>
                </div>

                {selectedRecord.assessment.emergencyWarning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4 flex items-center gap-3"
                  >
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <div>
                      <p className="text-red-300 font-medium">Emergency Warning Active</p>
                      <p className="text-red-300/70 text-sm arabic-text">تحذير طوارئ مفعّل</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-sky-300/70 mb-2">Possible Condition / الحالة المحتملة</p>
                    <p className="text-white font-medium">{selectedRecord.assessment.possibleCondition.en}</p>
                    <p className="text-sky-300/70 text-sm mt-1 arabic-text">{selectedRecord.assessment.possibleCondition.ar}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sky-300/70 mb-2">Confidence Level / مستوى الثقة</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-navy-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedRecord.assessment.confidence}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className={`h-full rounded-full bg-gradient-to-r ${riskColors[selectedRecord.assessment.riskLevel]}`}
                        />
                      </div>
                      <span className="text-white font-medium">{selectedRecord.assessment.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 glass-card-blue rounded-xl">
                  <p className="text-sm text-sky-300/70 mb-2">Recommendation / التوصية</p>
                  <p className="text-white">{selectedRecord.assessment.recommendation.en}</p>
                  <p className="text-sky-300/70 text-sm mt-2 arabic-text">{selectedRecord.assessment.recommendation.ar}</p>
                </div>
              </div>

              {/* Action Buttons for Detail View */}
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveRecord}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 glass-card-blue rounded-xl text-white font-medium hover:bg-sky-500/20 transition-colors relative overflow-hidden"
                >
                  {showSaveConfirm ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400">Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 text-sky-400" />
                      <span>Save Patient Record</span>
                      <span className="text-sm opacity-70 arabic-text">| حفظ السجل</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendReport}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-sky-500/25 transition-all relative overflow-hidden"
                >
                  {showSendConfirm ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Report Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Report to Doctor</span>
                      <span className="text-sm opacity-70 arabic-text">| إرسال للطبيب</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Disclaimer */}
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-xs text-sky-200/60">
                  This system does not replace doctors. It provides initial medical guidance only.
                </p>
                <p className="text-xs text-sky-200/60 mt-1 arabic-text">
                  هذا النظام لا يستبدل الطبيب، وإنما يقدم تقييماً صحياً أولياً فقط.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredRecords.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <Search className="w-12 h-12 text-sky-400/50 mx-auto mb-4" />
                  <p className="text-white text-lg">No records found</p>
                  <p className="text-sky-300/70 arabic-text">لم يتم العثور على سجلات</p>
                </div>
              ) : (
                filteredRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${riskColors[record.assessment.riskLevel]} flex items-center justify-center`}>
                          <User className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{record.patientInfo.fullName}</h3>
                          <div className="flex items-center gap-3 text-sm text-sky-300/70 mt-1">
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {record.patientInfo.patientId}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(record.date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="text-sm text-sky-300/70">Previous AI Assessment</p>
                          <p className="text-white font-medium">{record.assessment.possibleCondition.en}</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${riskColors[record.assessment.riskLevel]} text-white text-sm font-medium`}>
                          {riskLabels[record.assessment.riskLevel].en}
                        </div>
                        <ChevronRight className="w-5 h-5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Quick Summary */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {record.symptoms.slice(0, 3).map((symptom) => (
                        <span
                          key={symptom}
                          className="px-2 py-1 bg-sky-500/10 rounded-lg text-xs text-sky-300"
                        >
                          {symptomNames[symptom]?.en || symptom}
                        </span>
                      ))}
                      {record.symptoms.length > 3 && (
                        <span className="px-2 py-1 bg-sky-500/10 rounded-lg text-xs text-sky-300">
                          +{record.symptoms.length - 3} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function VitalCard({ 
  icon: Icon, 
  label, 
  labelAr, 
  value, 
  color 
}: { 
  icon: typeof Heart
  label: string
  labelAr: string
  value: string
  color: string
}) {
  return (
    <div className="glass-card-blue rounded-xl p-4 text-center">
      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
      <p className="text-xs text-sky-300/70 mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-sky-300/50 arabic-text">{labelAr}</p>
    </div>
  )
}
